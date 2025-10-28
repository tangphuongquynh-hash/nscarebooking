// src/pages/Admin/UsedPoint.jsx
import React, { useState, useEffect, useMemo } from "react";
import { getThemeGradient, getThemeClasses } from "../../utils/theme";

const mockCustomers = [
  { phone: "0901234567", name: "Vicky", points: 120 },
  { phone: "0907654321", name: "An", points: 80 },
  { phone: "0912345678", name: "Minh", points: 200 },
];

// Generate sample points history for testing (6 months)
const generatePointsHistory = () => {
  const customers = ["Vicky", "An", "Minh", "Hương", "Nam", "Linh", "Tuấn", "Mai"];
  const phones = ["0901234567", "0907654321", "0912345678", "0923456789", "0934567890", "0945678901", "0956789012", "0967890123"];
  const actions = ["+", "-"];
  const reasons = ["Thưởng đặt lịch", "Sử dụng điểm", "Khuyến mãi", "Hoàn điểm", "Điều chỉnh", "Bonus point"];
  
  const history = [];
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
  
  for (let i = 0; i < 85; i++) {
    const randomDate = new Date(sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime()));
    const customerIndex = Math.floor(Math.random() * customers.length);
    const action = actions[Math.floor(Math.random() * actions.length)];
    const change = Math.floor(Math.random() * 50) + 5;
    const newTotal = Math.floor(Math.random() * 300) + 20;
    
    history.push({
      id: `history_${i}_${Date.now()}`,
      phone: phones[customerIndex],
      name: customers[customerIndex],
      change: `${action}${change}`,
      newTotal: newTotal,
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      time: randomDate.toLocaleString("vi-VN", {
        year: 'numeric',
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      timestamp: randomDate.getTime()
    });
  }
  
  return history.sort((a, b) => b.timestamp - a.timestamp);
};

export default function UsedPoint() {
  const [phone, setPhone] = useState("");
  const [customer, setCustomer] = useState(null);
  const [amount, setAmount] = useState("");
  const [action, setAction] = useState("add");
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showReminder, setShowReminder] = useState(false);
  const [themeClasses, setThemeClasses] = useState(getThemeClasses());
  
  // Filter states
  const [filterName, setFilterName] = useState("");
  const [filterPhone, setFilterPhone] = useState("");
  
  const itemsPerPage = 20;

  // ✅ Hiển thị sẵn khách đầu tiên và load lịch sử
  useEffect(() => {
    setCustomer(mockCustomers[0]);
    setPhone(mockCustomers[0].phone);
    setThemeClasses(getThemeClasses());
    
    // Load hoặc generate history data
    const savedHistory = localStorage.getItem('pointsHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    } else {
      const generatedHistory = generatePointsHistory();
      setHistory(generatedHistory);
      localStorage.setItem('pointsHistory', JSON.stringify(generatedHistory));
    }
    
    // Check if reminder should be shown (every 5 months)
    const lastReminder = localStorage.getItem('lastPointsReminder');
    const now = Date.now();
    if (!lastReminder || (now - parseInt(lastReminder)) > (5 * 30 * 24 * 60 * 60 * 1000)) {
      setShowReminder(true);
    }
  }, []);
  
  // Filter history to show only last 6 months and apply name/phone filters
  const filteredHistory = useMemo(() => {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    return history.filter(record => {
      const recordDate = new Date(record.timestamp);
      const isWithin6Months = recordDate >= sixMonthsAgo;
      
      // Apply name filter
      const nameMatches = !filterName || record.name.toLowerCase().includes(filterName.toLowerCase());
      
      // Apply phone filter
      const phoneMatches = !filterPhone || record.phone.includes(filterPhone);
      
      return isWithin6Months && nameMatches && phoneMatches;
    });
  }, [history, filterName, filterPhone]);
  
  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterName, filterPhone]);
  
  // Pagination logic
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredHistory.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredHistory, currentPage, itemsPerPage]);

  const handleSearch = () => {
    const found = mockCustomers.find((c) => c.phone === phone);
    setCustomer(found || null);
  };
  
  // Export history to CSV (exports filtered data)
  const handleExportHistory = () => {
    if (filteredHistory.length === 0) {
      alert("Không có dữ liệu để xuất | No data to export");
      return;
    }
    
    // Create filename with filter info
    let fileName = `lich-su-diem_${new Date().toISOString().split('T')[0]}`;
    if (filterName || filterPhone) {
      fileName += '_filtered';
      if (filterName) fileName += `_name-${filterName}`;
      if (filterPhone) fileName += `_phone-${filterPhone}`;
    }
    fileName += '.csv';
    
    const csvHeader = ["Thời gian", "SĐT", "Tên KH", "Thay đổi", "Tổng điểm", "Lý do"];
    const csvData = [
      csvHeader,
      ...filteredHistory.map(record => [
        record.time,
        record.phone,
        record.name,
        record.change,
        record.newTotal,
        record.reason || "N/A"
      ])
    ];
    
    const csv = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Update last export time
    localStorage.setItem('lastPointsExport', Date.now().toString());
    const message = (filterName || filterPhone) 
      ? `📄 Đã xuất ${filteredHistory.length} bản ghi đã lọc thành công!`
      : `📄 Đã xuất ${filteredHistory.length} bản ghi thành công!`;
    alert(message);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilterName("");
    setFilterPhone("");
    setCurrentPage(1);
  };
  
  // Dismiss reminder
  const dismissReminder = () => {
    setShowReminder(false);
    localStorage.setItem('lastPointsReminder', Date.now().toString());
  };
  
  // Clean old data (older than 6 months)
  const cleanOldData = () => {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    const cleanedHistory = history.filter(record => {
      const recordDate = new Date(record.timestamp);
      return recordDate >= sixMonthsAgo;
    });
    
    setHistory(cleanedHistory);
    localStorage.setItem('pointsHistory', JSON.stringify(cleanedHistory));
    alert(`🗑️ Đã xóa ${history.length - cleanedHistory.length} bản ghi cũ hơn 6 tháng`);
  };

  const handleSubmit = () => {
    if (!customer) {
      alert("Không tìm thấy khách hàng | Customer not found");
      return;
    }
    const num = Number(amount);
    if (!num || num <= 0) {
      alert("Nhập số điểm hợp lệ | Enter valid points");
      return;
    }

    let newPoints =
      action === "add" ? customer.points + num : customer.points - num;
    if (newPoints < 0) newPoints = 0;

    const record = {
      id: Date.now(),
      phone: customer.phone,
      name: customer.name,
      change: (action === "add" ? "+" : "-") + num,
      newTotal: newPoints,
      reason: action === "add" ? "Điều chỉnh thêm điểm" : "Điều chỉnh trừ điểm",
      time: new Date().toLocaleString("vi-VN", {
        year: 'numeric',
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      timestamp: Date.now()
    };

    const updatedHistory = [record, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('pointsHistory', JSON.stringify(updatedHistory));
    
    alert(
      `📩 Gửi ZNS: Cập nhật điểm cho ${customer.name}\n` +
        `SĐT: ${customer.phone}\n` +
        `Điểm ${action === "add" ? "cộng" : "trừ"}: ${num}\n` +
        `Tổng mới: ${newPoints}`
    );

    setCustomer({ ...customer, points: newPoints });
    setAmount("");
    setCurrentPage(1); // Reset to first page to show new record
  };

  return (
    <div 
      className="min-h-screen p-4 pb-24"
      style={{ background: getThemeGradient() }}
    >
      <h1 className={`text-xl font-bold ${themeClasses.textPrimary} text-center mb-6`}>
        Quản lý điểm | Manage Points
      </h1>

      {/* ⚠️ Reminder Modal */}
      {showReminder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-auto shadow-2xl">
            <h3 className="text-lg font-bold text-orange-600 mb-3">⚠️ Nhắc nhở quan trọng</h3>
            <p className="text-sm text-gray-700 mb-4">
              Hệ thống tự động xóa dữ liệu điểm cũ hơn 6 tháng. 
              <strong> Hãy tải xuống báo cáo để lưu trữ!</strong>
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleExportHistory}
                className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-green-600"
              >
                📄 Tải ngay
              </button>
              <button
                onClick={dismissReminder}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-400"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-4 space-y-2">
        <label className="block text-sm font-medium text-teal-700 mb-1">
          Nhập số điện thoại | Phone number
        </label>
        <div className="flex gap-2">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="090xxxxxxx"
            className="flex-1 border border-gray-300 rounded-lg p-2"
          />
          <button
            onClick={handleSearch}
            className={`${themeClasses.bgPrimary} text-white px-4 rounded-lg hover:opacity-90`}
          >
            Tìm
          </button>
        </div>

        {customer ? (
          <div className={`mt-2 text-sm ${themeClasses.textPrimary}`}>
            👤 {customer.name} | ⭐ {customer.points} điểm
          </div>
        ) : (
          phone && (
            <div className="mt-2 text-sm text-red-500">
              Không tìm thấy khách hàng | Customer not found
            </div>
          )
        )}
      </div>

      {/* Update points */}
      {customer && (
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 space-y-3">
          <label className="block text-sm font-medium text-teal-700 mb-1">
            Cộng / Trừ điểm | Add / Deduct points
          </label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option value="add">Cộng điểm | Add points</option>
            <option value="subtract">Trừ điểm | Deduct points</option>
          </select>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Nhập số điểm | Enter points"
            className="w-full border border-gray-300 rounded-lg p-2"
          />

          <button
            onClick={handleSubmit}
            className={`w-full py-2 bg-gradient-to-r ${themeClasses.gradientPrimary} text-white font-semibold rounded-lg hover:opacity-90`}
          >
            Cập nhật điểm | Update Points
          </button>
        </div>
      )}

      {/* History with Pagination */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-teal-700">
            Lịch sử điểm ({filteredHistory.length} bản ghi - 6 tháng gần nhất)
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleExportHistory}
              className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-600"
            >
              📄 Xuất CSV
            </button>
            <button
              onClick={cleanOldData}
              className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600"
            >
              🗑️ Xóa cũ
            </button>
          </div>
        </div>
        
        {/* Filter Controls */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-700">🔍 Lọc:</span>
            <input
              type="text"
              placeholder="Tên khách hàng..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="flex-1 min-w-32 border border-gray-300 rounded-lg px-2 py-1 text-sm"
            />
            <input
              type="text"
              placeholder="Số điện thoại..."
              value={filterPhone}
              onChange={(e) => setFilterPhone(e.target.value)}
              className="flex-1 min-w-32 border border-gray-300 rounded-lg px-2 py-1 text-sm"
            />
            <button
              onClick={clearFilters}
              className="bg-gray-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-gray-600"
            >
              ✕ Xóa bộ lọc
            </button>
          </div>
          {(filterName || filterPhone) && (
            <div className="text-xs text-gray-600">
              Đang lọc: 
              {filterName && <span className="ml-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Tên: {filterName}</span>}
              {filterPhone && <span className="ml-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded">SĐT: {filterPhone}</span>}
            </div>
          )}
        </div>
        
        {paginatedHistory.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có dữ liệu | No records yet</p>
        ) : (
          <>
            <ul className="space-y-2 text-sm">
              {paginatedHistory.map((h) => (
                <li
                  key={h.id}
                  className="border-b border-gray-100 pb-2 flex justify-between text-gray-700"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">📞 {h.phone} - {h.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          h.change.startsWith("+") 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {h.change} → ⭐ {h.newTotal}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {h.time} • {h.reason}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-teal-500 text-white rounded-lg disabled:bg-gray-300 disabled:text-gray-500 text-sm"
                >
                  ← Trước
                </button>
                
                <div className="flex items-center gap-1">
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
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 text-xs rounded-lg font-medium ${
                          currentPage === pageNum
                            ? 'bg-teal-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="text-gray-400 px-1">...</span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-8 h-8 text-xs rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-teal-500 text-white rounded-lg disabled:bg-gray-300 disabled:text-gray-500 text-sm"
                >
                  Sau →
                </button>
              </div>
            )}
            
            <p className="text-xs text-gray-500 text-center mt-2">
              Trang {currentPage} / {totalPages} • Hiển thị {paginatedHistory.length} / {filteredHistory.length} bản ghi
            </p>
          </>
        )}
      </div>
    </div>
  );
}