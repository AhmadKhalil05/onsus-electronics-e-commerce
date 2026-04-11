import { useAdminAuth } from "@/context/AdminAuthContext";
import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
  const { login, isAuthenticated } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (login(password)) {
      navigate("/admin/dashboard", { replace: true });
    } else {
      setError("Wrong password.");
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center px-3"
      style={{ background: "linear-gradient(145deg, #0f1419, #1a2332)" }}
    >
      <div
        className="w-100 p-4 p-md-5 rounded-4 shadow-lg"
        style={{ maxWidth: 420, background: "#fff" }}
      >
        <h1 className="h4 fw-bold mb-1">Admin sign in</h1>
        <p className="small text-secondary mb-4">
          Demo password: <code>admin123</code> or set{" "}
          <code>VITE_ADMIN_PASSWORD</code> in <code>.env</code>.
        </p>
        <form onSubmit={submit}>
          <label className="form-label fw-semibold small">Password</label>
          <input
            type="password"
            className="form-control mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            autoFocus
          />
          {error && (
            <p className="small text-danger mb-3 mb-md-0">{error}</p>
          )}
          <button type="submit" className="btn btn-primary w-100 mt-2">
            Enter admin
          </button>
        </form>
        <p className="small text-center mt-4 mb-0">
          <Link to="/" className="text-secondary">
            ← Back to store
          </Link>
        </p>
      </div>
    </div>
  );
}
