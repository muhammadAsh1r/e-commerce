import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const Order = () => {
  const user = useSelector((state) => state.user.user); // get logged-in user from redux
  const userId = user?._id; // or user?.id based on your backend data

  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:3000/api/orders/user/${userId}`);
        setOrders(res.data.orders || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && orders.length === 0 && <p>No orders found.</p>}

      {orders.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b text-left">Items</th>
                <th className="py-3 px-4 border-b text-left">Total</th>
                <th className="py-3 px-4 border-b text-left">Payment</th>
                <th className="py-3 px-4 border-b text-left">Order Status</th>
                <th className="py-3 px-4 border-b text-left">Shipping Address</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr
                    onClick={() => toggleExpand(order._id)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="py-2 px-4 border-b text-blue-600 underline">
                      {order.items.length} items
                    </td>
                    <td className="py-2 px-4 border-b">
                      PKR {order.totalAmount?.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border-b">{order.paymentStatus}</td>
                    <td className="py-2 px-4 border-b capitalize font-medium text-blue-700">
                      {order.orderStatus}
                    </td>
                    <td className="py-2 px-4 border-b">{order.shippingAddress}</td>
                  </tr>

                  {expandedOrders.includes(order._id) &&
                    order.items.map((item, idx) => (
                      <tr key={idx} className="bg-gray-50 text-sm">
                        <td className="py-1 px-4 border-b" colSpan={5}>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">
                              {item.productId?.name || "Unnamed Product"}
                            </span>
                            <span>Quantity: {item.quantity}</span>
                            <span>Price: PKR {item.price}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Order;
