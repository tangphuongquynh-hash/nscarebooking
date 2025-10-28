// src/pages/Schedule.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ThemedContainer, ThemedButton, ThemedText, ThemedCard, ThemedBadge } from '../components/ThemeComponents';

// Generate sample bookings data (more entries to demo pagination)
const generateBookings = () => {
  const services = [
    "Đặt lịch theo giờ | Hourly Booking",
    "Vệ sinh máy lạnh | Air-conditioner Cleaning", 
    "Giặt thảm | Carpet Cleaning",
    "Vệ sinh công nghiệp | Industrial Cleaning",
    "Tea Lady",
    "Tẩy vẩy cá kính | Hard spot cleaning",
    "Vệ sinh văn phòng | Office Cleaning"
  ];
  const statuses = ["pending", "confirmed", "completed", "cancelled"];
  const addresses = [
    "123 Nguyễn Văn Linh, Quận 7, HCM",
    "45 Lê Lợi, Quận 1, HCM", 
    "99 Trần Hưng Đạo, Quận 5, HCM",
    "Khu công nghiệp Tân Bình",
    "87 Hai Bà Trưng, Quận 3, HCM",
    "234 Võ Văn Tần, Quận 3, HCM"
  ];

  const bookings = [];
  for (let i = 1; i <= 45; i++) {
    // Generate dates within last 6 months
    const daysAgo = Math.floor(Math.random() * 180); // 0-180 days ago
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    bookings.push({
      id: i,
      date: date.toISOString().split('T')[0],
      time: `${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:${Math.random() > 0.5 ? '00' : '30'}`,
      service: services[Math.floor(Math.random() * services.length)],
      staff: Math.floor(Math.random() * 4) + 1,
      address: addresses[Math.floor(Math.random() * addresses.length)],
      note: Math.random() > 0.7 ? "Ghi chú đặc biệt cho booking này" : "",
      price: (Math.floor(Math.random() * 10) + 3) * 100000,
      points: Math.floor(Math.random() * 50) + 10,
      status: statuses[Math.floor(Math.random() * statuses.length)]
    });
  }

  return bookings.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date desc
};

const bookings = generateBookings();

function getStatusBadge(status) {
  switch (status) {
    case "pending":
      return <ThemedBadge variant="warning" size="xs">⏳ Đang chờ | Pending</ThemedBadge>;
    case "confirmed":
      return <ThemedBadge variant="primary" size="xs">✅ Đã xác nhận | Confirmed</ThemedBadge>;
    case "completed":
      return <ThemedBadge variant="success" size="xs">🎉 Hoàn thành | Completed</ThemedBadge>;
    case "cancelled":
      return <ThemedBadge variant="error" size="xs">❌ Đã huỷ | Cancelled</ThemedBadge>;
    default:
      return null;
  }
}

function fmtVND(n) {
  return n.toLocaleString("vi-VN") + " ₫";
}

export default function Schedule() {
  const [currentPage, setCurrentPage] = useState(1);
  const { theme } = useTheme();
  const itemsPerPage = 20;

  // Filter bookings within 6 months and paginate
  const { filteredBookings, totalPages, displayedBookings } = useMemo(() => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Filter bookings within 6 months
    const filtered = bookings.filter((booking) => {
      const bookingDate = new Date(booking.date);
      return bookingDate >= sixMonthsAgo;
    });

    // Calculate pagination
    const total = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayed = filtered.slice(startIndex, startIndex + itemsPerPage);

    return {
      filteredBookings: filtered,
      totalPages: total,
      displayedBookings: displayed
    };
  }, [currentPage]);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <ThemedContainer variant="main" className="min-h-screen p-4 pb-24">
      <ThemedText variant="primary" size="xl" className="font-bold text-center mb-6">
        Lịch hẹn | Schedule
      </ThemedText>

      {/* Pagination Info */}
      <ThemedCard className="p-4 mb-6">
        <ThemedText variant="muted" size="sm" className="text-center">
          Hiển thị {displayedBookings.length} booking (trang {currentPage}/{totalPages})
        </ThemedText>
        <ThemedText variant="muted" size="xs" className="text-center mt-1">
          Tổng {filteredBookings.length} booking trong 6 tháng gần nhất
        </ThemedText>
      </ThemedCard>

      {/* Bookings List */}
      <div className="space-y-4">
        {displayedBookings.map((b) => (
          <ThemedCard key={b.id} className="p-4 space-y-2">
            {/* Header */}
            <div className="flex justify-between items-center">
              <ThemedText variant="primary" className="font-semibold">{b.service}</ThemedText>
              {getStatusBadge(b.status)}
            </div>

            {/* Info */}
            <ThemedText variant="muted" size="sm">📅 {b.date} | ⏰ {b.time}</ThemedText>
            <ThemedText variant="muted" size="sm">👥 {b.staff} nhân viên | staff</ThemedText>
            <ThemedText variant="muted" size="sm">🏠 {b.address}</ThemedText>
            {b.note && <ThemedText variant="muted" size="sm">📝 {b.note}</ThemedText>}

            {/* Price & points */}
            <div className="flex justify-between text-sm font-medium pt-2 border-t border-gray-200">
              <ThemedText variant="secondary">💰 {fmtVND(b.price)}</ThemedText>
              <ThemedText variant="accent">⭐ {b.points} điểm | points</ThemedText>
            </div>
          </ThemedCard>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <ThemedCard className="p-4 mt-6">
          <div className="flex justify-between items-center">
            <ThemedButton
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              variant={currentPage === 1 ? "outline" : "primary"}
              size="sm"
            >
              ← Trang trước
            </ThemedButton>

            <ThemedText variant="muted" size="sm">
              Trang {currentPage} / {totalPages}
            </ThemedText>

            <ThemedButton
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant={currentPage === totalPages ? "outline" : "primary"}
              size="sm"
            >
              Trang sau →
            </ThemedButton>
          </div>

          {/* Page Numbers (show current and nearby pages) */}
          <div className="flex justify-center mt-3 space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className="w-8 h-8 rounded text-xs transition-all"
                  style={{
                    background: pageNum === currentPage ? theme.button.primary : 'rgba(255, 255, 255, 0.8)',
                    color: pageNum === currentPage ? 'white' : theme.text.primary,
                    border: `1px solid ${pageNum === currentPage ? 'transparent' : theme.primary + '40'}`
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
        </ThemedCard>
      )}
    </ThemedContainer>
  );
}