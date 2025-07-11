import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../../features/category/categorySlice";

const CategoryPage = () => {
  const dispatch = useDispatch();
  const { items: categories, loading, error } = useSelector(
    (state) => state.categories
  );

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("form"); // 'form' or 'json'
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [jsonData, setJsonData] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = () => {
    if (mode === "form") {
      if (!formData.name.trim()) return;
      if (editId) {
        dispatch(updateCategory({ id: editId, updates: formData }));
      } else {
        dispatch(createCategory(formData));
      }
    } else {
      try {
        const parsed = JSON.parse(jsonData);
        const dataArray = Array.isArray(parsed) ? parsed : [parsed];
        dataArray.forEach((cat) => {
          if (cat.name) dispatch(createCategory(cat));
        });
      } catch (e) {
        alert("Invalid JSON");
        return;
      }
    }

    setFormData({ name: "", description: "" });
    setJsonData("");
    setEditId(null);
    setShowModal(false);
  };

  const handleEdit = (cat) => {
    setEditId(cat._id);
    setFormData({ name: cat.name, description: cat.description || "" });
    setMode("form");
    setShowModal(true);
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-teal-500">
          Manage Categories
        </h2>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring focus:border-teal-400"
          />
          <button
            onClick={() => {
              setShowModal(true);
              setFormData({ name: "", description: "" });
              setJsonData("");
              setMode("form");
              setEditId(null);
            }}
            className="bg-teal-500 text-white px-4 py-2 rounded-xl hover:bg-teal-600"
          >
            + Add Category
          </button>
        </div>
      </div>

      {loading && <p className="text-gray-700">Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-teal-500">Name</th>
                <th className="text-left px-6 py-3 text-teal-500">Description</th>
                <th className="text-left px-6 py-3 text-teal-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((cat) => (
                <tr key={cat._id} className="border-t border-gray-200">
                  <td className="px-6 py-3 text-gray-700">{cat.name}</td>
                  <td className="px-6 py-3 text-gray-700">{cat.description}</td>
                  <td className="px-6 py-3 flex gap-3">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="bg-teal-500 text-white px-3 py-1 rounded hover:bg-teal-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => dispatch(deleteCategory(cat._id))}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-500">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold text-teal-500 mb-4">
              {editId ? "Edit Category" : "Add Category"}
            </h3>

            <div className="mb-4 flex gap-4">
              <button
                onClick={() => setMode("form")}
                className={`px-4 py-2 rounded-xl border ${
                  mode === "form"
                    ? "bg-teal-500 text-white"
                    : "bg-white text-teal-500 border-teal-500"
                }`}
              >
                Form Input
              </button>
              <button
                onClick={() => setMode("json")}
                className={`px-4 py-2 rounded-xl border ${
                  mode === "json"
                    ? "bg-teal-500 text-white"
                    : "bg-white text-teal-500 border-teal-500"
                }`}
              >
                JSON Input
              </button>
            </div>

            {mode === "form" ? (
              <>
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-xl text-gray-700"
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-xl text-gray-700"
                />
              </>
            ) : (
              <textarea
                placeholder='Paste JSON like {"name": "...", "description": "..."} or array'
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 h-40"
              />
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600"
              >
                {editId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
