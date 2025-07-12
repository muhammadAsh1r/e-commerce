import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/user/userSlice";
import { Menu, X } from "lucide-react";
import { DesktopMenu } from "./DesktopMenu";
import { MobileMenu } from "./MobileMenu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 text-xl font-bold text-teal-600">
            <Link to="/">MyStore</Link>
          </div>

          {/* Desktop Menu */}
          <DesktopMenu user={user} onLogout={handleLogout} />

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && <MobileMenu user={user} onLogout={handleLogout} />}
      </div>
    </nav>
  );
};

export default Navbar;
