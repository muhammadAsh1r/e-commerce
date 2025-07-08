import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Brand */}
          <Link to="/" className="text-teal-500 text-2xl font-bold">
            ShopEase
          </Link>

          {/* Navigation Links */}
          <div className="space-x-6 hidden md:flex">
            <Link
              to="/"
              className="text-gray-700 hover:text-teal-500 font-medium"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-gray-700 hover:text-teal-500 font-medium"
            >
              Products
            </Link>
            <Link
              to="/cart"
              className="text-gray-700 hover:text-teal-500 font-medium"
            >
              Cart
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-teal-500 font-medium"
            >
              Contact
            </Link>
          </div>

          {/* CTA or Auth */}
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md font-medium transition"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
