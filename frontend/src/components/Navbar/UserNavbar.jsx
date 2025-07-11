import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../features/category/categorySlice";

const UserNavbar = () => {
  const dispatch = useDispatch();

  const { items: categories } = useSelector((state) => state.categories);

  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const rootCategories = categories.filter((cat) => !cat.parent);
  const childCategories = categories.filter((cat) => cat.parent);

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <nav className="bg-teal-500 text-white flex items-center px-6 py-3">
      {/* Search (30%) */}
      <div className="w-3/10 max-w-xs mr-8">
        <input
          type="search"
          placeholder="Search products..."
          className="w-full rounded-xl py-2 px-3 bg-white text-teal-700 placeholder-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300"
        />
      </div>

      {/* Categories (70%) aligned right */}
      <ul className="flex space-x-6 flex-grow justify-end">
        {rootCategories.map((rootCat) => {
          const children = childCategories.filter(
            (child) => child.parent === rootCat._id
          );

          return (
            <li
              key={rootCat._id}
              className="relative"
              onMouseEnter={() => setOpenDropdown(rootCat._id)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                onClick={() => toggleDropdown(rootCat._id)}
                className="flex items-center space-x-1 font-semibold hover:text-teal-300 focus:outline-none"
              >
                <span>{rootCat.name}</span>
                <svg
                  className={`w-3 h-3 transition-transform ${
                    openDropdown === rootCat._id ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openDropdown === rootCat._id && children.length > 0 && (
                <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  {children.map((child) => (
                    <li key={child._id}>
                      <a
                        href="#"
                        className="block px-4 py-2 text-teal-700 hover:bg-teal-500 hover:text-white rounded"
                      >
                        {child.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default UserNavbar;
