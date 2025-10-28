import React, { useEffect, useState } from "react";

const PRICE_PER_HOUR = 100000;
const MIN_DURATION = 2;

function fmtVND(n) {
  return n.toLocaleString("vi-VN") + " ₫";
}

export default function HourlyBooking() {
  const [form, setForm] = useState({
    date: "",
    hour: "06",
    minute: "00",
    duration: MIN_DURATION,
    staff: 1,
    name: "",
    phone: "",
    address: "",
    note: "",
  });

  const [error, setError] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [submittedInfo, setSubmittedInfo] = useState(null);

  // 🧩 Tự động điền thông tin từ Zalo (nếu đã đăng nhập trong mini app)
  useEffect(() => {
    const zaloName = localStorage.getItem("zalo_name");
    const zaloPhone = localStorage.getItem("zalo_phone");
    const zaloUid = localStorage.getItem("zalo_uid");

    if (zaloName || zaloPhone) {
      setForm((prev) => ({
        ...prev,
        name: zaloName || prev.name,
        phone: zaloPhone || prev.phone,
        zaloId: zaloUid || "",
      }));
    }
  }, []);
  // 💾 Lưu form mỗi khi thay đổi (chỉ khi người dùng nhập)
  useEffect(() => {
    if (form.name || form.phone || form.address) {
      localStorage.setItem("hourlyBookingForm", JSON.stringify(form));
    }
  }, [form]);

  // ✅ Bật nút submit khi đủ dữ liệu
  useEffect(() => {
    const can =
      form.date &&
      form.name.trim() &&
      form.phone.trim() &&
      form.address.trim().length >= 5;
    setCanSubmit(can);
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const startTime = `${form.hour}:${form.minute}`;
    const dataToSend = {
      ...form,
      startTime: `${form.hour}:${form.minute}`,
      zaloId: form.zaloId || localStorage.getItem("zalo_uid") || "",
    };

    try {
      const res = await fetch("https://api.nscare.vn/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) throw new Error("Không thể gửi lịch hẹn");
      const data = await res.json();
      console.log("✅ Booking created:", data);

      // 🎉 Hiện popup
      setSubmittedInfo({
        date: form.date,
        time: startTime,
        staff: form.staff,
        duration: form.duration,
        name: form.name,
        phone: form.phone,
        address: form.address,
      });

      // ⚙️ Reset chỉ trường date và note
      const updatedForm = { ...form, date: "", note: "" };
      setForm(updatedForm);
      localStorage.setItem("hourlyBookingForm", JSON.stringify(updatedForm));

      setError("");
    } catch (err) {
      console.error("❌ Lỗi:", err);
      setError("Không thể gửi lịch hẹn. Vui lòng thử lại!");
    }
  };

  const price = form.duration * form.staff * PRICE_PER_HOUR;
  const points = Math.floor(price * 0.05 / 1000);
  const hours = Array.from({ length: 12 }, (_, i) => String(i + 6).padStart(2, "0"));
  const minutes = ["00", "15", "30", "45"];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#dff4f3] to-[#f5f9f9] p-4 pb-24">
      <h1 className="text-xl font-bold text-teal-700 text-center mb-6">
        Đặt lịch theo giờ | Hourly Booking
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-4">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-teal-700 mb-1">Ngày | Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            min={new Date().toISOString().split("T")[0]}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>

        {/* Time */}
        <div>
          <label className="block text-sm font-medium text-teal-700 mb-1">
            Giờ bắt đầu | Start Time
          </label>
          <div className="flex gap-2">
            <select
              name="hour"
              value={form.hour}
              onChange={(e) => setForm({ ...form, hour: e.target.value })}
              className="flex-1 border border-gray-300 rounded-lg p-2"
            >
              {hours.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
            <span className="flex items-center text-gray-600">:</span>
            <select
              name="minute"
              value={form.minute}
              onChange={(e) => setForm({ ...form, minute: e.target.value })}
              className="flex-1 border border-gray-300 rounded-lg p-2"
            >
              {minutes.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-teal-700 mb-1">Thời lượng | Duration</label>
          <select
            name="duration"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            {[2, 3, 4].map((h) => (
              <option key={h} value={h}>{h} giờ | {h} hours</option>
            ))}
          </select>
        </div>

        {/* Staff */}
        <div>
          <label className="block text-sm font-medium text-teal-700 mb-1">Số nhân viên | Staff</label>
          <select
            name="staff"
            value={form.staff}
            onChange={(e) => setForm({ ...form, staff: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            {[1, 2, 3, 4].map((s) => (
              <option key={s} value={s}>{s} nhân viên | {s} staff</option>
            ))}
          </select>
        </div>

        {/* Name, Phone, Address, Note */}
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Tên khách hàng"
          className="w-full border border-gray-300 rounded-lg p-2"
          required
        />
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Số điện thoại"
          className="w-full border border-gray-300 rounded-lg p-2"
          required
        />
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="Địa chỉ"
          className="w-full border border-gray-300 rounded-lg p-2"
          required
        />
        <textarea
          name="note"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          placeholder="Ghi chú thêm..."
          className="w-full border border-gray-300 rounded-lg p-2 h-20 resize-none"
        />

        {/* Tổng tiền */}
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
          <div>
            <div className="text-xs text-gray-500">Tổng tiền | Total</div>
            <div className="text-lg font-bold text-teal-700">{fmtVND(price)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Điểm tích luỹ | Points</div>
            <div className="text-lg font-bold text-teal-700">{points} điểm</div>
          </div>
        </div>

        {error && <div className="text-sm text-red-500">{error}</div>}

        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full py-2 rounded-lg font-semibold text-white shadow-md transition ${
            canSubmit
              ? "bg-gradient-to-r from-teal-400 to-teal-500 hover:opacity-95"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Xác nhận đặt lịch
        </button>
      </form>

      {/* 🎉 POP-UP Modal */}
      {submittedInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-green-100 to-teal-50 rounded-2xl shadow-xl p-6 w-80 animate-fadeIn">
            <h3 className="font-bold text-lg text-teal-700 mb-3 text-center">🎉 Đặt lịch thành công!</h3>
            <div className="text-gray-700 text-sm space-y-1">
              <p><b>{submittedInfo.name}</b> ({submittedInfo.phone})</p>
              <p>📅 {submittedInfo.date} — ⏰ {submittedInfo.time}</p>
              <p>👥 {submittedInfo.staff} nhân viên, {submittedInfo.duration} giờ</p>
              <p>🏠 {submittedInfo.address}</p>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              Admin sẽ sớm liên hệ để xác nhận 💬
            </p>
            <button
              onClick={() => setSubmittedInfo(null)}
              className="mt-4 w-full bg-gradient-to-r from-teal-400 to-teal-500 text-white font-semibold py-2 rounded-lg shadow hover:opacity-90"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}