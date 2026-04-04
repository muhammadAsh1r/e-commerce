import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/product/productSlice";
import { fetchCategories } from "../../features/category/categorySlice";
import ProductCard from "../../components/ProductCard";
import { Search, Filter, SlidersHorizontal, LayoutGrid, List, Folder, X } from "lucide-react";

const UserProducts = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  
  const { items: products, loading, error } = useSelector((state) => state.products);
  const { items: categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory || product.category?._id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Sleek, Compact Search and Filter Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40 py-3 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4 justify-between">
          
          {/* Left side: Heading + Category Button */}
          <div className="flex items-center gap-4 md:w-1/2 w-full overflow-hidden">
            <h1 className="text-xl font-black text-gray-900 shrink-0 hidden lg:block">Shop <span className="text-brand">All</span></h1>
            <div className="w-[2px] h-6 bg-gray-200 shrink-0 hidden lg:block"></div>
            
            <button 
              onClick={() => setIsCategoryModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors cursor-pointer"
            >
              <Folder size={16} className="text-brand" />
              Categories
              {selectedCategory !== "All" && (
                <span className="ml-1 px-2 py-0.5 bg-brand text-white text-[10px] rounded-full">1</span>
              )}
            </button>
          </div>
          
          {/* Right side: Search & Filter */}
          <div className="flex w-full md:w-auto md:max-w-md shrink-0 gap-2">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-brand/30 focus:ring-2 focus:ring-brand/10 rounded-xl transition-all outline-none text-sm text-gray-700 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              className="flex items-center justify-center bg-gray-100 p-2 rounded-xl text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors cursor-pointer"
              title="Advanced Filters"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-500 font-medium tracking-tight">
            Showing <span className="text-gray-900 font-bold">{filteredProducts.length}</span> products
          </p>
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'text-brand bg-brand/10' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${viewMode === 'list' ? 'text-brand bg-brand/10' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white border border-gray-100 rounded-3xl aspect-[3/4]" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 font-bold text-lg">Error loading products: {error}</p>
            <button onClick={() => dispatch(fetchProducts())} className="mt-4 text-brand underline">Try again</button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="inline-flex p-6 bg-gray-50 text-gray-400 rounded-full mb-6">
              <Search size={48} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">No products found</h2>
            <p className="text-gray-500">We couldn't find anything matching your search. Try adjusting your filters.</p>
            <button 
              onClick={() => {setSearchTerm(""); setSelectedCategory("All");}}
              className="mt-6 font-bold text-brand hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" : "flex flex-col gap-6"}>
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} layout={viewMode} />
            ))}
          </div>
        )}
      </div>

      {/* Category Modal Popup */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsCategoryModalOpen(false)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Folder size={20} className="text-brand" /> Browse Categories
              </h3>
              <button 
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto overflow-x-hidden">
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => { setSelectedCategory("All"); setIsCategoryModalOpen(false); }}
                  className={`p-4 rounded-2xl text-left transition-all border-2 cursor-pointer ${
                    selectedCategory === "All" 
                      ? "border-brand bg-brand/5 shadow-sm" 
                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <p className="font-bold text-gray-900">All Products</p>
                  <p className="text-xs text-gray-500 mt-1">View entire catalog</p>
                </button>
                {categories.map((cat) => (
                  <button 
                    key={cat._id}
                    onClick={() => { setSelectedCategory(cat._id); setIsCategoryModalOpen(false); }}
                    className={`p-4 rounded-2xl text-left transition-all border-2 cursor-pointer ${
                      selectedCategory === cat._id 
                        ? "border-brand bg-brand/5 shadow-sm" 
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <p className="font-bold text-gray-900 truncate">{cat.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Browse items</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProducts;
