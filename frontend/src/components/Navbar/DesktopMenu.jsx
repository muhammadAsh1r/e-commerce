import React from "react";
import { Link } from "react-router-dom";

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/settings", label: "Settings" },
];

export const DesktopMenu = ({ user, onLogout }) => {
  const linkClass = "text-gray-700 hover:text-teal-500 font-medium";
  const logoutBtnClass =
    "bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium transition";
  const loginBtnClass =
    "bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md font-medium transition";

  return (
    <div className="hidden md:flex space-x-6 items-center">
      {user?.role !== "admin" && (
        <>
          <Link to="/" className={linkClass}>
            Home
          </Link>
          <Link to="/products" className={linkClass}>
            Products
          </Link>
          <Link to="/cart" className={linkClass}>
            Cart
          </Link>
        </>
      )}

      {user?.role === "admin" &&
        adminLinks.map(({ to, label }) => (
          <Link key={to} to={to} className={linkClass}>
            {label}
          </Link>
        ))}

      {user ? (
        <>
          <Link to="/profile" className={linkClass}>
            {user.name}
          </Link>
          <button onClick={onLogout} className={logoutBtnClass}>
            Logout
          </button>
        </>
      ) : (
        <Link to="/login" className={loginBtnClass}>
          Login
        </Link>
      )}
    </div>
  );
};
