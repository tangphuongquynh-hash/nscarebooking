# 📱 ZNS Message Templates

## 📋 Template 1: Booking Confirmation (Xác nhận đặt lịch)

**Template ID:** 331977
**Tên:** NS Care - Xác nhận đặt lịch

### Nội dung:
```
Xin chào {{customer_name}},

Lịch đặt dịch vụ của bạn đã được XÁC NHẬN:

🧹 Dịch vụ: {{service_name}}
📅 Ngày: {{booking_date}}
⏰ Giờ: {{booking_time}}
🏠 Địa chỉ: {{address}}
💰 Tổng tiền: {{total_amount}}
🎫 Mã đặt lịch: {{booking_code}}

Nhân viên sẽ liên hệ bạn trước 30 phút.

Hotline hỗ trợ: {{hotline}}

Cảm ơn bạn đã tin tưởng NS Care! 💚
```

### Template Data:
- `customer_name`: Tên khách hàng
- `service_name`: Tên dịch vụ
- `booking_date`: Ngày đặt lịch  
- `booking_time`: Giờ đặt lịch
- `address`: Địa chỉ thực hiện
- `total_amount`: Tổng tiền (đã format)
- `booking_code`: Mã đặt lịch
- `hotline`: Số hotline

---

## 🎉 Template 2: Service Completion (Hoàn thành dịch vụ)

**Template ID:** 331978
**Tên:** NS Care - Hoàn thành dịch vụ

### Nội dung:
```
Xin chào {{customer_name}},

Dịch vụ {{service_name}} đã HOÀN THÀNH vào {{completion_date}}.

🎉 Cảm ơn bạn đã sử dụng dịch vụ!
⭐ Điểm tích lũy: +{{points_earned}} điểm
💰 Tổng thanh toán: {{total_amount}}
🎫 Mã booking: {{booking_code}}

👉 Đánh giá dịch vụ tại: {{feedback_url}}

Hẹn gặp lại bạn trong lần đặt lịch tiếp theo! 💚

NS Care - Dọn dẹp chuyên nghiệp
```

### Template Data:
- `customer_name`: Tên khách hàng
- `service_name`: Tên dịch vụ
- `completion_date`: Ngày hoàn thành
- `points_earned`: Điểm tích lũy
- `total_amount`: Tổng tiền thanh toán
- `booking_code`: Mã booking
- `feedback_url`: Link đánh giá

---

## ❌ Template 3: Booking Cancellation (Hủy đặt lịch)

**Template ID:** 331979  
**Tên:** NS Care - Thông báo hủy lịch

### Nội dung:
```
Xin chào {{customer_name}},

Lịch đặt dịch vụ của bạn đã bị HỦY:

🧹 Dịch vụ: {{service_name}}
📅 Ngày: {{booking_date}} - {{booking_time}}
❌ Lý do: {{cancellation_reason}}
🎫 Mã booking: {{booking_code}}

Bạn có thể đặt lại lịch mới tại: {{rebooking_url}}

Mọi thắc mắc vui lòng liên hệ: {{hotline}}

Xin lỗi vì sự bất tiện này! 🙏

NS Care
```

### Template Data:
- `customer_name`: Tên khách hàng
- `service_name`: Tên dịch vụ  
- `booking_date`: Ngày đặt lịch
- `booking_time`: Giờ đặt lịch
- `cancellation_reason`: Lý do hủy
- `booking_code`: Mã booking
- `rebooking_url`: Link đặt lại
- `hotline`: Số hotline

---

## ⏰ Template 4: Booking Reminder (Nhắc nhở)

**Template ID:** 331980
**Tên:** NS Care - Nhắc nhở lịch hẹn

### Nội dung:
```
Xin chào {{customer_name}},

Nhắc nhở lịch hẹn NGÀY MAI:

🧹 Dịch vụ: {{service_name}}
📅 Ngày: {{booking_date}}
⏰ Giờ: {{booking_time}}
🏠 Địa chỉ: {{address}}
🎫 Mã lịch hẹn: {{booking_code}}

📝 Chuẩn bị:
{{preparation_note}}

Nhân viên sẽ liên hệ trước 30 phút.

Hotline: {{hotline}}

Cảm ơn bạn! 💚
```

### Template Data:
- `customer_name`: Tên khách hàng
- `service_name`: Tên dịch vụ
- `booking_date`: Ngày thực hiện  
- `booking_time`: Giờ thực hiện
- `address`: Địa chỉ
- `booking_code`: Mã lịch hẹn
- `preparation_note`: Ghi chú chuẩn bị
- `hotline`: Số hotline

---

## 🛠️ Hướng Dẫn Setup Templates

### Bước 1: Đăng ký Zalo Business
1. Truy cập https://business.zalo.me/
2. Đăng ký tài khoản business
3. Tạo Official Account (OA)

### Bước 2: Tạo ZNS App  
1. Vào ZNS Console
2. Tạo app mới với thông tin:
   - App Name: NS Care Booking
   - App ID: 3794181198297525649
   - Callback URL: https://booking.nscare.vn/zns-callback

### Bước 3: Tạo Message Templates
1. Copy nội dung templates ở trên
2. Submit từng template để duyệt
3. Lấy Template IDs sau khi được approve

### Bước 4: Lấy Credentials
1. Access Token từ ZNS Console  
2. Secret Key từ app settings
3. Cập nhật vào .env.local

### Bước 5: Test
1. Sử dụng ZNS Test Panel trong admin dashboard
2. Kiểm tra logs trong console
3. Verify messages được gửi thành công

---

## 📊 Tracking & Analytics

### ZNS Delivery Status
- `sent`: Tin nhắn đã gửi
- `delivered`: Đã nhận được
- `read`: Đã đọc
- `failed`: Gửi thất bại

### Error Codes
- `1001`: Invalid phone number
- `1002`: Template not found
- `1003`: Invalid template data
- `1004`: Rate limit exceeded
- `1005`: Insufficient balance

### Best Practices
1. **Phone Format:** Luôn format số điện thoại thành 84xxxxxxxxx
2. **Template Data:** Validate tất cả template variables
3. **Error Handling:** Log và retry failed messages  
4. **Rate Limiting:** Không gửi quá 100 tin/phút
5. **Content:** Tuân thủ quy định content của Zalo

---

**📱 ZNS Templates đã sẵn sàng cho production!**