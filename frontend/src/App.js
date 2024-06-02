import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CategoryPage from "./Pages/CategoryPage";
import DashboardPage from "./Pages/DashboardPage";
import LoginPage from "./Pages/LoginPage";
import ProductPage from "./Pages/ProductPage";
import SignupPage from "./Pages/SignupPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/category" element={<CategoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
