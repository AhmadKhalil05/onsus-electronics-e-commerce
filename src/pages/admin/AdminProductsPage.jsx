import { showApiError } from "@/api/errors";
import {
  createProductApi,
  deleteProductApi,
  parseCreatedProductId,
  updateProductApi,
} from "@/api/products";
import { getUploadUrl, uploadFileToPresignedUrl } from "@/api/upload";
import { requireIdTokenOrRedirect } from "@/auth/session";
import { useCatalog } from "@/context/CatalogContext";
import { brands } from "@/data/filterOptions";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function parseThumbImages(value) {
  return String(value || "")
    .split(/[,\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

async function uploadOneImage(file, idToken) {
  const data = await getUploadUrl({
    idToken,
    contentType: file.type,
    fileName: file.name,
  });
  const uploadUrl = String(data?.uploadUrl || "");
  const fileUrl = String(data?.fileUrl || "");
  if (!uploadUrl || !fileUrl) {
    throw new Error("Upload service did not return uploadUrl/fileUrl");
  }
  await uploadFileToPresignedUrl(uploadUrl, file);
  return fileUrl;
}

async function resolveDraftImages(draft, imageFiles, idToken) {
  const fallbackGallery = parseThumbImages(draft.thumbImagesStr);
  const imgSrc = imageFiles.main
    ? await uploadOneImage(imageFiles.main, idToken)
    : draft.imgSrc;
  const imgHover = imageFiles.hover
    ? await uploadOneImage(imageFiles.hover, idToken)
    : draft.imgHover || undefined;
  const thumbImages =
    imageFiles.gallery.length > 0
      ? await Promise.all(imageFiles.gallery.map((f) => uploadOneImage(f, idToken)))
      : fallbackGallery;

  return { imgSrc, imgHover, thumbImages };
}

function draftToApiPayload(draft) {
  const thumbImages = parseThumbImages(draft.thumbImagesStr);
  return {
    title: draft.title,
    category: draft.category,
    price: Number(draft.price),
    oldPrice:
      draft.oldPrice === "" || draft.oldPrice == null
        ? null
        : Number(draft.oldPrice),
    imgSrc: draft.imgSrc,
    imgHover: draft.imgHover || undefined,
    thumbImages,
    filterBrands: draft.filterBrands,
    inNew: !!draft.inNew,
    isTodaysDeals: !!draft.isTodaysDeals,
    rating: Number(draft.rating),
    sold: Number(draft.sold),
    available: Number(draft.available),
    progressWidth: draft.progressWidth,
    countdownTimer: Number(draft.countdownTimer),
    salePercentage:
      draft.salePercentage === "" || draft.salePercentage == null
        ? null
        : draft.salePercentage,
  };
}

function productToDraft(p) {
  return {
    title: p.title || "",
    category: p.category || "Electronics",
    price: String(p.price ?? ""),
    oldPrice: p.oldPrice != null ? String(p.oldPrice) : "",
    imgSrc: p.imgSrc || "",
    imgHover: p.imgHover || "",
    thumbImagesStr: Array.isArray(p.thumbImages)
      ? p.thumbImages.join("\n")
      : "",
    filterBrands: [...(p.filterBrands || [])],
    inNew: !!p.inNew,
    isTodaysDeals: !!p.isTodaysDeals,
    rating: p.rating ?? 4,
    sold: p.sold ?? 0,
    available: p.available ?? 0,
    progressWidth: p.progressWidth || "50%",
    countdownTimer: p.countdownTimer ?? 86400,
    salePercentage:
      p.salePercentage != null && p.salePercentage !== ""
        ? String(p.salePercentage)
        : "",
  };
}

const emptyDraft = () => ({
  title: "",
  category: "Audio",
  price: "99",
  oldPrice: "",
  imgSrc: "",
  imgHover: "",
  thumbImagesStr: "",
  filterBrands: [],
  inNew: true,
  isTodaysDeals: false,
  rating: 4,
  sold: 10,
  available: 50,
  progressWidth: "55%",
  countdownTimer: 86400,
  salePercentage: "",
});

export default function AdminProductsPage() {
  const navigate = useNavigate();
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useCatalog();

  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [imageFiles, setImageFiles] = useState({
    main: null,
    hover: null,
    gallery: [],
  });
  const [saving, setSaving] = useState(false);
  const [mainPreview, setMainPreview] = useState("");
  const [hoverPreview, setHoverPreview] = useState("");
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [lastPasteInfo, setLastPasteInfo] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        String(p.id).includes(q) ||
        (p.category || "").toLowerCase().includes(q)
    );
  }, [products, query]);

  const openCreate = () => {
    setEditingId(null);
    setDraft(emptyDraft());
    setImageFiles({ main: null, hover: null, gallery: [] });
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setDraft(productToDraft(p));
    setImageFiles({ main: null, hover: null, gallery: [] });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setImageFiles({ main: null, hover: null, gallery: [] });
  };

  const toggleBrand = (id) => {
    setDraft((d) => {
      const set = new Set(d.filterBrands);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return { ...d, filterBrands: [...set] };
    });
  };

  const save = async (e) => {
    e.preventDefault();
    if (!imageFiles.main && !draft.imgSrc) {
      showApiError("Save product", new Error("Main image is required."));
      return;
    }
    const idToken = await requireIdTokenOrRedirect({
      navigate,
      nextPath: "/admin/products",
    });
    if (!idToken) {
      return;
    }

    setSaving(true);
    try {
      const { imgSrc, imgHover, thumbImages } = await resolveDraftImages(
        draft,
        imageFiles,
        idToken
      );
      const raw = {
        title: draft.title,
        category: draft.category,
        price: draft.price,
        oldPrice: draft.oldPrice === "" ? null : draft.oldPrice,
        imgSrc,
        imgHover,
        thumbImages,
        filterBrands: draft.filterBrands,
        inNew: draft.inNew,
        isTodaysDeals: draft.isTodaysDeals,
        rating: draft.rating,
        sold: draft.sold,
        available: draft.available,
        progressWidth: draft.progressWidth,
        countdownTimer: draft.countdownTimer,
        salePercentage:
          draft.salePercentage === "" ? null : draft.salePercentage,
      };
      const apiPayload = draftToApiPayload({
        ...draft,
        imgSrc,
        imgHover,
        thumbImagesStr: thumbImages.join("\n"),
      });

      if (editingId != null) {
        await updateProductApi(editingId, apiPayload, idToken);
        updateProduct(editingId, raw);
      } else {
        const res = await createProductApi(apiPayload, idToken);
        const serverId = parseCreatedProductId(res);
        if (serverId != null) {
          addProduct({ ...raw, id: serverId });
        } else {
          addProduct(raw);
        }
      }
      closeModal();
    } catch (err) {
      showApiError("Save product", err);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (imageFiles.main) {
      const objectUrl = URL.createObjectURL(imageFiles.main);
      setMainPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setMainPreview(draft.imgSrc || "");
  }, [imageFiles.main, draft.imgSrc]);

  useEffect(() => {
    if (imageFiles.hover) {
      const objectUrl = URL.createObjectURL(imageFiles.hover);
      setHoverPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setHoverPreview(draft.imgHover || "");
  }, [imageFiles.hover, draft.imgHover]);

  useEffect(() => {
    if (imageFiles.gallery.length > 0) {
      const objectUrls = imageFiles.gallery.map((f) => URL.createObjectURL(f));
      setGalleryPreviews(objectUrls);
      return () => objectUrls.forEach((u) => URL.revokeObjectURL(u));
    }
    setGalleryPreviews(parseThumbImages(draft.thumbImagesStr));
  }, [imageFiles.gallery, draft.thumbImagesStr]);

  const getClipboardImageFiles = (e) => {
    const clipboardItems = Array.from(e.clipboardData?.items || []);
    const pastedImages = clipboardItems
      .filter((item) => item.kind === "file" && item.type.startsWith("image/"))
      .map((item) => item.getAsFile())
      .filter(Boolean);
    return pastedImages.map((file, index) => {
      if (file.name) return file;
      const ext = file.type.split("/")[1] || "png";
      return new File([file], `pasted-${Date.now()}-${index + 1}.${ext}`, {
        type: file.type || "image/png",
      });
    });
  };

  const handlePasteImages = (e) => {
    const pastedImages = getClipboardImageFiles(e);

    if (pastedImages.length === 0) return;
    e.preventDefault();

    setImageFiles((prev) => {
      let nextMain = prev.main;
      let nextHover = prev.hover;
      const nextGallery = [...prev.gallery];

      for (const file of pastedImages) {
        if (!nextMain) nextMain = file;
        else if (!nextHover) nextHover = file;
        else nextGallery.push(file);
      }

      return { main: nextMain, hover: nextHover, gallery: nextGallery };
    });
    setLastPasteInfo(
      `Pasted ${pastedImages.length} image${pastedImages.length > 1 ? "s" : ""} from clipboard.`
    );
  };

  const handlePasteMain = (e) => {
    const pastedImages = getClipboardImageFiles(e);
    if (pastedImages.length === 0) return;
    e.preventDefault();
    setImageFiles((prev) => ({ ...prev, main: pastedImages[0] }));
    setLastPasteInfo("Main image pasted from clipboard.");
  };

  const handlePasteHover = (e) => {
    const pastedImages = getClipboardImageFiles(e);
    if (pastedImages.length === 0) return;
    e.preventDefault();
    setImageFiles((prev) => ({ ...prev, hover: pastedImages[0] }));
    setLastPasteInfo("Hover image pasted from clipboard.");
  };

  const handlePasteGallery = (e) => {
    const pastedImages = getClipboardImageFiles(e);
    if (pastedImages.length === 0) return;
    e.preventDefault();
    setImageFiles((prev) => ({ ...prev, gallery: [...prev.gallery, ...pastedImages] }));
    setLastPasteInfo(
      `Added ${pastedImages.length} image${pastedImages.length > 1 ? "s" : ""} to gallery from clipboard.`
    );
  };

  const confirmDelete = async (p) => {
    if (
      !window.confirm(`Delete “${p.title}” (ID ${p.id})? This cannot be undone.`)
    ) {
      return;
    }
    const idToken = await requireIdTokenOrRedirect({
      navigate,
      nextPath: "/admin/products",
    });
    if (!idToken) {
      return;
    }
    try {
      await deleteProductApi(p.id, idToken);
      deleteProduct(p.id);
    } catch (err) {
      showApiError("Delete product", err);
    }
  };

  return (
    <div className="p-4 p-xl-5">
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Products</h1>
          <p className="text-secondary small mb-0">
            Product list and CRUD actions now come directly from API Gateway.
            Create, edit, and delete use the admin endpoint with your Cognito{" "}
            <code className="small">idToken</code> (Bearer).
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            + Add product
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3 mb-3">
        <div className="card-body py-3">
          <input
            type="search"
            className="form-control"
            placeholder="Search by title, ID, or category…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 small">
            <thead className="table-light">
              <tr>
                <th style={{ width: 56 }}>#</th>
                <th style={{ width: 64 }}>Img</th>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th style={{ width: 140 }} className="text-end">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td className="text-muted">{p.id}</td>
                  <td>
                    <img
                      src={p.imgSrc}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded object-fit-cover"
                      style={{ objectFit: "cover" }}
                    />
                  </td>
                  <td className="fw-medium">{p.title}</td>
                  <td>{p.category}</td>
                  <td>
                    ${Number(p.price).toFixed(2)}
                    {p.oldPrice != null && (
                      <span className="text-muted text-decoration-line-through ms-1">
                        ${Number(p.oldPrice).toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td>{p.available}</td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => openEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => confirmDelete(p)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-secondary py-5 mb-0">
            No products match your search.
          </p>
        )}
      </div>

      {modalOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ background: "rgba(0,0,0,.45)", zIndex: 1050 }}
          role="dialog"
        >
          <div
            className="bg-white rounded-3 shadow-lg w-100 overflow-auto"
            style={{ maxWidth: 720, maxHeight: "92vh" }}
          >
            <div className="d-flex justify-content-between align-items-center border-bottom px-4 py-3 sticky-top bg-white">
              <h2 className="h5 mb-0">
                {editingId != null ? "Edit product" : "New product"}
              </h2>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeModal}
              />
            </div>
            <form onSubmit={save} className="p-4">
              <div className="row g-3">
                <div className="col-12">
                  <div className="alert alert-light border small mb-0 py-2">
                    Paste images with <kbd>Ctrl</kbd> + <kbd>V</kbd> into any
                    paste box below (or use auto-paste).
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary ms-2"
                      onPaste={handlePasteImages}
                    >
                      Auto-paste
                    </button>
                    {lastPasteInfo ? <span className="ms-2">{lastPasteInfo}</span> : null}
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold">Title</label>
                  <input
                    className="form-control"
                    required
                    value={draft.title}
                    onChange={(e) =>
                      setDraft({ ...draft, title: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">
                    Category
                  </label>
                  <input
                    className="form-control"
                    required
                    value={draft.category}
                    onChange={(e) =>
                      setDraft({ ...draft, category: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-semibold">Price</label>
                  <input
                    className="form-control"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={draft.price}
                    onChange={(e) =>
                      setDraft({ ...draft, price: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-semibold">
                    Old price (optional)
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    step="0.01"
                    min="0"
                    value={draft.oldPrice}
                    onChange={(e) =>
                      setDraft({ ...draft, oldPrice: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">
                    Main image
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setImageFiles({
                        ...imageFiles,
                        main: e.target.files?.[0] || null,
                      })
                    }
                  />
                  {imageFiles.main?.name && (
                    <div className="form-text">Selected: {imageFiles.main.name}</div>
                  )}
                  <input
                    className="form-control mt-2"
                    type="text"
                    readOnly
                    value=""
                    placeholder="Click here then Ctrl+V to paste main image"
                    onPaste={handlePasteMain}
                  />
                  {mainPreview && (
                    <div className="mt-2">
                      <img
                        src={mainPreview}
                        alt="Main preview"
                        className="rounded border"
                        style={{ width: 96, height: 96, objectFit: "cover" }}
                      />
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">
                    Hover image
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setImageFiles({
                        ...imageFiles,
                        hover: e.target.files?.[0] || null,
                      })
                    }
                  />
                  {imageFiles.hover?.name && (
                    <div className="form-text">Selected: {imageFiles.hover.name}</div>
                  )}
                  <input
                    className="form-control mt-2"
                    type="text"
                    readOnly
                    value=""
                    placeholder="Click here then Ctrl+V to paste hover image"
                    onPaste={handlePasteHover}
                  />
                  {hoverPreview && (
                    <div className="mt-2">
                      <img
                        src={hoverPreview}
                        alt="Hover preview"
                        className="rounded border"
                        style={{ width: 96, height: 96, objectFit: "cover" }}
                      />
                    </div>
                  )}
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold">
                    Gallery images (multiple files)
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) =>
                      setImageFiles({
                        ...imageFiles,
                        gallery: Array.from(e.target.files || []),
                      })
                    }
                  />
                  {imageFiles.gallery.length > 0 && (
                    <div className="form-text">
                      Selected {imageFiles.gallery.length} gallery file
                      {imageFiles.gallery.length > 1 ? "s" : ""}.
                    </div>
                  )}
                  <input
                    className="form-control mt-2"
                    type="text"
                    readOnly
                    value=""
                    placeholder="Click here then Ctrl+V to add image(s) to gallery"
                    onPaste={handlePasteGallery}
                  />
                  {galleryPreviews.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {galleryPreviews.map((src, idx) => (
                        <img
                          key={`${src}-${idx}`}
                          src={src}
                          alt={`Gallery preview ${idx + 1}`}
                          className="rounded border"
                          style={{ width: 72, height: 72, objectFit: "cover" }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold d-block mb-2">
                    Brands (filters)
                  </label>
                  <div className="d-flex flex-wrap gap-2">
                    {brands.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        className={`btn btn-sm ${
                          draft.filterBrands.includes(b.id)
                            ? "btn-primary"
                            : "btn-outline-secondary"
                        }`}
                        onClick={() => toggleBrand(b.id)}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Rating</label>
                  <select
                    className="form-select"
                    value={draft.rating}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        rating: Number(e.target.value),
                      })
                    }
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} stars
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Sold</label>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    value={draft.sold}
                    onChange={(e) =>
                      setDraft({ ...draft, sold: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">
                    Available
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    value={draft.available}
                    onChange={(e) =>
                      setDraft({ ...draft, available: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">
                    Sale % label (optional, e.g. 20%)
                  </label>
                  <input
                    className="form-control"
                    value={draft.salePercentage}
                    onChange={(e) =>
                      setDraft({ ...draft, salePercentage: e.target.value })
                    }
                    placeholder="Leave empty to auto from prices"
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-semibold">
                    Progress bar
                  </label>
                  <input
                    className="form-control"
                    value={draft.progressWidth}
                    onChange={(e) =>
                      setDraft({ ...draft, progressWidth: e.target.value })
                    }
                    placeholder="55%"
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-semibold">
                    Countdown (sec)
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    value={draft.countdownTimer}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        countdownTimer: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="col-12 d-flex flex-wrap gap-3">
                  <label className="d-flex align-items-center gap-2 mb-0">
                    <input
                      type="checkbox"
                      checked={draft.inNew}
                      onChange={(e) =>
                        setDraft({ ...draft, inNew: e.target.checked })
                      }
                    />
                    <span className="small">New product</span>
                  </label>
                  <label className="d-flex align-items-center gap-2 mb-0">
                    <input
                      type="checkbox"
                      checked={draft.isTodaysDeals}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          isTodaysDeals: e.target.checked,
                        })
                      }
                    />
                    <span className="small">Today&apos;s deal</span>
                  </label>
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Saving…"
                    : editingId != null
                      ? "Save changes"
                      : "Create product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
