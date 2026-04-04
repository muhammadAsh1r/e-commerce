import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  fetchCart,
  removeItemFromCart,
  addItemToCart,
  clearCart,
} from "../features/cart/cartSlice";
import { createOrder, clearOrderMessages } from "../features/Order/orderSlice";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, MapPin, CreditCard, ChevronLeft } from "lucide-react";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [confirming, setConfirming] = useState(false);

  const { user } = useSelector((state) => state.user);
  const { items: cartItems, totalPrice, loading: cartLoading, error: cartError } = useSelector((state) => state.cart);
  const { loading: orderLoading, successMessage, error: orderError } = useSelector((state) => state.order);

  useEffect(() => {
    if (user?._id || user?.id) {
      dispatch(fetchCart(user._id || user.id));
    }
  }, [dispatch, user]);

  const handleUpdateQuantity = (productId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    dispatch(addItemToCart({ userId: user._id || user.id, productId, quantity: delta }));
  };

  const handleRemove = (productId) => {
    dispatch(removeItemFromCart({ userId: user._id || user.id, productId }));
  };

  const handleConfirmOrder = async () => {
    if (!address.trim()) return;
    setConfirming(true);

    const orderData = {
      userId: user._id || user.id,
      items: cartItems.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
      })),
      totalAmount: totalPrice,
      shippingAddress: address,
    };

    try {
      const res = await dispatch(createOrder(orderData));
      if (res.meta.requestStatus === "fulfilled") {
        await dispatch(clearCart(user._id || user.id));
        navigate("/order");
      }
    } catch (err) {
      console.error("Error creating order", err);
    } finally {
      setConfirming(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-900/95 dark:backdrop-blur-2xl border border-gray-100 dark:border-white/5 shadow-xl text-center max-w-md">
          <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900/50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Your cart is waiting</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Please login to view your saved items and continue shopping.</p>
          <Link to="/login" className="block w-full py-4 bg-brand text-white rounded-2xl font-bold hover:bg-brand-hover transition-all">
            Login to Account
          </Link>
        </div>
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="h-12 w-12 border-4 border-brand/30 border-t-brand rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-bold animate-pulse">Syncing your shopping bag...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-brand/5 text-brand rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag size={48} />
          </div>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Your cart is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-10">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-brand text-white rounded-2xl font-bold hover:bg-brand-hover transition-all shadow-lg shadow-brand/20">
            Start Shopping <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-10">
          <Link to="/products" className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl text-gray-600 dark:text-gray-400 hover:text-brand transition-colors">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white">Your <span className="text-brand">Shopping Cart</span></h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div 
                key={item.productId._id} 
                className="group bg-white dark:bg-gray-900/95 dark:backdrop-blur-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-6"
              >
                <div className="w-32 h-32 bg-gray-50 dark:bg-gray-700 rounded-2xl overflow-hidden shrink-0">
                  <img 
                    src={item.productId.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200"} 
                    alt={item.productId.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">{item.productId.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-1">{item.productId.description}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-4">
                    <div className="flex items-center bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-white/10 rounded-xl p-1">
                      <button 
                        onClick={() => handleUpdateQuantity(item.productId._id, item.quantity, -1)}
                        className="p-1.5 hover:bg-white dark:hover:bg-gray-600 hover:shadow-sm rounded-lg text-gray-600 dark:text-gray-400 transition-all cursor-pointer"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-bold text-gray-900 dark:text-white">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.productId._id, item.quantity, 1)}
                        className="p-1.5 hover:bg-white dark:hover:bg-gray-600 hover:shadow-sm rounded-lg text-gray-600 dark:text-gray-400 transition-all cursor-pointer"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button 
                      onClick={() => handleRemove(item.productId._id)}
                      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-black text-gray-900 dark:text-white">
                    PKR {(item.productId.price * item.quantity).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-medium tracking-tighter">
                    PKR {item.productId.price.toLocaleString()} per unit
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:sticky lg:top-32 space-y-6">
            <div className="bg-gray-900 dark:bg-gray-800 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-900/20">
              <h2 className="text-2xl font-black mb-8">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-400 font-medium">
                  <span>Subtotal</span>
                  <span className="text-white">PKR {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400 font-medium">
                  <span>Shipping</span>
                  <span className="text-green-400 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-gray-400 font-medium">
                  <span>Tax (Estimated)</span>
                  <span className="text-white">PKR 0</span>
                </div>
                <div className="h-px bg-gray-800 my-4" />
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-3xl font-black text-brand">PKR {totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <Link 
                    to="/checkout"
                    className="w-full py-5 bg-brand hover:bg-brand-hover text-white rounded-[1.5rem] font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand/20"
                  >
                    Proceed to Checkout <ArrowRight size={22} />
                  </Link>

                  <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-2xl border border-gray-700 opacity-60">
                    <CreditCard size={20} className="text-brand" />
                    <span className="text-sm font-bold">Secure Asset Transfer</span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="px-6 text-xs text-center text-gray-400 font-medium italic">
              Finalize your acquisition via our high-speed logistics network.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
