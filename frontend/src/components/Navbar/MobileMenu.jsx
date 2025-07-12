import React from "react";
import { Link } from "react-router-dom";

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/reviews", label: "Reviews" },
  { to: "/admin/coupons", label: "Coupons" },
  { to: "/admin/shipping", label: "Shipping" },
  { to: "/admin/transactions", label: "Transactions" },
  { to: "/admin/reports", label: "Reports" },
  { to: "/admin/settings", label: "Settings" },
  { to: "/admin/settings", label: "History" },
];

export const MobileMenu = ({ user, onLogout }) => {
  const linkClass = "block text-gray-700 hover:text-teal-500 font-medium";
  const logoutBtnClass =
    "block bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium transition w-fit";
  const loginBtnClass =
    "block bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md font-medium transition w-fit";

  return (
    <div className="md:hidden mt-2 space-y-2 pb-4">
      <Link to="/" className={linkClass}>
        Home
      </Link>
      <Link to="/products" className={linkClass}>
        Products
      </Link>
      <Link to="/cart" className={linkClass}>
        Cart
      </Link>
      <Link to="/order" className={linkClass}>
        Order
      </Link>

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
