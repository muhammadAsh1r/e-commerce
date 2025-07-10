import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../features/category/categorySlice";

const AddProductModal = ({
  isOpen,
  onClose,
  onAddProduct,
  loading,
  error,
  initialData,
}) => {
  const dispatch = useDispatch();
  const { items: categories } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });

  // ✅ Fetch categories when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCategories());
    }
  }, [dispatch, isOpen]);

  // ✅ Set formData from initialData (for editing)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        category: initialData.category?._id || initialData.category || "",
        price: initialData.price || "",
        stock: initialData.stock || "",
      });
    } else {
      setFormData({
        name: "",
        category: "",
        price: "",
        stock: "",
      });
    }
  }, [initialData]);

  // ✅ Set default category after categories load
  useEffect(() => {
    if (categories.length > 0 && !formData.category) {
      setFormData((prev) => ({ ...prev, category: categories[0]._id }));
    }
  }, [categories]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || isNaN(formData.price)) {
      alert("Please enter a valid name and price.");
      return;
    }

    if (isNaN(formData.stock)) {
      alert("Stock must be a number.");
      return;
    }

    onAddProduct({
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10) || 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-teal-500 mb-4">
          {initialData ? "Edit Product" : "Add New Product"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="price">
              Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="stock">
              Stock
            </label>
            <input
              type="number"
              min="0"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-teal-500 hover:bg-teal-600 text-white"
            >
              {loading ? (initialData ? "Updating..." : "Adding...") : initialData ? "Update" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
