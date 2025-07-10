// components/ProductCard.jsx
import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow p-4 flex flex-col hover:shadow-md transition-shadow duration-200">
      <img
        src={product.images?.[0] || "https://via.placeholder.com/300"}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h2 className="text-lg font-semibold text-teal-500 mb-1">
        {product.name}
      </h2>
      <p className="text-sm text-gray-700 mb-2 line-clamp-2">
        {product.description}
      </p>
      <p className="text-md text-teal-500 font-bold mb-2">
        PKR {product.price}
      </p>
      <div className="flex items-center justify-between mt-auto">
        <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded transition">
          Add to Cart
        </button>
        <span className="text-sm text-gray-700">
          Stock: {product.stock > 0 ? product.stock : "Out of stock"}
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
