import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrders,
  clearOrderMessages,
} from "../features/Order/orderSlice";

const Order = () => {
  const dispatch = useDispatch();
  const [expandedOrders, setExpandedOrders] = useState([]);

  const {
    orders: orderState,
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.order);

  const orders = orderState?.orders || [];

  useEffect(() => {
    dispatch(getAllOrders());
    return () => {
      dispatch(clearOrderMessages());
    };
  }, [dispatch]);

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
      {error && <p className="text-red-500">Error: {error.message || error}</p>}
      {successMessage && <p className="text-green-600">{successMessage}</p>}
      {orders.length === 0 && !loading && <p>No orders found.</p>}

      {orders.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b text-left">User</th>
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
                    <td className="py-2 px-4 border-b">
                      <div>{order.userId?.name || "Unknown"}</div>
                      <div className="text-sm text-gray-500">
                        {order.userId?.email}
                      </div>
                    </td>
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
                        <td className="py-1 px-4 border-b" colSpan={6}>
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
