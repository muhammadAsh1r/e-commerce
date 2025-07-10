import React from "react";

const categories = [
  "All",
  "Electronics",
  "Clothing",
  "Books",
  "Home",
  "Beauty",
];

const ProductFilterForm = ({
  priceFilter,
  setPriceFilter,
  selectedCategory,
  setSelectedCategory,
  onAddProduct,
}) => {
  return (
    <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
      <button
        onClick={onAddProduct}
        className="bg-teal-500 hover:bg-teal-600 text-white font-medium px-5 py-2 rounded-md transition"
      >
        + Add Product
      </button>

      <div className="flex items-center space-x-2">
        <label className="text-gray-700 font-medium">Price Min:</label>
        <input
          type="number"
          min="0"
          placeholder="Min"
          value={priceFilter.min}
          onChange={(e) =>
            setPriceFilter((prev) => ({ ...prev, min: e.target.value }))
          }
          className="border border-gray-200 rounded px-3 py-1 text-gray-700 w-20 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <label className="text-gray-700 font-medium">Max:</label>
        <input
          type="number"
          min="0"
          placeholder="Max"
          value={priceFilter.max}
          onChange={(e) =>
            setPriceFilter((prev) => ({ ...prev, max: e.target.value }))
          }
          className="border border-gray-200 rounded px-3 py-1 text-gray-700 w-20 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="flex items-center space-x-2">
        <label className="text-gray-700 font-medium">Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-200 rounded px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProductFilterForm;
