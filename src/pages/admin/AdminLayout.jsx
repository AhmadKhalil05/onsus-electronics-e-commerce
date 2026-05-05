import { useAdminAuth } from "@/context/AdminAuthContext";
import { Link, NavLink, Outlet } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `nav-link rounded px-3 py-2 ${isActive ? "bg-primary text-white" : "text-white-50"}`;

export default function AdminLayout() {
  const { logout } = useAdminAuth();

  return (
    <div className="d-flex min-vh-100" style={{ background: "#0f1419" }}>
      <aside
        className="text-white flex-shrink-0 d-flex flex-column"
        style={{ width: 268, background: "#151b22" }}
      >
        <div className="p-4 border-bottom border-secondary border-opacity-25">
          <Link
            to="/admin/dashboard"
            className="text-white text-decoration-none h5 mb-0 fw-bold"
          >
            Onsus Admin
          </Link>
          <p className="small text-white-50 mb-0 mt-2">Store &amp; catalog</p>
        </div>
        <nav className="nav flex-column gap-1 p-3 flex-grow-1">
          <NavLink to="/admin/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={linkClass}>
            Products (CRUD)
          </NavLink>
          <NavLink to="/admin/contacts" className={linkClass}>
            Messages
          </NavLink>
          <Link
            to="/"
            className="nav-link text-white-50 rounded px-3 py-2"
            target="_blank"
            rel="noreferrer"
          >
            Open storefront ↗
          </Link>
        </nav>
        <div className="p-3 border-top border-secondary border-opacity-25">
          <button
            type="button"
            className="btn btn-outline-light btn-sm w-100"
            onClick={logout}
          >
            Log out
          </button>
        </div>
      </aside>
      <main
        className="flex-grow-1 overflow-auto"
        style={{ background: "#f4f6f9", minHeight: "100vh" }}
      >
        <Outlet />
      </main>
    </div>
  );
}
