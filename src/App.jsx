import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import HourlyBooking from "./pages/HourlyBooking";
import OtherBooking from "./pages/OtherBooking";
import Schedule from "./pages/Schedule";
import ZMPDemo from "./pages/ZMPDemo";
import ZMPBooking from "./pages/ZMPBooking";
import BottomNav from "./components/BottomNav";
import Header from "./components/Header";
import AuthDebugPanel from "./components/AuthDebugPanel";

// 🟢 Import các trang admin
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Approval from "./pages/Admin/Approval";
import UsedPoint from "./pages/Admin/UsedPoint";
import UISettings from "./pages/Admin/UISettings";

export default function App() {
  const location = useLocation();

  // 🧭 Ẩn BottomNav cho các trang admin con (không phải main admin dashboard)
  const hideBottomNav = location.pathname.startsWith("/admin") && location.pathname !== "/admin";

  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent location={location} hideBottomNav={hideBottomNav} />
      </ThemeProvider>
    </AuthProvider>
  );
}

// Separate component to use theme and auth contexts
function AppContent({ location, hideBottomNav }) {
  return (
    <div className="min-h-screen pb-16">
      <Header title={"NS CARE Booking"} />
      
      {/* Debug Panel - Only show in development or when needed */}
      <AuthDebugPanel />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hourly-booking" element={<HourlyBooking />} />
        <Route path="/other-booking" element={<OtherBooking />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/zmp-demo" element={<ZMPDemo />} />
        <Route path="/zmp-booking" element={<ZMPBooking />} />

        {/* Trang admin được bảo vệ */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/approval" element={
          <ProtectedRoute requireAdmin>
            <Approval />
          </ProtectedRoute>
        } />
        <Route path="/admin/usedpoint" element={
          <ProtectedRoute requireAdmin>
            <UsedPoint />
          </ProtectedRoute>
        } />
        <Route path="/admin/ui-settings" element={
          <ProtectedRoute requireAdmin>
            <UISettings />
          </ProtectedRoute>
        } />
      </Routes>

      {!hideBottomNav && <BottomNav />}
    </div>
  );
}