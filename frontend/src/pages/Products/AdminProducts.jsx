import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
  deleteProduct,
  fetchByCategory,
  clearSingleProduct,
  createProduct,
} from "../../features/product/productSlice";

import ProductFilterForm from "./ProductFilterForm";
import ProductTable from "./ProductTable";
import AddProductModal from "./AddProductModal";

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state) => state.products);

  const [priceFilter, setPriceFilter] = useState({ min: "", max: "" });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState(null);

  useEffect(() => {
    if (selectedCategory === "All") {
      dispatch(fetchProducts());
    } else {
      dispatch(fetchByCategory(selectedCategory));
    }
    dispatch(clearSingleProduct());
  }, [dispatch, selectedCategory]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const handleAddProductClick = () => {
    setAddError(null);
    setIsModalOpen(true);
  };

  const handleAddProduct = async (productData) => {
    setAdding(true);
    setAddError(null);
    try {
      await dispatch(createProduct(productData)).unwrap();
      setIsModalOpen(false);
    } catch (err) {
      setAddError(err.message || "Failed to add product");
    } finally {
      setAdding(false);
    }
  };

  const handleEditProduct = (product) => {
    alert(`Edit functionality for ${product.name} not implemented yet`);
  };

  // Filter products by price locally
  const filteredProducts = products.filter((product) => {
    const price = product.price || 0;
    const min = parseFloat(priceFilter.min);
    const max = parseFloat(priceFilter.max);
    if (!isNaN(min) && price < min) return false;
    if (!isNaN(max) && price > max) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-md shadow p-6">
        <h1 className="text-teal-500 text-3xl font-semibold mb-6">Manage Products</h1>

        <ProductFilterForm
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onAddProduct={handleAddProductClick}
        />

        <ProductTable
          products={filteredProducts}
          loading={loading}
          error={error}
          onDelete={handleDelete}
          onEdit={handleEditProduct}
        />

        <AddProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddProduct={handleAddProduct}
          loading={adding}
          error={addError}
        />
      </div>
    </div>
  );
};

export default AdminProducts;
