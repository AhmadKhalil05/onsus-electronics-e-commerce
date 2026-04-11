import { useCatalog } from "@/context/CatalogContext";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { products } = useCatalog();

  const total = products.length;
  const lowStock = products.filter((p) => Number(p.available) < 15).length;
  const onSale = products.filter((p) => p.oldPrice != null).length;
  const categories = [...new Set(products.map((p) => p.category))].length;

  const cards = [
    { label: "Products", value: total, hint: "In catalog" },
    { label: "Categories", value: categories, hint: "Unique types" },
    { label: "On sale", value: onSale, hint: "With old price" },
    { label: "Low stock", value: lowStock, hint: "Available under 15" },
  ];

  return (
    <div className="p-4 p-xl-5">
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Dashboard</h1>
          <p className="text-secondary mb-0 small">
            Overview of your demo store (data in browser{" "}
            <code>localStorage</code>).
          </p>
        </div>
        <Link to="/admin/products" className="btn btn-primary">
          Manage products
        </Link>
      </div>

      <div className="row g-3 g-xl-4 mb-4">
        {cards.map((c) => (
          <div key={c.label} className="col-6 col-xl-3">
            <div className="card border-0 shadow-sm h-100 rounded-3">
              <div className="card-body">
                <p className="small text-secondary text-uppercase fw-semibold mb-1">
                  {c.label}
                </p>
                <p className="display-6 fw-bold mb-0">{c.value}</p>
                <p className="small text-muted mb-0 mt-2">{c.hint}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body">
          <h2 className="h6 fw-bold mb-3">Quick actions</h2>
          <ul className="mb-0 ps-3 small text-secondary">
            <li className="mb-2">
              <strong>Products</strong> — add, edit, delete, export/import JSON,
              reset to default catalog.
            </li>
            <li className="mb-2">
              Cart &amp; wishlist on the storefront stay in{" "}
              <code>localStorage</code>; removing a product clears it from cart
              / wishlist automatically.
            </li>
            <li>
              Change admin password via environment variable{" "}
              <code>VITE_ADMIN_PASSWORD</code> (rebuild after).
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
