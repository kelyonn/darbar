import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import LivePurchaseFeed from './components/LivePurchaseFeed';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public pages
import Home from './pages/Home';
import Collections from './pages/Collections';
import ProductPage from './pages/ProductPage';
import About from './pages/About';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Returns from './pages/Returns';
import NotFound from './pages/NotFound';

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ResendVerification from './pages/ResendVerification';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Customer pages
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Profile from './pages/Profile';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminSellers from './pages/admin/AdminSellers';
import AdminAnalytics from './pages/admin/AdminAnalytics';

// Seller pages
import SellerLayout from './layouts/SellerLayout';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import SellerOrders from './pages/seller/SellerOrders';
import SellerApply from './pages/seller/SellerApply';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <ToastProvider>
              <CartProvider>
                <WishlistProvider>
                  <ErrorBoundary>
                    <ScrollToTop />
                    <LivePurchaseFeed />
                    <Routes>
                {/* Auth pages — full screen, no shell */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email/:token" element={<VerifyEmail />} />
                <Route path="/resend-verification" element={<ResendVerification />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

                {/* Admin — own layout */}
                <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
                <Route path="/admin/orders" element={<ProtectedRoute roles={['admin']}><AdminOrders /></ProtectedRoute>} />
                <Route path="/admin/products" element={<ProtectedRoute roles={['admin']}><AdminProducts /></ProtectedRoute>} />
                <Route path="/admin/coupons" element={<ProtectedRoute roles={['admin']}><AdminCoupons /></ProtectedRoute>} />
                <Route path="/admin/sellers" element={<ProtectedRoute roles={['admin']}><AdminSellers /></ProtectedRoute>} />
                <Route path="/admin/analytics" element={<ProtectedRoute roles={['admin']}><AdminAnalytics /></ProtectedRoute>} />

                {/* Seller Routes */}
                <Route path="/seller" element={<ProtectedRoute roles={['seller', 'admin']}><SellerLayout /></ProtectedRoute>}>
                  <Route index element={<SellerDashboard />} />
                  <Route path="products" element={<SellerProducts />} />
                  <Route path="orders" element={<SellerOrders />} />
                </Route>

                {/* Main store layout */}
                <Route
                  path="*"
                  element={
                    <div className="min-h-screen bg-royal-ivory flex flex-col">
                      <Navbar />
                      <main className="flex-grow">
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/collections" element={<Collections />} />
                          <Route path="/mens" element={<Collections category="mens" />} />
                          <Route path="/womens" element={<Collections category="womens" />} />
                          <Route path="/accessories" element={<Collections category="accessories" />} />
                          <Route path="/product/:id" element={<ProductPage />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/terms" element={<Terms />} />
                          <Route path="/returns" element={<Returns />} />
                          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                          <Route path="/liked" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                          <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
                          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                          <Route path="/sell" element={<ProtectedRoute><SellerApply /></ProtectedRoute>} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                      <Footer />
                    </div>
                  }
                />
                    </Routes>
                  </ErrorBoundary>
                </WishlistProvider>
              </CartProvider>
            </ToastProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;