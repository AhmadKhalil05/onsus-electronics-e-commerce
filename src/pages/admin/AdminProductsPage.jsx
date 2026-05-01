import { showApiError } from "@/api/errors";
import {
  createProductApi,
  deleteProductApi,
  parseCreatedProductId,
  updateProductApi,
} from "@/api/products";
import { requireIdTokenOrRedirect } from "@/auth/session";
import { useCatalog } from "@/context/CatalogContext";
import { brands } from "@/data/filterOptions";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function draftToApiPayload(draft) {
  const thumbImages = String(draft.thumbImagesStr || "")
    .split(/[,\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
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
  imgSrc: "/images/store/p1.jpg",
  imgHover: "/images/store/p1b.jpg",
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
  const [saving, setSaving] = useState(false);

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
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setDraft(productToDraft(p));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
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
    const idToken = await requireIdTokenOrRedirect({
      navigate,
      nextPath: "/admin/products",
    });
    if (!idToken) {
      return;
    }

    const thumbImages = String(draft.thumbImagesStr || "")
      .split(/[,\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const raw = {
      title: draft.title,
      category: draft.category,
      price: draft.price,
      oldPrice: draft.oldPrice === "" ? null : draft.oldPrice,
      imgSrc: draft.imgSrc,
      imgHover: draft.imgHover || undefined,
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

    const apiPayload = draftToApiPayload(draft);
    setSaving(true);
    try {
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
                    Main image URL
                  </label>
                  <input
                    className="form-control"
                    required
                    value={draft.imgSrc}
                    onChange={(e) =>
                      setDraft({ ...draft, imgSrc: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">
                    Hover image URL
                  </label>
                  <input
                    className="form-control"
                    value={draft.imgHover}
                    onChange={(e) =>
                      setDraft({ ...draft, imgHover: e.target.value })
                    }
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold">
                    Gallery URLs (one per line, min 4 padded automatically)
                  </label>
                  <textarea
                    className="form-control font-monospace small"
                    rows={4}
                    value={draft.thumbImagesStr}
                    onChange={(e) =>
                      setDraft({ ...draft, thumbImagesStr: e.target.value })
                    }
                    placeholder="/images/store/p1.jpg&#10;/images/store/p1b.jpg"
                  />
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
