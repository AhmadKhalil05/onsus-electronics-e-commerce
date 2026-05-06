import { fetchProducts } from "@/api/products";
import { showApiError } from "@/api/errors";
import { useUserAuth } from "@/context/UserAuthContext";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const catalogContext = createContext(null);

export function useCatalog() {
  const ctx = useContext(catalogContext);
  if (!ctx) {
    throw new Error("useCatalog must be used within CatalogProvider");
  }
  return ctx;
}

export function normalizeProduct(raw) {
  const resolvedId =
    raw.id != null && String(raw.id).trim()
      ? String(raw.id)
      : raw.productId != null && String(raw.productId).trim()
        ? String(raw.productId)
        : raw.product_id != null && String(raw.product_id).trim()
          ? String(raw.product_id)
          : "";
  const imgSrc = raw.imgSrc || "/images/store/p1.jpg";
  let thumbs = Array.isArray(raw.thumbImages)
    ? [...raw.thumbImages]
    : typeof raw.thumbImages === "string"
      ? raw.thumbImages
          .split(/[,\n]+/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [imgSrc];
  if (!thumbs.length) thumbs = [imgSrc];

  const price = Number(raw.price);
  const safePrice = Number.isFinite(price) ? price : 0;
  const oldRaw = raw.oldPrice;
  const oldPrice =
    oldRaw === "" || oldRaw === null || oldRaw === undefined
      ? null
      : Number(oldRaw);
  const safeOld =
    oldPrice != null && Number.isFinite(oldPrice) ? oldPrice : null;
  const saveAmount =
    safeOld != null ? Math.max(0, Math.round((safeOld - safePrice) * 100) / 100) : 0;

  const brands = Array.isArray(raw.filterBrands) ? raw.filterBrands : [];

  const resolvedTitle = String(raw.title || raw.name || "Product");
  const resolvedDescription = String(raw.description || "");

  return {
    id: resolvedId,
    productId: resolvedId,
    wowDelay: raw.wowDelay ?? "0s",
    imgSrc,
    thumbImages: thumbs,
    width: Number(raw.width) || 450,
    height: Number(raw.height) || 390,
    category: String(raw.category || "Electronics"),
    title: resolvedTitle,
    name: resolvedTitle,
    description: resolvedDescription,
    price: safePrice,
    oldPrice: safeOld,
    saveAmount,
    salePercentage:
      raw.salePercentage === "" || raw.salePercentage == null
        ? safeOld != null
          ? `${Math.min(99, Math.round(((safeOld - safePrice) / safeOld) * 100))}%`
          : null
        : raw.salePercentage,
    countdownTimer: Number(raw.countdownTimer) || 86400,
    sold: Number(raw.sold) || 0,
    available: Number(raw.available) || 0,
    progressWidth: raw.progressWidth || "50%",
    filterBrands: brands,
    inNew: Boolean(raw.inNew),
    isTodaysDeals: Boolean(raw.isTodaysDeals),
    rating: Math.min(5, Math.max(1, Number(raw.rating) || 4)),
    imgHover: raw.imgHover || thumbs[1] || imgSrc,
    animation: raw.animation || "fadeInUp",
  };
}

export function CatalogProvider({ children }) {
  const { isLoading: authLoading, isAuthenticated, user } = useUserAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    fetchProducts()
      .then((result) => {
        if (cancelled) return;
        const rawList = Array.isArray(result?.items) ? result.items : [];
        if (!Array.isArray(rawList)) {
          showApiError(
            "Load products",
            new Error(
              "The server returned an unexpected shape (expected products list in items[])."
            )
          );
          return;
        }
        const normalized = rawList.map((p, i) =>
          normalizeProduct({
            ...p,
            id:
              p.id != null && String(p.id).trim()
                ? p.id
                : p.productId != null && String(p.productId).trim()
                  ? p.productId
                  : p.product_id != null && String(p.product_id).trim()
                    ? p.product_id
                    : `row-${i + 1}`,
          })
        );
        setProducts(normalized);
      })
      .catch((err) => {
        if (cancelled) return;
        setProducts([]);
        showApiError("Load products", err);
      });
    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated, user?.userId]);

  const getProductById = useCallback(
    (id) => products.find((p) => String(p.id) === String(id)),
    [products]
  );

  const addProduct = useCallback((partial) => {
    setProducts((prev) => {
      const hasServerId =
        partial?.id != null && String(partial.id).trim() !== "";
      const nextId = hasServerId
        ? String(partial.id)
        : prev.length === 0
          ? "row-1"
          : `row-${prev.length + 1}`;
      const normalized = normalizeProduct({ ...partial, id: nextId });
      return [...prev, normalized];
    });
  }, []);

  const updateProduct = useCallback((id, partial) => {
    setProducts((prev) =>
      prev.map((p) =>
        String(p.id) === String(id)
          ? normalizeProduct({ ...p, ...partial, id: p.id })
          : p
      )
    );
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
  }, []);

  const value = useMemo(
    () => ({
      products,
      getProductById,
      addProduct,
      updateProduct,
      deleteProduct,
    }),
    [
      products,
      getProductById,
      addProduct,
      updateProduct,
      deleteProduct,
    ]
  );

  return (
    <catalogContext.Provider value={value}>{children}</catalogContext.Provider>
  );
}
