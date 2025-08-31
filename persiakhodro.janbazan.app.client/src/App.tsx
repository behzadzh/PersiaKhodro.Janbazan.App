import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Dashboard Pages
import UserDashboard from './pages/dashboard/UserDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

// Profile Pages
import ProfilePage from './pages/profile/ProfilePage';

// Landing Page
import LandingPage from './pages/LandingPage';

// Vehicle Pages
import VehicleListPage from './pages/vehicles/VehicleListPage';
import NewVehiclePage from './pages/vehicles/NewVehiclePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <Navigate to="/landing" replace />
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <UserDashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <ProfilePage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/vehicles" element={
            <ProtectedRoute>
              <Layout>
                <VehicleListPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/vehicles/new" element={
            <ProtectedRoute>
              <Layout>
                <NewVehiclePage />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;