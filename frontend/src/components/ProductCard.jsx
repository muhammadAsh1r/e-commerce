import React from "react";
import { ShoppingCart, Eye, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../features/cart/cartSlice";

const ProductCard = ({ product, layout = "grid" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  const formattedPrice = new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0
  }).format(product.price || 0);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to add products to cart.");
    dispatch(addItemToCart({ userId: user._id || user.id, productId: product._id, quantity: 1 }));
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to buy products.");
    dispatch(addItemToCart({ userId: user._id || user.id, productId: product._id, quantity: 1 }));
    navigate("/cart");
  };

  if (layout === "list") {
    return (
      <div className="group bg-white rounded-3xl border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-brand/5 flex flex-col sm:flex-row gap-6 p-4">
        {/* Image Container */}
        <div className="relative w-full sm:w-48 aspect-square sm:aspect-auto shrink-0 bg-gray-50 rounded-2xl overflow-hidden">
          <img
            src={product.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <button 
              onClick={handleAddToCart}
              className="p-2.5 bg-white text-gray-900 rounded-full shadow-xl hover:bg-brand hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 cursor-pointer" 
              title="Add to Cart"
            >
              <ShoppingCart size={18} />
            </button>
            <Link to={`/product/${product._id}`} className="p-2.5 bg-white text-gray-900 rounded-full shadow-xl hover:bg-brand hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75" title="View Details">
              <Eye size={18} />
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col py-2 pr-2">
          <div className="flex items-center gap-1 mb-2 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill={i < 4 ? "currentColor" : "none"} />
            ))}
            <span className="text-[10px] text-gray-400 font-medium ml-1">(4.0)</span>
          </div>
          
          <div className="flex justify-between items-start gap-4 mb-2">
            <h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-brand transition-colors">
              <Link to={`/product/${product._id}`}>{product.name}</Link>
            </h3>
            <div className="text-right shrink-0">
              <span className="text-xl font-black text-gray-900 block">{formattedPrice}</span>
              {product.oldPrice && (
                <span className="text-sm text-gray-400 line-through">PKR {product.oldPrice}</span>
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mb-6 line-clamp-2 max-w-2xl">
            {product.description}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-3">
              {product.stock <= 5 && product.stock > 0 && (
                <span className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-tighter">Low Stock</span>
              )}
              {product.stock === 0 && (
                <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-tighter">Sold Out</span>
              )}
              {product.stock > 5 && (
                <span className="bg-green-100 text-green-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-tighter">In Stock</span>
              )}
            </div>
            <button 
              onClick={handleAddToCart}
              className="px-6 py-2.5 bg-brand text-white text-sm font-bold rounded-xl hover:bg-brand-hover transition-colors shadow-sm cursor-pointer"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white rounded-3xl border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-brand/10 hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.stock <= 5 && product.stock > 0 && (
            <span className="bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter">
              Low Stock
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter">
              Sold Out
            </span>
          )}
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button 
            onClick={handleAddToCart}
            className="p-3 bg-white text-gray-900 rounded-full shadow-xl hover:bg-brand hover:text-white transition-all transform translate-y-10 group-hover:translate-y-0 duration-500 delay-[100ms] cursor-pointer"
            title="Add to Cart"
          >
            <ShoppingCart size={20} />
          </button>
          <Link 
            to={`/product/${product._id}`}
            className="p-3 bg-white text-gray-900 rounded-full shadow-xl hover:bg-brand hover:text-white transition-all transform translate-y-10 group-hover:translate-y-0 duration-500"
            title="View Details"
          >
            <Eye size={20} />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-1 mb-2 text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} fill={i < 4 ? "currentColor" : "none"} />
          ))}
          <span className="text-[10px] text-gray-400 font-medium ml-1">(4.0)</span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-1 truncate group-hover:text-brand transition-colors">
          <Link to={`/product/${product._id}`}>{product.name}</Link>
        </h3>
        
        <p className="text-sm text-gray-500 mb-4 line-clamp-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-black text-gray-900">{formattedPrice}</span>
            {product.oldPrice && (
              <span className="text-sm text-gray-400 line-through ml-2">PKR {product.oldPrice}</span>
            )}
          </div>
          <button 
            onClick={handleBuyNow}
            className="text-brand font-bold text-sm hover:underline underline-offset-4 cursor-pointer"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
