import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, createCategory, deleteCategory, updateCategory } from "../../features/category/categorySlice";
import { Tag, Plus, Search, Trash2, Edit3, X, AlertCircle, CheckCircle2, ListFilter, Braces, Layers } from "lucide-react";

const CategoryManagement = () => {
  const dispatch = useDispatch();
  const { items: categories, loading, error } = useSelector((state) => state.categories);

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("form");
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [jsonData, setJsonData] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async () => {
    try {
      if (mode === "form") {
        if (!formData.name.trim()) return;
        if (editId) {
          await dispatch(updateCategory({ id: editId, updates: formData }));
          setSuccessMsg("Category updated!");
        } else {
          await dispatch(createCategory(formData));
          setSuccessMsg("Category created!");
        }
      } else {
        const parsed = JSON.parse(jsonData);
        const dataArray = Array.isArray(parsed) ? parsed : [parsed];
        for (const cat of dataArray) {
          if (cat.name) await dispatch(createCategory(cat));
        }
        setSuccessMsg("Bulk upload complete!");
      }
      setTimeout(() => setSuccessMsg(""), 3000);
      setShowModal(false);
      resetForm();
    } catch (e) {
      alert("Operation failed. Check data format.");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setJsonData("");
    setEditId(null);
    setMode("form");
  };

  const handleEdit = (cat) => {
    setEditId(cat._id);
    setFormData({ name: cat.name, description: cat.description || "" });
    setMode("form");
    setShowModal(true);
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).reverse();

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-2">Retail <span className="text-brand">Taxonomy</span></h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium italic">Organize your store's ecosystem with powerful categorization</p>
          </div>
          <button
            onClick={() => { setShowModal(true); resetForm(); }}
            className="flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black hover:bg-black dark:hover:bg-gray-100 transition-all shadow-xl active:scale-95 cursor-pointer"
          >
            <Plus size={24} /> New Category
          </button>
        </div>

        {/* Action Bar */}
        <div className="bg-white dark:bg-gray-900/95 dark:backdrop-blur-2xl p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm mb-10 flex flex-col md:flex-row gap-6">
          <div className="flex-1 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-brand transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search categorizations..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-transparent border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-brand/30 focus:ring-4 focus:ring-brand/5 rounded-2xl transition-all outline-none font-bold text-gray-700 dark:text-white shadow-inner"
            />
          </div>
          <div className="bg-brand/5 dark:bg-brand/10 px-6 py-4 rounded-2xl flex items-center gap-3 border border-brand/10 dark:border-brand/20">
            <Layers className="text-brand" size={20} />
            <span className="font-black text-gray-900 dark:text-white">{categories.length} Classes</span>
          </div>
        </div>

        {successMsg && (
          <div className="mb-8 p-4 bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/50 text-green-600 dark:text-green-400 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 text-sm font-black shadow-sm">
            <CheckCircle2 size={20} /> {successMsg}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 border-4 border-brand/30 border-t-brand rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCategories.map((cat) => (
              <div key={cat._id} className="bg-white dark:bg-gray-800/50 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-brand group-hover:w-3 transition-all" />
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                    <Tag size={24} />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(cat)} className="p-2 text-gray-400 dark:text-gray-500 hover:text-brand dark:hover:text-brand transition-colors cursor-pointer"><Edit3 size={18} /></button>
                    <button onClick={() => dispatch(deleteCategory(cat._id))} className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={18} /></button>
                  </div>
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 truncate">{cat.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed italic line-clamp-3">
                  {cat.description || "No classification brief provided."}
                </p>
                <div className="mt-8 pt-6 border-t border-gray-50 dark:border-white/5 flex items-center justify-between text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest">
                  <span>ID: {cat._id.slice(-6)}</span>
                  <span className="text-brand">Active Class</span>
                </div>
              </div>
            ))}
            
            {filteredCategories.length === 0 && (
              <div className="col-span-full bg-white dark:bg-gray-800/50 p-20 rounded-[3.5rem] border-2 border-dashed border-gray-100 dark:border-white/5 text-center">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900/50 text-gray-300 dark:text-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ListFilter size={40} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Catalogue Empty</h3>
                <p className="text-gray-400 dark:text-gray-500 font-medium">Add your first category to start organizing items.</p>
              </div>
            )}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-md flex items-center justify-center z-[110] animate-in fade-in p-4">
            <div className="bg-white dark:bg-gray-900 rounded-[3.5rem] p-10 w-full max-w-2xl relative shadow-2xl border border-white/20 dark:border-white/5">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-8 right-8 p-3 bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-2xl transition-all cursor-pointer"
              >
                <X size={24} />
              </button>

              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <div className="p-3 bg-brand text-white rounded-2xl shadow-lg ring-4 ring-brand/5"><Tag size={24} /></div>
                {editId ? "Redefine Category" : "Establish Category"}
              </h2>

              <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 p-2 rounded-2xl mb-10 w-fit shadow-inner">
                <button 
                  onClick={() => setMode("form")}
                  className={`px-6 py-2.5 rounded-xl font-black text-sm transition-all flex items-center gap-2 cursor-pointer ${mode === "form" ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"}`}
                >
                  <Edit3 size={16} /> Structured
                </button>
                <button 
                  onClick={() => setMode("json")}
                  className={`px-6 py-2.5 rounded-xl font-black text-sm transition-all flex items-center gap-2 cursor-pointer ${mode === "json" ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"}`}
                >
                  <Braces size={16} /> Bulk (JSON)
                </button>
              </div>

              {mode === "form" ? (
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-1.5 pl-1">Unique Identifier / Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Premium Audio"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-gray-50 dark:bg-white/5 px-6 py-4 rounded-2xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-brand/30 focus:ring-4 focus:ring-brand/5 outline-none font-bold text-gray-700 dark:text-white transition-all font-sans shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-1.5 pl-1">Classification Context</label>
                    <textarea
                      placeholder="Define the scope of this category..."
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-gray-50 dark:bg-white/5 px-6 py-4 rounded-2xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-brand/30 focus:ring-4 focus:ring-brand/5 outline-none font-bold text-gray-700 dark:text-white transition-all h-40 resize-none italic shadow-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-gray-900 rounded-[2rem] p-6 shadow-inner border border-white/5">
                  <div className="flex items-center gap-2 mb-4 text-brand">
                    <Braces size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Array Processing Mode</span>
                  </div>
                  <textarea
                    placeholder='[ { "name": "Class A", "description": "..." }, ... ]'
                    value={jsonData}
                    onChange={(e) => setJsonData(e.target.value)}
                    className="w-full bg-transparent text-teal-400 px-6 py-4 rounded-xl border border-white/10 outline-none font-mono text-sm h-60 resize-none leading-relaxed"
                  />
                  <p className="mt-4 text-[10px] text-gray-500 font-bold uppercase tracking-wider">Note: Existing records won't be overwritten.</p>
                </div>
              )}

              <div className="flex justify-end gap-6 mt-10">
                <button onClick={() => setShowModal(false)} className="px-8 py-4 text-gray-400 hover:text-gray-900 dark:hover:text-white font-bold transition-colors cursor-pointer">Abort</button>
                <button onClick={handleSubmit} className="px-12 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black hover:bg-black dark:hover:bg-gray-100 transition-all shadow-xl active:scale-95 cursor-pointer">
                  {editId ? "Sync Changes" : "Commit Record"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;
