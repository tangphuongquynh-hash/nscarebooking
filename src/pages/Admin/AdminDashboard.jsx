// src/pages/Admin/AdminDashboard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { ThemedContainer, ThemedButton, ThemedText, ThemedCard } from "../../components/ThemeComponents";

export default function AdminDashboard() {
  // 📊 State cho dashboard
  const [revenue, setRevenue] = useState(15200000);
  const [bookings, setBookings] = useState(42);
  const [growth, setGrowth] = useState(12);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // 📤 Xuất báo cáo CSV
  const handleExport = () => {
    const data = [
      ["Tháng", "Doanh thu (₫)", "Số lượt booking"],
      ["04/2024", "12,000,000", "35"],
      ["05/2024", "15,200,000", "42"],
      ["06/2024", "17,800,000", "50"],
      ["07/2024", "19,400,000", "57"],
      ["08/2024", "21,000,000", "63"],
      ["09/2024", "23,500,000", "70"],
    ];

    const csv = data.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "doanhthu.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 🧾 Giao diện Dashboard
  return (
    <ThemedContainer variant="main" className="min-h-screen p-4 pb-24">
      <ThemedText variant="primary" size="2xl" className="font-bold text-center mb-6">
        🧭 Admin Dashboard
      </ThemedText>

      {/* --- Section 1: Báo cáo --- */}
      <ThemedCard className="p-5 mb-6">
        <ThemedText variant="primary" size="lg" className="font-semibold mb-3">
          📊 Báo cáo | Report
        </ThemedText>

        {/* Bộ lọc */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <label className="text-sm text-gray-600">Từ | From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 text-sm"
          />
          <label className="text-sm text-gray-600">Đến | To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 text-sm"
          />
          <ThemedButton
            onClick={handleExport}
            size="sm"
          >
            ⬇️ Xuất báo cáo | Export CSV
          </ThemedButton>
        </div>

        {/* Tổng quan */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <ThemedCard className="p-4">
            <ThemedText variant="muted" size="sm">Tổng doanh thu | Revenue</ThemedText>
            <ThemedText variant="primary" size="xl" className="font-bold">
              {revenue.toLocaleString("vi-VN")} ₫
            </ThemedText>
          </ThemedCard>

          <ThemedCard className="p-4">
            <ThemedText variant="muted" size="sm">Số lượt booking | Bookings</ThemedText>
            <ThemedText variant="primary" size="xl" className="font-bold">{bookings}</ThemedText>
          </ThemedCard>
        </div>

        <div className="text-center mt-4">
          <p
            className={`font-semibold ${
              growth >= 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {growth >= 0 ? "📈" : "📉"} Tăng trưởng so với tháng trước: {growth}%
          </p>
        </div>
      </ThemedCard>

      {/* --- Section 2: Các chức năng --- */}
      <section>
        <ThemedText variant="primary" size="lg" className="font-semibold mb-3">
          ⚙️ Chức năng quản trị | Admin Functions
        </ThemedText>

        <div className="grid grid-cols-2 gap-4">
          <Link to="/admin/approval">
            <ThemedCard 
              hover 
              className="p-5 text-center"
              style={{
                background: 'linear-gradient(135d, #d1fae5 0%, #a7f3d0 100%)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <div className="text-3xl mb-1">✅</div>
              <ThemedText variant="primary" className="font-semibold">Phê duyệt</ThemedText>
              <ThemedText variant="muted" size="xs">Approval</ThemedText>
            </ThemedCard>
          </Link>

          <Link to="/admin/usedpoint">
            <ThemedCard 
              hover 
              className="p-5 text-center"
              style={{
                background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <div className="text-3xl mb-1">💎</div>
              <ThemedText variant="primary" className="font-semibold">Quản lý điểm</ThemedText>
              <ThemedText variant="muted" size="xs">Used Point</ThemedText>
            </ThemedCard>
          </Link>

          <Link to="/admin/ui-settings">
            <ThemedCard 
              hover 
              className="p-5 text-center"
              style={{
                background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <div className="text-3xl mb-1">🎨</div>
              <ThemedText variant="primary" className="font-semibold">Giao diện</ThemedText>
              <ThemedText variant="muted" size="xs">UI Settings</ThemedText>
            </ThemedCard>
          </Link>

          <Link to="/">
            <ThemedCard 
              hover 
              className="p-5 text-center" 
              style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <div className="text-3xl mb-1">⬅️</div>
              <ThemedText variant="primary" className="font-semibold">Trang chính</ThemedText>
              <ThemedText variant="muted" size="xs">Back to Home</ThemedText>
            </ThemedCard>
          </Link>
        </div>
      </section>
    </ThemedContainer>
  );
}