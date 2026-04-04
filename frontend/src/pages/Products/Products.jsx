import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, createProduct, deleteProduct, updateProduct } from "../../features/product/productSlice";
import { fetchCategories } from "../../features/category/categorySlice";
import { Package, Plus, Search, Trash2, Edit3, MoreVertical, LayoutGrid, List, AlertCircle, CheckCircle2, X } from "lucide-react";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state) => state.products);
  const { items: categories } = useSelector((state) => state.categories);

  const [modalOpen, setModalOpen] = useState(false);
  const [useJson, setUseJson] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    stock: "",
    images: [""]
  });

  const [jsonInput, setJsonInput] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (useJson) {
        const data = JSON.parse(jsonInput);
        if (Array.isArray(data)) {
          for (const prod of data) await dispatch(createProduct(prod));
        } else {
          await dispatch(createProduct(data));
        }
      } else {
        if (!formData.name || !formData.category || !formData.price) return;
        const productData = { ...formData, price: +formData.price, stock: +formData.stock || 0 };
        
        if (editId) {
          await dispatch(updateProduct({ id: editId, updates: productData }));
          setSuccessMsg("Product updated successfully!");
        } else {
          await dispatch(createProduct(productData));
          setSuccessMsg("Product added successfully!");
        }
      }
      setTimeout(() => setSuccessMsg(""), 3000);
      setModalOpen(false);
      resetForm();
    } catch (err) {
      alert("Error processing product. Check data format.");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", category: "", brand: "", price: "", stock: "", images: [""] });
    setJsonInput("");
    setUseJson(false);
    setEditId(null);
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      category: product.category?._id || product.category || "",
      brand: product.brand || "",
      price: product.price || "",
      stock: product.stock || "",
      images: product.images || [""]
    });
    setUseJson(false);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Permanent deletion? This cannot be undone.")) {
      dispatch(deleteProduct(id));
    }
  };

  const filteredProducts = products.filter((prod) =>
    prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prod.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  ).reverse();

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black text-gray-900 mb-2">Inventory <span className="text-brand">Manager</span></h1>
            <p className="text-gray-500 font-medium italic">Control your store's heartbeat and stock health</p>
          </div>
          <button
            onClick={() => { resetForm(); setModalOpen(true); }}
            className="flex items-center gap-3 px-8 py-4 bg-brand text-white rounded-2xl font-black hover:bg-brand-hover transition-all shadow-xl shadow-brand/20 active:scale-95"
          >
            <Plus size={24} /> New Product
          </button>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <div className="flex-1 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by product name or brand..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 focus:border-brand/30 focus:ring-4 focus:ring-brand/5 rounded-2xl transition-all outline-none font-bold text-gray-700 shadow-sm"
            />
          </div>
          <div className="bg-white p-1 rounded-2xl border border-gray-100 shadow-sm flex items-center">
            <button 
              onClick={() => setViewMode("table")}
              className={`p-3 rounded-xl transition-all ${viewMode === "table" ? "bg-gray-900 text-white shadow-lg" : "text-gray-400 hover:text-gray-600"}`}
            >
              <List size={22} />
            </button>
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-3 rounded-xl transition-all ${viewMode === "grid" ? "bg-gray-900 text-white shadow-lg" : "text-gray-400 hover:text-gray-600"}`}
            >
              <LayoutGrid size={22} />
            </button>
          </div>
        </div>

        {successMsg && (
          <div className="mb-8 p-4 bg-green-50 border border-green-100 text-green-600 rounded-2xl flex items-center gap-3 animate-bounce shadow-sm text-sm font-black">
            <CheckCircle2 size={20} /> {successMsg}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 bg-white rounded-3xl animate-pulse" />)}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Product Details</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Category</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Price</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Health</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 grow-0 shrink-0">
                          <img src={product.images?.[0] || "/placeholder.png"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={product.name} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-gray-900 group-hover:text-brand transition-colors truncate">{product.name}</p>
                          <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">Brand: {product.brand || "Generic"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-gray-600">
                      <span className="px-3 py-1 bg-gray-100 rounded-lg">{product.category?.name || "Uncategorized"}</span>
                    </td>
                    <td className="px-8 py-6 font-black text-gray-900">
                      PKR {product.price.toLocaleString()}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-[10px] font-black text-gray-400 mb-1">
                          <span>STOCK</span>
                          <span className={product.stock < 10 ? "text-red-500" : "text-green-500"}>{product.stock} units</span>
                        </div>
                        <div className="h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${product.stock < 10 ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"}`} 
                            style={{ width: `${Math.min(product.stock, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 uppercase">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(product)} className="p-3 text-gray-300 hover:text-brand hover:bg-brand/5 rounded-xl transition-all"><Edit3 size={18} /></button>
                        <button onClick={() => handleDelete(product._id)} className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex justify-center items-center z-[100] animate-in fade-in">
            <div className="bg-white rounded-[3.5rem] shadow-2xl p-10 max-w-4xl w-full mx-4 relative max-h-[90vh] overflow-y-auto scrollbar-hide border border-white/20">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-8 right-8 p-3 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-2xl transition-all"
              >
                <X size={24} />
              </button>

              <h2 className="text-4xl font-black text-gray-900 mb-8 flex items-center gap-4">
                <div className="p-3 bg-brand text-white rounded-2xl shadow-lg ring-4 ring-brand/5">
                  {editId ? <Edit3 size={28} /> : <Plus size={28} />}
                </div>
                {editId ? "Redefine Inventory" : "New Inventory Item"}
              </h2>

              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl mb-10 w-fit">
                <button 
                  onClick={() => setUseJson(false)}
                  className={`px-6 py-2.5 rounded-xl font-black text-sm transition-all ${!useJson ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                >
                  Visual Form
                </button>
                <button 
                  onClick={() => setUseJson(true)}
                  className={`px-6 py-2.5 rounded-xl font-black text-sm transition-all ${useJson ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                >
                  JSON Payload
                </button>
              </div>

              {useJson ? (
                <div className="space-y-6">
                  <div className="bg-gray-900 rounded-3xl p-6 shadow-md">
                    <div className="flex items-center gap-2 mb-4 text-brand-hover">
                      <AlertCircle size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-hover">Strict Schema Required</span>
                    </div>
                    <textarea
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      placeholder='{ "name": "Nexus 9", "price": 499, ... }'
                      className="w-full h-80 bg-transparent text-gray-200 p-4 rounded-xl border border-white/10 resize-none font-mono outline-none focus:border-brand/50 transition-all text-sm leading-relaxed"
                    />
                  </div>
                  <p className="text-xs text-gray-400 font-medium italic">Supports single object or array of objects for bulk upload.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 pl-1">Product Identity</label>
                      <input name="name" placeholder="Friendly Name" value={formData.name} onChange={handleChange} className="w-full bg-gray-50 p-4 rounded-2xl border-transparent focus:bg-white focus:border-brand/30 focus:ring-4 focus:ring-brand/5 outline-none font-bold text-gray-700 transition-all" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 pl-1">Brand Legacy</label>
                      <input name="brand" placeholder="Manufacturer or Line" value={formData.brand} onChange={handleChange} className="w-full bg-gray-50 p-4 rounded-2xl border-transparent focus:bg-white focus:border-brand/30 focus:ring-4 focus:ring-brand/5 outline-none font-bold text-gray-700 transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 pl-1">Price (PKR)</label>
                        <input name="price" type="number" placeholder="0.00" value={formData.price} onChange={handleChange} className="w-full bg-gray-50 p-4 rounded-2xl border-transparent focus:bg-white focus:border-brand/30 focus:ring-4 focus:ring-brand/5 outline-none font-bold text-gray-700 transition-all" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 pl-1">Stock Units</label>
                        <input name="stock" type="number" placeholder="0" value={formData.stock} onChange={handleChange} className="w-full bg-gray-50 p-4 rounded-2xl border-transparent focus:bg-white focus:border-brand/30 focus:ring-4 focus:ring-brand/5 outline-none font-bold text-gray-700 transition-all" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 pl-1">Categorization</label>
                      <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-gray-50 p-4 rounded-2xl border-transparent focus:bg-white focus:border-brand/30 focus:ring-4 focus:ring-brand/5 outline-none font-bold text-gray-700 transition-all cursor-pointer">
                        <option value="">Choose Category</option>
                        {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 pl-1">Marketing Writeup</label>
                      <textarea name="description" placeholder="Sell this product in 3 sentences..." value={formData.description} onChange={handleChange} className="w-full bg-gray-50 p-4 rounded-2xl border-transparent focus:bg-white focus:border-brand/30 focus:ring-4 focus:ring-brand/5 outline-none font-bold text-gray-700 transition-all h-[156px] resize-none" />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-6 pt-6 border-t border-gray-50">
                <button onClick={() => setModalOpen(false)} className="px-8 py-4 text-gray-400 font-bold hover:text-gray-900 transition-colors">Discard Draft</button>
                <button onClick={handleSubmit} className="px-12 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl active:scale-95">
                  {editId ? "Save Changes" : "Commit Item"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
