import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { Package, MapPin, CreditCard, ChevronRight, ShoppingBag, Clock, CheckCircle2, Truck, XCircle } from "lucide-react";

const Order = () => {
  const user = useSelector((state) => state.user.user);
  const userId = user?.id || user?._id;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/orders/user/${userId}`);
        setOrders(res.data.orders.reverse() || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-600 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <Clock size={14} />;
      case 'processing': return <Package size={14} />;
      case 'shipped': return <Truck size={14} />;
      case 'delivered': return <CheckCircle2 size={14} />;
      case 'cancelled': return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  if (!userId) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl text-center max-w-md">
          <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-4">View your orders</h2>
          <p className="text-gray-500 mb-8">Please login to see your purchase history and track active shipments.</p>
          <Link to="/login" className="block w-full py-4 bg-brand text-white rounded-2xl font-bold hover:bg-brand-hover transition-all">
            Login to Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black text-gray-900 mb-2">Order <span className="text-brand">History</span></h1>
            <p className="text-gray-500 font-medium italic">Track your shipments and view previous purchases</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Package className="text-brand" size={20} />
            <span className="font-bold text-gray-900">{orders.length} Total Orders</span>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 border-4 border-brand/30 border-t-brand rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-[2rem] text-center font-bold">
            {error}
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="bg-white p-16 rounded-[3.5rem] border border-gray-100 shadow-xl text-center">
            <div className="w-24 h-24 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag size={48} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">No orders yet</h2>
            <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto">Your purchase history will appear here once you've made your first order.</p>
            <Link to="/products" className="inline-flex items-center gap-3 px-8 py-4 bg-brand text-white rounded-2xl font-bold hover:bg-brand-hover transition-all shadow-lg shadow-brand/20">
              Go to Store <ChevronRight size={20} />
            </Link>
          </div>
        )}

        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Order Header */}
              <div className="p-6 md:p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between gap-6 bg-gray-50/30">
                <div className="flex flex-wrap gap-8">
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                    <p className="font-bold text-gray-900 font-mono text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Date</p>
                    <p className="font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                    <p className="font-black text-brand">PKR {order.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-black transition-all ${getStatusColor(order.orderStatus)}`}>
                    {getStatusIcon(order.orderStatus)}
                    {order.orderStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2 space-y-6">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 group">
                        <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                          <img 
                            src={item.productId?.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200"} 
                            alt={item.productId?.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 truncate">{item.productId?.name || "Premium Product"}</h4>
                          <p className="text-sm text-gray-500 font-medium">Qty: {item.quantity} × PKR {item.price.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-gray-900 text-sm">PKR {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-6 border-t lg:border-t-0 lg:border-l border-gray-50 pt-6 lg:pt-0 lg:pl-10">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                        <MapPin size={14} className="text-brand" /> Delivery Address
                      </div>
                      <p className="text-sm font-bold text-gray-700 leading-relaxed italic">
                        "{order.shippingAddress}"
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                        <CreditCard size={14} className="text-brand" /> Payment Details
                      </div>
                      <p className="text-sm font-bold text-gray-900">Cash on Delivery</p>
                      <p className={`text-xs font-bold mt-1 ${order.paymentStatus === 'Completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                        Status: {order.paymentStatus}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Order;
