import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, clearSingleProduct } from "../../features/product/productSlice";
import { addItemToCart } from "../../features/cart/cartSlice";
import { ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw, Star, ChevronLeft, ChevronRight, Zap, Minus, Plus } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { singleProduct: product, loading, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => dispatch(clearSingleProduct());
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!user) {
      alert("Please login to add products to cart.");
      return;
    }
    dispatch(addItemToCart({ userId: user._id || user.id, productId: product._id, quantity }));
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-12 w-12 border-4 border-brand/30 border-t-brand rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-900/95 dark:backdrop-blur-2xl p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-xl text-center">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Oops! Something went wrong</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">{error}</p>
        <Link to="/products" className="text-brand font-bold hover:underline">Back to Shop</Link>
      </div>
    </div>
  );

  if (!product) return null;

  const formattedPrice = new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0
  }).format(product.price || 0);

  const images = product.images?.length > 0 ? product.images : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800"];

  return (
    <div className="bg-transparent min-h-screen pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs / Back navigation */}
        <Link to="/products" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-brand font-bold mb-10 transition-colors group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-square bg-white dark:bg-gray-800/50 rounded-[3rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm group">
              <img 
                src={images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-1/2 -translate-y-1/2 inset-x-4 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setActiveImage(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white rounded-2xl shadow-xl hover:bg-brand hover:text-white transition-all cursor-pointer"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={() => setActiveImage(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white rounded-2xl shadow-xl hover:bg-brand hover:text-white transition-all cursor-pointer"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    activeImage === idx ? "border-brand shadow-lg shadow-brand/20 scale-95" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-4 py-1 bg-brand/10 text-brand text-xs font-black uppercase tracking-widest rounded-full">
                  {product.category?.name || "Premium Store"}
                </span>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star size={16} fill="currentColor" />
                  <span className="text-sm font-bold text-gray-900 dark:text-white">4.8</span>
                  <span className="text-sm text-gray-400 dark:text-gray-500 font-medium">(120 Reviews)</span>
                </div>
              </div>
              <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight">{product.name}</h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">{product.description}</p>
            </div>

            <div className="mb-10">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-5xl font-black text-gray-900 dark:text-white">{formattedPrice}</span>
                {product.oldPrice && (
                  <span className="text-2xl text-gray-400 dark:text-gray-500 line-through font-bold">PKR {product.oldPrice}</span>
                )}
              </div>
              <p className={`text-sm font-bold ${product.stock > 0 ? "text-green-500" : "text-red-500"}`}>
                {product.stock > 0 ? `✓ In stock (${product.stock} available)` : "✕ Out of Stock"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              <div className="flex items-center gap-4 p-5 bg-white dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                <div className="p-3 bg-brand/10 text-brand rounded-xl"><Truck size={24} /></div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Fast Delivery</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Scheduled for tomorrow</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-white dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                <div className="p-3 bg-brand/10 text-brand rounded-xl"><ShieldCheck size={24} /></div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Original Item</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">100% genuine product</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <div className="flex items-center bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-white/10 rounded-[1.5rem] p-1.5 shadow-sm">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="p-3 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl transition-all cursor-pointer"
                >
                  <Minus size={20} />
                </button>
                <span className="w-16 text-center text-xl font-black text-gray-900 dark:text-white">{quantity}</span>
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="p-3 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl transition-all cursor-pointer"
                >
                  <Plus size={20} />
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 py-5 bg-gray-900 hover:bg-black text-white rounded-[1.5rem] font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 cursor-pointer"
              >
                <ShoppingCart size={22} /> Add to Cart
              </button>
              
              <button 
                className="p-5 border-2 border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 rounded-[1.5rem] transition-all cursor-pointer"
              >
                <Heart size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Specifications / Tabs Section */}
        <div className="mt-20">
          <div className="border-b border-gray-200 dark:border-white/10 flex gap-10 mb-10 overflow-x-auto scrollbar-hide">
            <button className="pb-4 text-lg font-black text-brand border-b-4 border-brand cursor-pointer whitespace-nowrap">Description</button>
            <button className="pb-4 text-lg font-bold text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer whitespace-nowrap">Specifications</button>
            <button className="pb-4 text-lg font-bold text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer whitespace-nowrap">Reviews (120)</button>
          </div>
          <div className="max-w-4xl">
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              {product.description}
            </p>
            <div className="p-10 bg-white dark:bg-gray-800/50 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Need Help?</h4>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Contact our premium support 24/7 for any queries regarding this product.</p>
              </div>
              <button className="px-8 py-4 bg-brand/10 text-brand rounded-2xl font-bold hover:bg-brand hover:text-white transition-all cursor-pointer">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
