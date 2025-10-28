import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import HourlyBooking from "./pages/HourlyBooking";
import OtherBooking from "./pages/OtherBooking";
import Schedule from "./pages/Schedule";
import BottomNav from "./components/BottomNav";
import Header from "./components/Header";
import { login } from "zmp-sdk";

// 🟢 Import các trang admin
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Approval from "./pages/Admin/Approval";
import UsedPoint from "./pages/Admin/UsedPoint";
import UISettings from "./pages/Admin/UISettings";

export default function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  // 🧠 Load Zalo user info khi app khởi động
  useEffect(() => {
    const zaloUser = {
      name: localStorage.getItem("zalo_name") || "",
      phone: localStorage.getItem("zalo_phone") || "",
      uid: localStorage.getItem("zalo_uid") || "",
    };
    if (zaloUser.name || zaloUser.phone || zaloUser.uid) {
      setUser(zaloUser);
      console.log("🧩 Zalo user loaded:", zaloUser);
    } else {
      console.log("⚠️ Chưa có thông tin user trong localStorage");
    }
  }, []);

  // 🧭 Ẩn BottomNav cho các trang admin con (không phải main admin dashboard)
  const hideBottomNav = location.pathname.startsWith("/admin") && location.pathname !== "/admin";

  return (
    <ThemeProvider>
      <AppContent user={user} location={location} hideBottomNav={hideBottomNav} />
    </ThemeProvider>
  );
}

// Separate component to use theme context
function AppContent({ user, location, hideBottomNav }) {
  return (
    <div className="min-h-screen pb-16">
      <Header title={"NS CARE Booking"} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/hourly-booking" element={<HourlyBooking user={user} />} />
        <Route path="/other-booking" element={<OtherBooking user={user} />} />
        <Route path="/schedule" element={<Schedule user={user} />} />

        {/* Trang admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/approval" element={<Approval />} />
        <Route path="/admin/usedpoint" element={<UsedPoint />} />
        <Route path="/admin/ui-settings" element={<UISettings />} />
      </Routes>

      {!hideBottomNav && <BottomNav />}
    </div>
  );
}