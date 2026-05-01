import { useAdminAuth } from "@/context/AdminAuthContext";
import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
  const { login, isAuthenticated, isChecking } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (isChecking) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <p className="text-secondary mb-0">Checking session…</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const result = await login(email.trim(), password);
      if (result?.ok) {
        navigate("/admin/dashboard", { replace: true });
        return;
      }
      setError(result?.message || "Admin sign-in failed.");
    } catch (err) {
      setError(err?.message || "Admin sign-in failed.");
    } finally {
      setSubmitting(false);
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
          Sign in with your Cognito account. Access is granted only if the user
          belongs to the <code>admin</code> group.
        </p>
        <form onSubmit={submit}>
          <label className="form-label fw-semibold small">Email</label>
          <input
            type="email"
            className="form-control mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            autoFocus
            required
          />
          <label className="form-label fw-semibold small">Password</label>
          <input
            type="password"
            className="form-control mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          {error && (
            <p className="small text-danger mb-3 mb-md-0">{error}</p>
          )}
          <button
            type="submit"
            className="btn btn-primary w-100 mt-2"
            disabled={submitting}
          >
            {submitting ? "Signing in…" : "Enter admin"}
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
