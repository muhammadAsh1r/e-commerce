// app/store.js
import { configureStore, createReducer } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import userReducer from "../features/user/userSlice";
import productReducer from "../features/product/productSlice";
import categoryReducer from "../features/category/categorySlice";
import cartReducer from "../features/cart/cartSlice";
import orderReducer from "../features/Order/orderSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    products: productReducer,
    categories: categoryReducer,
    cart: cartReducer,
    order: orderReducer,
  },
});
