import React from "react";

const ProductTable = ({ products, loading, error, onDelete, onEdit }) => {
  if (loading) return <p className="text-gray-700">Loading products...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!products || products.length === 0)
    return <p className="text-gray-700">No products found.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 rounded-md">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th className="text-gray-700 px-4 py-2 text-left">Name</th>
            <th className="text-gray-700 px-4 py-2 text-left">Category</th>
            <th className="text-gray-700 px-4 py-2 text-right">Price ($)</th>
            <th className="text-gray-700 px-4 py-2 text-center">Stock</th>
            <th className="text-gray-700 px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product._id}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="px-4 py-3 text-gray-700">{product.name}</td>
              <td className="px-4 py-3 text-gray-700">{product.category}</td>
              <td className="px-4 py-3 text-gray-700 text-right">
                {product.price.toFixed(2)}
              </td>
              <td className="px-4 py-3 text-gray-700 text-center">
                {product.stock || 0}
              </td>
              <td className="px-4 py-3 text-center space-x-2">
                <button
                  onClick={() => onEdit(product)}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded-md text-sm transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(product._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
