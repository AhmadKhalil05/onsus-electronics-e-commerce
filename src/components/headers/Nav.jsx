import React from "react";
import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/contact", label: "Contact" },
  { to: "/login", label: "Login" },
  { to: "/register", label: "Register" },
  { to: "/cart", label: "Cart" },
  { to: "/wishlist", label: "Wishlist" },
];

export default function Nav() {
  const { pathname } = useLocation();
  return (
    <>
      {links.map(({ to, label }) => (
        <li
          key={to}
          className={`nav-item ${pathname === to ? "active" : ""}`}
        >
          <Link to={to} className="item-link body-md-2 fw-semibold link">
            <span>{label}</span>
          </Link>
        </li>
      ))}
    </>
  );
}
