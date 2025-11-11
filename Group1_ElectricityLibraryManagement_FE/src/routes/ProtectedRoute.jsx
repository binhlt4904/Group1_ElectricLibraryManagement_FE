import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../components/contexts/UserProvider";

 export const ProtectedRoute = ({children, allowedRoles}) => {
  const { user, loading} = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Hoặc một spinner/loading indicator khác
  }

  console.log("ProtectedRoute - Current user:", user);

  if (!user) {
    // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
    return <Navigate to="/login" replace />;
  }

  const hasAccess = allowedRoles.includes(user.role);

  if (!hasAccess) {
    // Nếu không có quyền truy cập, chuyển hướng đến trang không được phép
    return <Navigate to="/" replace />;
   
  }

      return children;
};