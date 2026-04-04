import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/product/productSlice";
import { fetchCategories } from "../features/category/categorySlice";
import { getAllUsers } from "../features/user/userSlice";
import { getAllOrders } from "../features/Order/orderSlice";
import { 
  TrendingUp, 
  Users as UsersIcon, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Layers,
  ChevronRight,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { items: products } = useSelector((state) => state.products);
  const { items: categories } = useSelector((state) => state.categories);
  const { users } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(getAllUsers());
    dispatch(getAllOrders());
  }, [dispatch]);

  const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const recentOrders = [...orders].reverse().slice(0, 5);

  const stats = [
    { label: "Gross Revenue", value: `PKR ${totalRevenue.toLocaleString()}`, icon: DollarSign, trend: "+12.5%", color: "teal" },
    { label: "Active Shoppers", value: users.length, icon: UsersIcon, trend: "+3.2%", color: "blue" },
    { label: "Total Inventory", value: products.length, icon: Package, trend: "-2.1%", color: "indigo" },
    { label: "Total Orders", value: orders.length, icon: ShoppingCart, trend: "+18.4%", color: "purple" },
  ];

  const colorMap = {
    teal: "bg-teal-50 text-teal-600",
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600"
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-black text-gray-900 mb-2">Commerce <span className="text-brand">Command</span></h1>
          <p className="text-gray-500 font-medium italic">High-altitude overview of your store's performance metrics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 -mr-8 -mt-8 rounded-full group-hover:scale-150 transition-transform duration-500 opacity-50" />
              <div className="flex justify-between items-start mb-6 relative">
                <div className={`p-4 rounded-2xl ${colorMap[stat.color]}`}>
                  <stat.icon size={28} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-black ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trend.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.trend}
                </div>
              </div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Recent Orders */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-gray-900 flex items-center gap-4">
                <Activity className="text-brand" /> Live Transactions
              </h2>
              <Link to="/admin/orders" className="text-sm font-black text-brand hover:underline flex items-center gap-1 uppercase tracking-widest">
                Scale Out <ChevronRight size={16} />
              </Link>
            </div>

            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Subscriber</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] font-black text-gray-400">
                            {order.user?.name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{order.user?.name || "Guest"}</p>
                            <p className="text-[10px] text-gray-400 font-medium">#{order._id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          order.status === 'delivered' ? 'bg-green-50 text-green-600' : 
                          order.status === 'shipped' ? 'bg-blue-50 text-blue-600' : 
                          'bg-amber-50 text-amber-600'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 font-black text-gray-900 text-sm">
                        PKR {order.totalPrice.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-8 py-20 text-center text-gray-400 font-medium italic">No recent activity detected.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-gray-900">Control Hub</h2>
            <div className="space-y-4">
              {[
                { title: "Manage Products", sub: "Inventory & Stock", link: "/admin/products", icon: Package, color: "teal" },
                { title: "Review Orders", sub: `${pendingOrders} Pending Fulfillment`, link: "/admin/orders", icon: Clock, color: "amber" },
                { title: "Taxonomy Settings", sub: "Categories & Filters", link: "/admin/categories", icon: Layers, color: "blue" },
                { title: "User Permissions", sub: "Access Control", link: "/admin/users", icon: UsersIcon, color: "purple" },
              ].map((item, i) => (
                <Link 
                  key={i}
                  to={item.link}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:border-brand/30 hover:shadow-lg transition-all group"
                >
                  <div className={`p-4 rounded-2xl group-hover:scale-110 transition-transform ${colorMap[item.color]}`}>
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900">{item.title}</h4>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{item.sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
