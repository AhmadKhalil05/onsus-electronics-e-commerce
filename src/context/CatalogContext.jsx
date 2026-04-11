import { cloneDefaultCatalog } from "@/data/products";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "onsus_catalog_v1";

const catalogContext = createContext(null);

export function useCatalog() {
  const ctx = useContext(catalogContext);
  if (!ctx) {
    throw new Error("useCatalog must be used within CatalogProvider");
  }
  return ctx;
}

function loadStoredCatalog() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!Array.isArray(data) || data.length === 0) return null;
    return data;
  } catch {
    return null;
  }
}

export function normalizeProduct(raw) {
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
  while (thumbs.length < 4) {
    thumbs.push(thumbs[thumbs.length - 1]);
  }

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

  return {
    id: raw.id,
    wowDelay: raw.wowDelay ?? "0s",
    imgSrc,
    thumbImages: thumbs,
    width: Number(raw.width) || 450,
    height: Number(raw.height) || 390,
    category: String(raw.category || "Electronics"),
    title: String(raw.title || "Product"),
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
  const [products, setProducts] = useState(() => {
    const stored = loadStoredCatalog();
    return stored || cloneDefaultCatalog();
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.warn("Catalog save failed", e);
    }
  }, [products]);

  const getProductById = useCallback(
    (id) => products.find((p) => String(p.id) === String(id)),
    [products]
  );

  const addProduct = useCallback((partial) => {
    setProducts((prev) => {
      const nextId =
        prev.length === 0
          ? 1
          : Math.max(...prev.map((p) => Number(p.id) || 0)) + 1;
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

  const resetToDefault = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProducts(cloneDefaultCatalog());
  }, []);

  const importCatalog = useCallback((list) => {
    if (!Array.isArray(list) || !list.length) return false;
    const normalized = list.map((p, i) =>
      normalizeProduct({
        ...p,
        id: p.id != null ? p.id : i + 1,
      })
    );
    setProducts(normalized);
    return true;
  }, []);

  const value = useMemo(
    () => ({
      products,
      getProductById,
      addProduct,
      updateProduct,
      deleteProduct,
      resetToDefault,
      importCatalog,
    }),
    [
      products,
      getProductById,
      addProduct,
      updateProduct,
      deleteProduct,
      resetToDefault,
      importCatalog,
    ]
  );

  return (
    <catalogContext.Provider value={value}>{children}</catalogContext.Provider>
  );
}
