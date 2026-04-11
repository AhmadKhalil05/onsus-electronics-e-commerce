import React from "react";
import { Link } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/contact", label: "Contact" },
  { to: "/login", label: "Login" },
  { to: "/register", label: "Register" },
  { to: "/cart", label: "Cart" },
  { to: "/checkout", label: "Checkout" },
  { to: "/wishlist", label: "Wishlist" },
];

export default function MobileMenu() {
  return (
    <div className="offcanvas offcanvas-start canvas-mb" id="mobileMenu">
      <span
        className="icon-close btn-close-mb link"
        data-bs-dismiss="offcanvas"
      />
      <div className="logo-site">
        <Link to="/" data-bs-dismiss="offcanvas">
          <img alt="" src="/images/logo/logo.svg" width={185} height={41} />
        </Link>
      </div>
      <div className="mb-canvas-content">
        <div className="mb-body">
          <ul className="nav-ul-mb" style={{ padding: "1rem 0" }}>
            {links.map(({ to, label }) => (
              <li key={to} className="nav-mb-item">
                <Link
                  to={to}
                  className="mb-menu-link body-md-2 fw-semibold"
                  data-bs-dismiss="offcanvas"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
