import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products/Products";
import Navbar from "./components/Navbar/Navbar";
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

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);
  return (
    <Router>
      <Navbar />
      {/* <UserNavbar/> */}
      <Routes>
        <Route path="/admin/products" element={<Products />} />
        <Route path="/admin/orders" element={<AdminOrder />} />
        <Route path="/admin/categories" element={<Category />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/products" element={<UserProducts />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<Order />} />
      </Routes>
    </Router>
  );
};

export default App;
