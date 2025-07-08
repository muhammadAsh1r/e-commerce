import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import userReducer from "../features/user/userSlice"; // adjust path as needed

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer, // add user slice here
  },
});
