// app/store.js
import { configureStore, createReducer } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import userReducer from "../features/user/userSlice";
import productReducer from "../features/product/productSlice";
import categoryReducer from "../features/category/categorySlice"; // ✅ import it
import cartReducer from "../features/cart/cartSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    products: productReducer,
    categories: categoryReducer, // ✅ add it to the store
    cart: cartReducer,
  },
});
