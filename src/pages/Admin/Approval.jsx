// src/pages/Admin/Approval.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useTheme } from '../../contexts/ThemeContext';
import { ThemedContainer, ThemedButton, ThemedText, ThemedCard, ThemedBadge, ThemedInput } from '../../components/ThemeComponents';
import { getBookings } from '../../api';
import { 
  sendBookingConfirmation, 
  sendServiceCompletion, 
  sendBookingCancellation 
} from '../../services/znsService';
import FloatingDashboardButton from '../../components/FloatingDashboardButton';

function generateBookingCode(date, index) {
  const d = new Date(date);
  const year = d.getFullYear().toString().slice(-2);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${day}${month}${year}-${String(index + 1).padStart(3, "0")}`;
}

// Real bookings will be fetched from API

function getStatusBadge(status) {
  const badgeStyle = {
    minWidth: '120px',
    textAlign: 'center',
    whiteSpace: 'nowrap'
  };
  
  switch (status) {
    case "pending":
      return <ThemedBadge variant="warning" size="sm" style={badgeStyle}>⏳ Đang chờ</ThemedBadge>;
    case "confirmed":
      return <ThemedBadge variant="primary" size="sm" style={badgeStyle}>✅ Xác nhận</ThemedBadge>;
    case "completed":
      return <ThemedBadge variant="success" size="sm" style={badgeStyle}>🎉 Hoàn thành</ThemedBadge>;
    case "cancelled":
      return <ThemedBadge variant="error" size="sm" style={badgeStyle}>❌ Đã huỷ</ThemedBadge>;
    default:
      return null;
  }
}

export default function Approval() {
  const { theme } = useTheme();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "all",
    name: "",
    phone: ""
  });
  
  const itemsPerPage = 20;

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getBookings();
        setBookings(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Không thể tải dữ liệu booking');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Filter and sort bookings
  const { filteredBookings, totalPages, displayedBookings } = useMemo(() => {
    let filtered = bookings.filter((booking) => {
      const matchesStatus = filters.status === "all" || booking.status === filters.status;
      const matchesName = !filters.name || booking.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchesPhone = !filters.phone || booking.phone.includes(filters.phone);
      
      return matchesStatus && matchesName && matchesPhone;
    });

    // Sort by priority: incomplete bookings first (pending, confirmed), then completed/cancelled
    filtered.sort((a, b) => {
      const getPriority = (status) => {
        switch (status) {
          case "pending": return 1;
          case "confirmed": return 2;
          case "completed": return 3;
          case "cancelled": return 4;
          default: return 5;
        }
      };
      
      const priorityA = getPriority(a.status);
      const priorityB = getPriority(b.status);
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      // If same priority, sort by date (newest first)
      return new Date(b.date) - new Date(a.date);
    });

    const total = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayed = filtered.slice(startIndex, startIndex + itemsPerPage);

    return {
      filteredBookings: filtered,
      totalPages: total,
      displayedBookings: displayed
    };
  }, [bookings, filters, currentPage]);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleAction = async (id, action) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;

    try {
      let newStatus = booking.status;
      let znsResult = null;
      let successMsg = "";
      let errorMsg = "";

      if (action === "confirm") {
        newStatus = "confirmed";
        console.log('📤 Sending booking confirmation ZNS...');
        znsResult = await sendBookingConfirmation(booking);
        
        if (znsResult.success) {
          successMsg = `✅ Xác nhận thành công và đã gửi ZNS cho ${booking.name}`;
          if (znsResult.developmentMode) {
            successMsg += ' (Development mode - check console)';
          }
        } else {
          errorMsg = `⚠️ Đã xác nhận nhưng gửi ZNS thất bại: ${znsResult.error}`;
        }
        
      } else if (action === "complete") {
        newStatus = "completed";
        console.log('📤 Sending service completion ZNS...');
        znsResult = await sendServiceCompletion(booking);
        
        const points = Math.floor(((booking.total || 0) * 0.05) / 1000);
        if (znsResult.success) {
          successMsg = `🎉 Hoàn thành và đã gửi ZNS thông báo ${points} điểm cho ${booking.name}`;
          if (znsResult.developmentMode) {
            successMsg += ' (Development mode - check console)';
          }
        } else {
          errorMsg = `⚠️ Đã đánh dấu hoàn thành nhưng gửi ZNS thất bại: ${znsResult.error}`;
        }
        
      } else if (action === "cancel") {
        const reason = prompt("Lý do hủy booking (tùy chọn):", "Theo yêu cầu khách hàng");
        if (reason === null) return; // User cancelled
        
        newStatus = "cancelled";
        console.log('📤 Sending booking cancellation ZNS...');
        znsResult = await sendBookingCancellation(booking, reason);
        
        if (znsResult.success) {
          successMsg = `❌ Đã hủy booking và gửi ZNS thông báo cho ${booking.name}`;
          if (znsResult.developmentMode) {
            successMsg += ' (Development mode - check console)';
          }
        } else {
          errorMsg = `⚠️ Đã hủy booking nhưng gửi ZNS thất bại: ${znsResult.error}`;
        }
      }

      // Update booking status
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id === id) {
            return { 
              ...b, 
              status: newStatus,
              lastZnsResult: znsResult,
              lastZnsTime: new Date().toISOString()
            };
          }
          return b;
        })
      );

      // Show result message
      if (successMsg) {
        alert(successMsg);
      } else if (errorMsg) {
        alert(errorMsg);
      }

      // Log ZNS result for debugging
      console.log('📱 ZNS Result:', znsResult);
      
    } catch (error) {
      console.error('❌ Action failed:', error);
      alert(`❌ Lỗi: ${error.message}`);
    }
  };

  const exportCSV = () => {
    const headers = [
      "Mã",
      "Tên",
      "Phone",
      "Dịch vụ",
      "Ngày",
      "Giờ",
      "Số NV",
      "Thời lượng",
      "Tổng tiền",
      "Trạng thái",
      "Điểm tích luỹ",
    ];

    const rows = filteredBookings.map((b, idx) => [
      generateBookingCode(b.date, idx),
      b.name,
      b.phone,
      b.service,
      b.date,
      b.time,
      b.staff,
      b.duration,
      b.total,
      b.status,
      Math.floor((b.total * 0.05) / 1000),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((r) => r.join(",")).join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "approvals.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Loading state
  if (loading) {
    return (
      <ThemedContainer variant="main" className="min-h-screen p-4 pb-24">
        <ThemedText variant="primary" size="xl" className="font-bold text-center mb-6">
          Phê Duyệt Booking | Approval
        </ThemedText>
        <ThemedCard className="p-8">
          <ThemedText variant="muted" className="text-center">
            🔄 Đang tải dữ liệu từ server...
          </ThemedText>
        </ThemedCard>
      </ThemedContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <ThemedContainer variant="main" className="min-h-screen p-4 pb-24">
        <ThemedText variant="primary" size="xl" className="font-bold text-center mb-6">
          Phê Duyệt Booking | Approval
        </ThemedText>
        <ThemedCard className="p-8">
          <ThemedText variant="error" className="text-center">
            ❌ {error}
          </ThemedText>
          <ThemedButton 
            onClick={() => window.location.reload()} 
            variant="primary" 
            size="sm" 
            className="mt-4 mx-auto block"
          >
            🔄 Thử lại
          </ThemedButton>
        </ThemedCard>
      </ThemedContainer>
    );
  }

  return (
    <ThemedContainer variant="main" className="min-h-screen p-4 pb-24">
      <ThemedText variant="primary" size="xl" className="font-bold text-center mb-6">
        Phê Duyệt Booking | Approval
      </ThemedText>

      {/* Filters */}
      <ThemedCard className="p-4 mb-6">
        <ThemedText variant="secondary" size="sm" className="mb-3 font-semibold">
          🔍 Bộ lọc | Filters
        </ThemedText>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs mb-1" style={{ color: theme.text.muted }}>
              Tìm theo tên
            </label>
            <ThemedInput
              type="text"
              placeholder="Nhập tên khách hàng"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              size="sm"
            />
          </div>
          
          <div>
            <label className="block text-xs mb-1" style={{ color: theme.text.muted }}>
              Tìm theo SĐT
            </label>
            <ThemedInput
              type="text"
              placeholder="Nhập số điện thoại"
              value={filters.phone}
              onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
              size="sm"
            />
          </div>
          
          <div>
            <label className="block text-xs mb-1" style={{ color: theme.text.muted }}>
              Trạng thái
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              style={{
                background: theme.background.secondary,
                color: theme.text.primary,
                borderColor: theme.primary + '40'
              }}
            >
              <option value="all">Tất cả</option>
              <option value="pending">⏳ Đang chờ</option>
              <option value="confirmed">✅ Đã xác nhận</option>
              <option value="completed">🎉 Hoàn thành</option>
              <option value="cancelled">❌ Đã huỷ</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <ThemedButton
              onClick={exportCSV}
              variant="secondary"
              size="sm"
              className="w-full"
            >
              📊 Xuất CSV
            </ThemedButton>
          </div>
        </div>
      </ThemedCard>

      {/* Pagination Info */}
      <ThemedCard className="p-4 mb-6">
        <ThemedText variant="muted" size="sm" className="text-center">
          Hiển thị {displayedBookings.length} booking (trang {currentPage}/{totalPages})
        </ThemedText>
        <ThemedText variant="muted" size="xs" className="text-center mt-1">
          Tổng {filteredBookings.length} booking đã lọc • Ưu tiên booking chưa hoàn thành
        </ThemedText>
      </ThemedCard>

      {/* Bookings List */}
      <div className="space-y-4 mb-6">
        {displayedBookings.map((b, idx) => (
          <ThemedCard key={b.id} className="p-4 space-y-3">
            <div className="flex justify-between items-start gap-3 mb-2">
              <ThemedText variant="primary" className="font-semibold flex-1 min-w-0">
                {b.service} - {generateBookingCode(b.date, idx + (currentPage - 1) * itemsPerPage)}
              </ThemedText>
              <div className="flex-shrink-0">
                {getStatusBadge(b.status)}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <ThemedText variant="muted" size="sm">👤 {b.name} | 📞 {b.phone}</ThemedText>
              <ThemedText variant="muted" size="sm">📅 {b.date} ⏰ {b.time}</ThemedText>
              <ThemedText variant="muted" size="sm">👥 {b.staff || 0} nhân viên | {b.duration || 0} giờ</ThemedText>
              <ThemedText variant="muted" size="sm">💰 {(b.total || 0).toLocaleString()} ₫</ThemedText>
            </div>
            
            <ThemedText variant="muted" size="sm">🏠 {b.address || 'Chưa có địa chỉ'}</ThemedText>
            <ThemedText variant="accent" size="sm" className="font-semibold">
              ⭐ Điểm tích luỹ: {Math.floor(((b.total || 0) * 0.05) / 1000)}
            </ThemedText>
            
            {b.note && <ThemedText variant="muted" size="sm">📝 {b.note}</ThemedText>}

            <div className="flex gap-2 flex-wrap justify-start">
              {b.status === "pending" && (
                <button
                  onClick={() => handleAction(b.id, "confirm")}
                  className="px-3 py-1 text-sm rounded-lg flex-shrink-0 transition-all"
                  style={{
                    background: 'white',
                    border: `1px solid ${theme.primary}`,
                    color: theme.primary
                  }}
                >
                  ✅ Xác nhận
                </button>
              )}
              {(b.status === "pending" || b.status === "confirmed") && (
                <button
                  onClick={() => handleAction(b.id, "complete")}
                  className="px-3 py-1 text-sm rounded-lg flex-shrink-0 transition-all"
                  style={{
                    background: 'white',
                    border: `1px solid ${theme.status.success}`,
                    color: theme.status.success
                  }}
                >
                  🎉 Hoàn thành
                </button>
              )}
              {b.status !== "cancelled" && b.status !== "completed" && (
                <button
                  onClick={() => handleAction(b.id, "cancel")}
                  className="px-3 py-1 text-sm rounded-lg flex-shrink-0 transition-all"
                  style={{
                    background: 'white',
                    border: `1px solid ${theme.status.error}`,
                    color: theme.status.error
                  }}
                >
                  ❌ Huỷ
                </button>
              )}
            </div>
          </ThemedCard>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <ThemedCard className="p-4 mt-6">
          <div className="flex justify-between items-center mb-3">
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

          {/* Page Numbers */}
          <div className="flex justify-center space-x-1">
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

      {/* Floating Dashboard Button */}
      <FloatingDashboardButton />
    </ThemedContainer>
  );
}