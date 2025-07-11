import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/product/productSlice";

const UserProducts = () => {
  const dispatch = useDispatch();
  const {
    items: products,
    loading,
    error,
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      {loading && (
        <p className="text-center text-gray-700">Loading products...</p>
      )}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="text-center text-gray-700">No products found.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col"
          >
            {product.images?.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}

            <div className="p-4 flex flex-col flex-1">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                {product.name}
              </h2>

              <p className="text-sm text-gray-600 mb-2">
                Stock:{" "}
                <span
                  className={
                    product.stock > 0 ? "text-green-600" : "text-red-500"
                  }
                >
                  {product.stock > 0 ? product.stock : "Out of Stock"}
                </span>
              </p>

              <p className="text-lg font-medium text-gray-700 mt-auto mb-4">
                PKR {product.price?.toLocaleString()}
              </p>

              <button
                className="w-full bg-teal-500 text-white py-2 px-4 rounded-xl hover:bg-teal-600 transition-colors"
                disabled={product.stock <= 0}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProducts;
