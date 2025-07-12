import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrders,
  deleteOrder,
  updateOrderStatus,
  clearOrderMessages,
} from "../features/Order/orderSlice";

const Order = () => {
  const dispatch = useDispatch();

  const { orders, loading, error, successMessage } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(getAllOrders());

    // Clear messages on unmount
    return () => {
      dispatch(clearOrderMessages());
    };
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      dispatch(deleteOrder(id));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateOrderStatus({ id, status: newStatus }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Orders</h1>

      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-500">Error: {error.message || error}</p>}
      {successMessage && <p className="text-green-600">{successMessage}</p>}

      {orders.length === 0 && !loading && <p>No orders found.</p>}

      {orders.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b border-gray-300 text-left">
                  Order ID
                </th>
                <th className="py-3 px-4 border-b border-gray-300 text-left">
                  User ID
                </th>
                <th className="py-3 px-4 border-b border-gray-300 text-left">
                  Items
                </th>
                <th className="py-3 px-4 border-b border-gray-300 text-left">
                  Total Amount
                </th>
                <th className="py-3 px-4 border-b border-gray-300 text-left">
                  Payment Status
                </th>
                <th className="py-3 px-4 border-b border-gray-300 text-left">
                  Order Status
                </th>
                <th className="py-3 px-4 border-b border-gray-300 text-left">
                  Shipping Address
                </th>
                <th className="py-3 px-4 border-b border-gray-300 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b border-gray-300">
                    {order._id}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300">
                    {order.userId}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300 max-w-xs">
                    {order.items
                      .map(
                        (item) =>
                          `${
                            item.productId?.name || item.productId || "Product"
                          } (x${item.quantity})`
                      )
                      .join(", ")}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300">
                    PKR {order.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300">
                    {order.paymentStatus}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300">
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300">
                    {order.shippingAddress}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300">
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Order;
