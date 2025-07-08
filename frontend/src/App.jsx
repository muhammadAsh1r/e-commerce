import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/products" element={<Products />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
