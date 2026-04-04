import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const { user } = useSelector((state) => state.user);

  if (!user || user.role !== "admin") {
    // If user is not admin, redirect to home or login
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
