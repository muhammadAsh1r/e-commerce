import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  createProduct,
  deleteProduct,
} from "../../features/product/productSlice";
import { fetchCategories } from "../../features/category/categorySlice";

const Product = () => {
  const dispatch = useDispatch();
  const {
    items: products,
    loading,
    error,
  } = useSelector((state) => state.products);
  const { items: categories } = useSelector((state) => state.categories);

  // Modal open state
  const [modalOpen, setModalOpen] = useState(false);

  // Form or JSON input toggle
  const [useJson, setUseJson] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    stock: "",
  });

  const [jsonInput, setJsonInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    if (useJson) {
      try {
        const data = JSON.parse(jsonInput);
        if (Array.isArray(data)) {
          data.forEach((prod) => dispatch(createProduct(prod)));
        } else {
          dispatch(createProduct(data));
        }
        setJsonInput("");
        setModalOpen(false);
      } catch (err) {
        alert("Invalid JSON");
      }
    } else {
      if (!formData.name || !formData.category || !formData.price) {
        alert("Please fill name, category and price.");
        return;
      }
      const product = {
        ...formData,
        price: +formData.price,
        stock: +formData.stock || 0,
      };
      dispatch(createProduct(product));
      setFormData({
        name: "",
        description: "",
        category: "",
        brand: "",
        price: "",
        stock: "",
      });
      setModalOpen(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  // Filter products by search term (name)
  const filteredProducts = products.filter((prod) =>
    prod.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Add Product Button */}
      <div className="max-w-6xl mx-auto mb-6">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-teal-500 text-white px-6 py-2 rounded-xl hover:bg-teal-600 transition"
        >
          Add Product
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl w-full mx-4 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              ✕
            </button>

            <h2 className="text-teal-500 text-2xl font-semibold mb-4">
              Add Product
            </h2>

            {/* Form/JSON toggle */}
            <div className="flex items-center space-x-6 mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={!useJson}
                  onChange={() => setUseJson(false)}
                />
                <span className="text-gray-700">Form</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={useJson}
                  onChange={() => setUseJson(true)}
                />
                <span className="text-gray-700">JSON Input</span>
              </label>
            </div>

            {useJson ? (
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste JSON here"
                className="w-full h-48 p-3 border border-gray-300 rounded-lg mb-4 resize-none font-mono"
              />
            ) : (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  name="name"
                  placeholder="Name *"
                  value={formData.name}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2"
                />
                <input
                  name="brand"
                  placeholder="Brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2"
                />
                <input
                  name="price"
                  type="number"
                  placeholder="Price *"
                  value={formData.price}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2"
                  min="0"
                />
                <input
                  name="stock"
                  type="number"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2"
                  min="0"
                />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2 col-span-2"
                >
                  <option value="">Select Category *</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2 col-span-2"
                  rows={3}
                />
              </div>
            )}

            <button
              onClick={handleAdd}
              className="bg-teal-500 text-white px-6 py-2 rounded-xl hover:bg-teal-600 transition"
            >
              Add Product
            </button>
          </div>
        </div>
      )}

      {/* Search input */}
      <div className="max-w-6xl mx-auto mb-4">
        <input
          type="text"
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full max-w-md"
        />
      </div>

      {/* Products Table */}
      <div className="max-w-6xl mx-auto overflow-auto bg-white rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full table-fixed">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 border-b border-gray-200 text-left text-teal-500">
                Name
              </th>
              <th className="px-4 py-3 border-b border-gray-200 text-left text-teal-500">
                Category
              </th>
              <th className="px-4 py-3 border-b border-gray-200 text-left text-teal-500">
                Brand
              </th>
              <th className="px-4 py-3 border-b border-gray-200 text-left text-teal-500">
                Price
              </th>
              <th className="px-4 py-3 border-b border-gray-200 text-left text-teal-500">
                Stock
              </th>
              <th className="px-4 py-3 border-b border-gray-200 text-left text-teal-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-700">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-red-500">
                  {error}
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr
                  key={product._id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 text-gray-700">{product.name}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {product.category?.name || "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {product.brand || "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    PKR {product.price?.toLocaleString() || "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {product.stock ?? "-"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Product;
