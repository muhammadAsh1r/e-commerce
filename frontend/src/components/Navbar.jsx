import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Optional: use Heroicons or any other icon set

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="text-teal-500 text-2xl font-bold">
            ShopEase
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-teal-500 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-teal-500 font-medium">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-teal-500 font-medium">
              Products
            </Link>
            <Link to="/cart" className="text-gray-700 hover:text-teal-500 font-medium">
              Cart
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-teal-500 font-medium">
              Contact
            </Link>
            <Link
              to="/login"
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md font-medium transition"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Mobile Links */}
        {isOpen && (
          <div className="md:hidden mt-2 space-y-2 pb-4">
            <Link to="/" className="block text-gray-700 hover:text-teal-500 font-medium">
              Home
            </Link>
            <Link to="/products" className="block text-gray-700 hover:text-teal-500 font-medium">
              Products
            </Link>
            <Link to="/cart" className="block text-gray-700 hover:text-teal-500 font-medium">
              Cart
            </Link>
            <Link to="/contact" className="block text-gray-700 hover:text-teal-500 font-medium">
              Contact
            </Link>
            <Link
              to="/login"
              className="block bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md font-medium transition w-fit"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
