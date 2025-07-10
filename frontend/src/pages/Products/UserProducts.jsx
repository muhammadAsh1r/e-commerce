// pages/ProductPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../../components/ProductCard";
import { fetchProducts } from "../../features/product/productSlice";

const Products = () => {
  const dispatch = useDispatch();
  const {
    items: products,
    loading,
    error,
  } = useSelector((state) => state.products);

  // Sort option state
  // "default" = no sorting, "lowToHigh", "highToLow"
  const [sortOption, setSortOption] = useState("default");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Sort products based on sortOption
  const sortedProducts = React.useMemo(() => {
    if (!products) return [];

    if (sortOption === "lowToHigh") {
      return [...products].sort((a, b) => a.price - b.price);
    }
    if (sortOption === "highToLow") {
      return [...products].sort((a, b) => b.price - a.price);
    }
    // default - no sorting, return as is
    return products;
  }, [products, sortOption]);

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-teal-500">Our Products</h1>

        {/* Sort Dropdown */}
        <div>
          <label htmlFor="sort" className="mr-2 text-gray-700 font-medium">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1"
          >
            <option value="default">Default</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading && <p className="text-gray-700">Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading &&
        !error &&
        (!sortedProducts || sortedProducts.length === 0) && (
          <p className="text-gray-700">No products found.</p>
        )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedProducts &&
          sortedProducts.length > 0 &&
          sortedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
      </div>
    </div>
  );
};

export default Products;
