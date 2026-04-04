import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products/Products";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserProfile from "./pages/UserProfile";
import UserProducts from "./pages/Products/UserProducts";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUserFromStorage } from "./features/user/userSlice";
import Category from "./pages/Category/Category";
import Users from "./pages/Users";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import AdminOrder from "./pages/AdminOrder";
import AdminDashboard from "./pages/AdminDashboard";
import Checkout from "./pages/Checkout";
import ProductDetails from "./pages/Products/ProductDetails";
import Payment from "./pages/Payment";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);
  return (
    <Router>
      <div className="flex h-screen overflow-hidden font-sans">
        <Sidebar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          <Routes>
            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<Products />} />
              <Route path="/admin/orders" element={<AdminOrder />} />
              <Route path="/admin/categories" element={<Category />} />
              <Route path="/admin/users" element={<Users />} />
            </Route>

            {/* Protected Customer Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment/:id" element={<Payment />} />
              <Route path="/order" element={<Order />} />
            </Route>

            {/* Public Routes */}
            <Route path="/products" element={<UserProducts />} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/product/:id" element={<ProductDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
