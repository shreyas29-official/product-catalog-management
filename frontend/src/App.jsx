import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SplashPage from './pages/SplashPage';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminNotifications from './pages/admin/AdminNotifications';
import ClientDashboard from './pages/client/ClientDashboard';
import ClientProducts from './pages/client/ClientProducts';
import ProductDetail from './pages/client/ProductDetail';
import ClientCart from './pages/client/ClientCart';
import ClientOrders from './pages/client/ClientOrders';
import ClientNotifications from './pages/client/ClientNotifications';

const SPLASH_DURATION = 2800;

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'admin' ? '/admin' : '/client'} replace />;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const { loading: authLoading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashPage />;
  }

  if (authLoading) {
    return <SplashPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute role="admin"><AdminProducts /></ProtectedRoute>} />
      <Route path="/admin/products/:id" element={<ProtectedRoute role="admin"><AdminProducts /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute role="admin"><AdminOrders /></ProtectedRoute>} />
      <Route path="/admin/notifications" element={<ProtectedRoute role="admin"><AdminNotifications /></ProtectedRoute>} />

      <Route path="/client" element={<ProtectedRoute role="client"><ClientDashboard /></ProtectedRoute>} />
      <Route path="/client/products" element={<ProtectedRoute role="client"><ClientProducts /></ProtectedRoute>} />
      <Route path="/client/products/:id" element={<ProtectedRoute role="client"><ProductDetail /></ProtectedRoute>} />
      <Route path="/client/cart" element={<ProtectedRoute role="client"><ClientCart /></ProtectedRoute>} />
      <Route path="/client/orders" element={<ProtectedRoute role="client"><ClientOrders /></ProtectedRoute>} />
      <Route path="/client/notifications" element={<ProtectedRoute role="client"><ClientNotifications /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
