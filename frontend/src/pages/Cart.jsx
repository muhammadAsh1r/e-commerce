import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // <-- import useNavigate
import {
  fetchCart,
  removeItemFromCart,
  clearCart,
} from "../features/cart/cartSlice";
import { createOrder, clearOrderMessages } from "../features/Order/orderSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // <-- get navigate function
  const [address, setAddress] = useState(""); // address input state
  const [confirming, setConfirming] = useState(false); // local loading state

  const { user } = useSelector((state) => state.user);

  const {
    items: cartItems,
    totalPrice,
    loading: cartLoading,
    error: cartError,
  } = useSelector((state) => state.cart);

  const {
    loading: orderLoading,
    successMessage,
    error: orderError,
  } = useSelector((state) => state.order);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCart(user.id));
    }
  }, [dispatch, user]);

  // Auto clear order messages after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearOrderMessages());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  const handleRemove = (productId) => {
    dispatch(removeItemFromCart({ userId: user.id, productId }));
  };

  const handleClearCart = () => {
    dispatch(clearCart(user.id));
    setAddress(""); // clear address too
  };

  const handleConfirmOrder = async () => {
    if (!address.trim()) return; // prevent empty address

    setConfirming(true);

    const orderData = {
      userId: user.id,
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
        await dispatch(clearCart(user.id));
        await dispatch(fetchCart(user.id));
        setAddress("");

        // Redirect to the full external URL
        navigate("/order");
      } else {
        console.error("Order creation failed", res.error);
      }
    } catch (err) {
      console.error("Error creating order", err);
    } finally {
      setConfirming(false);
    }
  };

  if (!user) {
    return (
      <p className="text-center text-red-500 mt-10">
        Please login to view your cart.
      </p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Your Cart</h1>

      {cartLoading && <p className="text-gray-600">Loading cart...</p>}
      {cartError && <p className="text-red-500">Error: {cartError}</p>}
      {orderError && (
        <p className="text-red-500">
          Order Error:{" "}
          {typeof orderError === "string" ? orderError : orderError.message}
        </p>
      )}
      {successMessage && (
        <p className="text-green-600 font-semibold">{successMessage}</p>
      )}

      {!cartLoading && cartItems.length === 0 && (
        <p className="text-gray-600">Your cart is empty.</p>
      )}

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.productId._id}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center space-x-4">
              {item.productId.images?.[0] ? (
                <img
                  src={item.productId.images[0]}
                  alt={item.productId.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <div>
                <h2 className="text-lg font-semibold text-gray-700">
                  {item.productId.name}
                </h2>
                <p className="text-sm text-gray-600">
                  Quantity: {item.quantity}
                </p>
                <p className="text-sm text-gray-600">
                  Price: PKR {item.productId.price}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleRemove(item.productId._id)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {cartItems.length > 0 && (
        <div className="mt-8 flex flex-col gap-6">
          {/* Address Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shipping Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter shipping address"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="text-xl font-semibold text-gray-800">
              Total: PKR {totalPrice.toLocaleString()}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleClearCart}
                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
              >
                Clear Cart
              </button>

              <button
                onClick={handleConfirmOrder}
                disabled={confirming || !address.trim()}
                className="bg-teal-600 text-white px-4 py-2 rounded-xl hover:bg-teal-700 disabled:opacity-50"
              >
                {confirming ? "Confirming..." : "Confirm Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
