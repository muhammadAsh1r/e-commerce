import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeItemFromCart, clearCart } from "../features/cart/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { items: cartItems, totalPrice, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCart(user.id));
    }
  }, [dispatch, user]);

  const handleRemove = (productId) => {
    dispatch(removeItemFromCart({ userId: user.id, productId }));
  };

  const handleClearCart = () => {
    dispatch(clearCart(user.id));
  };

  if (!user) {
    return <p className="text-center text-red-500 mt-10">Please login to view your cart.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Your Cart</h1>

      {loading && <p className="text-gray-600">Loading cart...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && cartItems.length === 0 && (
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
        <div className="mt-8 flex justify-between items-center">
          <div className="text-xl font-semibold text-gray-800">
            Total: PKR {totalPrice.toLocaleString()}
          </div>
          <button
            onClick={handleClearCart}
            className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
          >
            Clear Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
