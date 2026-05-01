import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useUserAuth } from "@/context/UserAuthContext";

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
  const { isAuthenticated, logout } = useUserAuth();
  const visibleLinks = links.filter(({ to }) =>
    isAuthenticated ? to !== "/login" && to !== "/register" : true
  );
  return (
    <>
      {visibleLinks.map(({ to, label }) => (
        <li
          key={to}
          className={`nav-item ${pathname === to ? "active" : ""}`}
        >
          <Link to={to} className="item-link body-md-2 fw-semibold link">
            <span>{label}</span>
          </Link>
        </li>
      ))}
      {isAuthenticated && (
        <li className="nav-item">
          <button
            type="button"
            className="item-link body-md-2 fw-semibold link bg-transparent border-0 p-0"
            onClick={logout}
          >
            <span>Logout</span>
          </button>
        </li>
      )}
    </>
  );
}
