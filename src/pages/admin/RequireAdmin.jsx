import { useAdminAuth } from "@/context/AdminAuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function RequireAdmin() {
  const { isAuthenticated, isChecking } = useAdminAuth();
  if (isChecking) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <p className="text-secondary mb-0">Checking admin access…</p>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
}
