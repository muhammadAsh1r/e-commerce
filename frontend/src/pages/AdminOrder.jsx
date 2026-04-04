import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, updateOrderStatus, deleteOrder, clearOrderMessages } from "../features/Order/orderSlice";
import { Package, MapPin, CreditCard, ChevronRight, ShoppingBag, Clock, CheckCircle2, Truck, XCircle, Search, Filter, AlertCircle, Trash2, ExternalLink } from "lucide-react";

const AdminOrder = () => {
  const dispatch = useDispatch();
  const { orders, loading, error, successMessage } = useSelector((state) => state.order);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const handleStatusUpdate = (id, newStatus) => {
    dispatch(updateOrderStatus({ id, orderStatus: newStatus.toLowerCase() }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      dispatch(deleteOrder(id));
    }
  };

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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (order.userId?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || (order.orderStatus || "").toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  }).reverse();

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black text-gray-900 mb-2">Order <span className="text-brand">Management</span></h1>
            <p className="text-gray-500 font-medium italic">Monitor and manage customer orders across the store</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
              <ShoppingBag className="text-brand" size={20} />
              <span className="font-bold text-gray-900">{orders.length} Total</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm mb-10 flex flex-col md:flex-row gap-6">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-brand/30 focus:ring-4 focus:ring-brand/5 rounded-2xl transition-all outline-none text-gray-700 font-medium"
            />
          </div>
          <div className="flex items-center gap-4">
            <Filter size={20} className="text-gray-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border-transparent focus:bg-white focus:border-brand/30 focus:ring-4 focus:ring-brand/5 rounded-2xl px-6 py-4 outline-none font-bold text-gray-700 transition-all cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {successMessage && (
          <div className="mb-8 p-4 bg-green-50 border border-green-100 text-green-600 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 text-sm font-bold">
            <CheckCircle2 size={20} />
            {successMessage}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 border-4 border-brand/30 border-t-brand rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row justify-between gap-10">
                    {/* Left: Basic Info */}
                    <div className="space-y-6 lg:w-1/3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Order Identifier</p>
                          <h3 className="font-mono font-black text-gray-900 text-lg">#{order._id.slice(-8).toUpperCase()}</h3>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full border text-xs font-black transition-all ${getStatusColor(order.orderStatus)}`}>
                          {(order.orderStatus || "processing").toUpperCase()}
                        </span>
                      </div>

                      <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand shadow-sm font-black">
                            {order.userId?.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</p>
                            <p className="font-black text-gray-900">{order.userId?.name || "Deleted User"}</p>
                          </div>
                        </div>
                        <div className="space-y-1 text-sm text-gray-500 font-medium pl-13">
                          <p className="flex items-center gap-2"><Mail size={14} /> {order.userId?.email || "N/A"}</p>
                          <p className="flex items-center gap-2"><MapPin size={14} /> {order.shippingAddress}</p>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Items */}
                    <div className="lg:w-1/3 flex flex-col gap-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Ordered Items ({order.items.length})</p>
                      <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 scrollbar-hide">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex gap-4 p-3 bg-white border border-gray-50 rounded-2xl shadow-sm">
                            <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                              <img src={item.productId?.images?.[0]} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-gray-900 truncate">{item.productId?.name || "Product"}</p>
                              <p className="text-xs text-gray-500">{item.quantity} × PKR {item.price.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="lg:w-1/4 border-t lg:border-t-0 lg:border-l border-gray-50 pt-8 lg:pt-0 lg:pl-10 space-y-6">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Update Fulfillment</p>
                        <select 
                          value={order.orderStatus}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-brand/30 focus:ring-4 focus:ring-brand/5 rounded-2xl px-4 py-3.5 outline-none font-bold text-gray-700 transition-all cursor-pointer text-sm"
                        >
                          <option value="processing">Mark as Processing</option>
                          <option value="shipped">Mark as Shipped</option>
                          <option value="delivered">Mark as Delivered</option>
                          <option value="cancelled">Mark as Cancelled</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Payout</p>
                          <p className="text-2xl font-black text-brand">PKR {order.totalAmount.toLocaleString()}</p>
                        </div>
                        <button 
                          onClick={() => handleDelete(order._id)}
                          className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                        >
                          <Trash2 size={22} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrder;
