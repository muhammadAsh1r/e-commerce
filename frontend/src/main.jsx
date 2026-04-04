import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {store} from "./app/store.js";
import { Provider } from "react-redux";
import axios from "axios";
import App from "./App.jsx";

const getBaseURL = () => {
  const url = import.meta.env.VITE_API_URL || "";
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

axios.defaults.baseURL = getBaseURL();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
