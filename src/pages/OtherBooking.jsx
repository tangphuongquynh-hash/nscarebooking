import React, { useEffect, useState } from "react";

export default function OtherBooking({ user }) {
  const [form, setForm] = useState({
    service: "",
    quantity: 1,
    size: "",
    date: "",
    time: "",
    address: "",
    note: "",
    image: null,
    name: "",
    phone: "",
  });

  const [submittedInfo, setSubmittedInfo] = useState(null);
  const [error, setError] = useState("");

  // 🧩 Load lại dữ liệu cũ hoặc từ Zalo
  useEffect(() => {
    const saved = localStorage.getItem("otherBookingForm");
    if (saved) {
      setForm(JSON.parse(saved));
    } else if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  // 💾 Lưu form mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem("otherBookingForm", JSON.stringify(form));
  }, [form]);

  // ✏️ Handle change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // 🚀 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bodyData = { ...form, serviceType: "Other Booking" };
      const res = await fetch("https://api.nscare.vn/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) throw new Error("Không thể gửi lịch hẹn");
      const data = await res.json();
      console.log("✅ Booking created:", data);

      // 🧾 Hiện popup tóm tắt
      setSubmittedInfo({
        name: form.name,
        phone: form.phone,
        service: form.service,
        date: form.date,
        time: form.time,
        address: form.address,
      });

      // 🧹 Reset nhẹ (để người dùng nhập lại dễ)
      const updated = {
        ...form,
        date: "",
        time: "",
        note: "",
        image: null,
      };
      setForm(updated);
      localStorage.setItem("otherBookingForm", JSON.stringify(updated));
      setError("");
    } catch (err) {
      console.error("❌", err);
      setError("Không thể gửi lịch, vui lòng thử lại!");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#dff4f3] to-[#f5f9f9] p-4 pb-24">
      <h1 className="text-xl font-bold text-teal-700 text-center mb-6">
        Đặt dịch vụ khác | Other Services Booking
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-6 space-y-4"
      >
        {/* 🧍 Name & Phone (tự điền từ Zalo nếu có) */}
        <div>
          <label className="block text-sm font-medium text-teal-700 mb-1">
            Tên khách hàng | Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nguyễn Văn A"
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-teal-700 mb-1">
            Số điện thoại | Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="090xxxxxxx"
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>

        {/* 🧹 Service */}
        <div>
          <label className="block text-sm font-medium text-teal-700 mb-1">
            Chọn dịch vụ | Select Service
          </label>
          <select
            name="service"
            value={form.service}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          >
            <option value="">-- Chọn dịch vụ --</option>
            <option value="industrial">Vệ sinh công nghiệp | Industrial Cleaning</option>
            <option value="curtain">Giặt rèm | Curtain Cleaning</option>
            <option value="mattress">Giặt nệm | Mattress Cleaning</option>
            <option value="carpet">Giặt thảm | Carpet Cleaning</option>
            <option value="sofa">Giặt ghế sofa | Sofa Cleaning</option>
            <option value="washing-machine">Vệ sinh máy giặt | Washing Machine Cleaning</option>
            <option value="aircon">Vệ sinh máy lạnh | Air Conditioner Cleaning</option>
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-teal-700 mb-1">
            Số lượng | Quantity
          </label>
          <input
            type="number"
            name="quantity"
            min="1"
            value={form.quantity}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>

        {/* Size */}
        <div>
          <label className="block text-sm font-medium text-teal-700 mb-1">
            Kích thước (nếu có) | Size
          </label>
          <input
            type="text"
            name="size"
            value={form.size}
            onChange={handleChange}
            placeholder="Ví dụ: 2x3m, 5 chiếc, ..."
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        {/* Upload image */}
        <div>
          <label className="block text-sm font-medium text-teal-700 mb-1">
            Hình ảnh thực tế | Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            name="image"
            onChange={handleChange}
            className="w-full text-sm"
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-teal-700 mb-1">
              Ngày thực hiện | Date
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-teal-700 mb-1">
              Giờ thực hiện | Time
            </label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-teal-700 mb-1">
            Địa chỉ | Address
          </label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Số nhà, đường, quận, TP..."
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-teal-700 mb-1">
            Ghi chú | Note
          </label>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Yêu cầu thêm..."
            className="w-full border border-gray-300 rounded-lg p-2 h-20 resize-none"
          />
        </div>

        <div className="bg-teal-50 p-3 rounded-lg border border-teal-200">
          <p className="text-sm text-gray-600">
            💡 Giá dịch vụ sẽ được báo sau khi nhân viên tư vấn.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Ảnh giúp nhân viên đánh giá nhanh hơn.
          </p>
        </div>

        {error && <div className="text-sm text-red-500">{error}</div>}

        <button
          type="submit"
          className="w-full py-2 rounded-lg font-semibold text-white shadow-md bg-gradient-to-r from-teal-400 to-teal-500 hover:opacity-95"
        >
          Xác nhận đặt dịch vụ
        </button>
      </form>

      {/* 🎉 POP-UP tóm tắt */}
      {submittedInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-green-100 to-teal-50 rounded-2xl shadow-xl p-6 w-80 animate-fadeIn">
            <h3 className="font-bold text-lg text-teal-700 mb-3 text-center">
              🎉 Đặt lịch thành công!
            </h3>
            <div className="text-gray-700 text-sm space-y-1">
              <p><b>{submittedInfo.name}</b> ({submittedInfo.phone})</p>
              <p>📦 {submittedInfo.service}</p>
              <p>📅 {submittedInfo.date} — ⏰ {submittedInfo.time}</p>
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