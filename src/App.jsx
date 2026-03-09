import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";
import MyOrdersPage from "./pages/MyOrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage"; // Imported

import ForgotPasswordPage from "./pages/ForgotPassword.jsx";
import ResetPasswordPage from "./pages/ResetPassword.jsx";

import LoadingSpinner from "./components/LoadingSpinner";
import { Toaster } from "react-hot-toast";

import { useUserStore } from "./stores/useUserStore";
import { useCartStore } from "./stores/useCartStore";
import ProductDetailPage from "./pages/ProductDetailPage";

import Layout from "./layouts/Layout";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!user) return;
    getCartItems();
  }, [user, getCartItems]);

  if (checkingAuth) return <LoadingSpinner />;

  return (
    <div className="bg-white text-black dark:bg-gray-900 dark:text-white relative overflow-hidden transition-colors duration-300">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="
            absolute top-0 left-1/2 -translate-x-1/2 w-full h-full
            bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15)_0%,rgba(99,102,241,0.05)_45%,rgba(255,255,255,0)_100%)]
            dark:bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]
          "
        />
      </div>
      <div className="relative z-50">
        <Layout>
          <Routes>
            <Route path="/" element={user?.role === "admin" ? <Navigate to="/secret-dashboard" /> : <HomePage />} />

            <Route
              path="/signup"
              element={!user ? <SignUpPage /> : (user.role === "admin" ? <Navigate to="/secret-dashboard" /> : <Navigate to="/" />)}
            />
            <Route
              path="/login"
              element={!user ? <LoginPage /> : (user.role === "admin" ? <Navigate to="/secret-dashboard" /> : <Navigate to="/" />)}
            />

            <Route
              path="/forgot-password"
              element={!user ? <ForgotPasswordPage /> : <Navigate to="/" />}
            />

            <Route
              path="/reset-password"
              element={
                !user && location.state?.email ? (
                  <ResetPasswordPage />
                ) : (
                  <Navigate to="/forgot-password" />
                )
              }
            />

            <Route
              path="/my-orders"
              element={user ? <MyOrdersPage /> : <Navigate to="/login" />}
            />

            {/* New Order Detail Route */}
            <Route
              path="/orders/:id"
              element={user ? <OrderDetailPage /> : <Navigate to="/login" />}
            />

            <Route
              path="/secret-dashboard"
              element={
                user?.role === "admin" ? <AdminPage /> : <Navigate to="/login" />
              }
            />

            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/products" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/search" element={<CategoryPage />} />
            <Route path="/shop" element={<CategoryPage />} />

            <Route
              path="/cart"
              element={user ? <CartPage /> : <Navigate to="/login" />}
            />

            <Route
              path="/profile"
              element={user ? <ProfilePage /> : <Navigate to="/login" />}
            />

            <Route
              path="/purchase-success"
              element={user ? <PurchaseSuccessPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/purchase-cancel"
              element={user ? <PurchaseCancelPage /> : <Navigate to="/login" />}
            />

            <Route
              path="/contact"
              element={user ? <ContactPage /> : <Navigate to="/login" />}
            />

            <Route path="/checkout-success" element={<CheckoutSuccess />} />
          </Routes>

          <Toaster position="top-right" />
        </Layout>
      </div>
    </div>
  );
}

export default App;
