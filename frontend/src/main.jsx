import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {store} from "./app/store.js";
import { Provider } from "react-redux";
import axios from "axios";
import App from "./App.jsx";

axios.defaults.baseURL = import.meta.env.VITE_API_URL || "";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
