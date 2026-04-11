import { useAdminAuth } from "@/context/AdminAuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function RequireAdmin() {
  const { isAuthenticated } = useAdminAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
}
