import { useContextElement } from "@/context/Context";
import { useCatalog } from "@/context/CatalogContext";

export default function AddToQuickview({ productId, tooltipClass = "" }) {
  const { getProductById, products } = useCatalog();
  const product =
    getProductById(productId) || products[0];
  const { setQuickViewItem } = useContextElement();
  if (!product?.id) return null;
  return (
    <a
      href="#quickView"
      data-bs-toggle="modal"
      onClick={() => setQuickViewItem(product)}
      className={`box-icon quickview btn-icon-action hover-tooltip ${tooltipClass}`}
    >
      <span className="icon icon-view" />
      <span className="tooltip">Quick View</span>
    </a>
  );
}
