// Zalo Mini App Troubleshooting Guide
// Cách khắc phục lỗi "không khởi tạo được app" khi scan QR

## 🔍 KIỂM TRA NGUYÊN NHÂN:

### 1. App ID và URL:
- App ID hiện tại: 3794181198297525649
- URL hiện tại: https://nscarebooking.vercel.app  
- Zalo URL: https://zalo.me/s/3794181198297525649/

### 2. Domain Whitelist:
Cần whitelist domain trong Zalo Developer Console:
- https://nscarebooking.vercel.app
- https://booking.nscare.vn (nếu có)

### 3. Manifest cấu hình:
- Permissions: user:profile, user:phone ✅
- App name: NS Care Booking ✅
- Icon: public/icon.png ✅

## 🛠️ CÁC BƯỚC SỬA LỖI:

### Bước 1: Kiểm tra Zalo Developer Console
1. Truy cập: https://developers.zalo.me/apps
2. Tìm app ID: 3794181198297525649
3. Kiểm tra:
   - Domain whitelist có chứa: nscarebooking.vercel.app
   - App status: Published/Active
   - Permissions được approve

### Bước 2: Kiểm tra URL format
Thử các URL này:
- https://zalo.me/s/3794181198297525649
- https://zalo.me/s/3794181198297525649/
- zalo://miniapp/3794181198297525649

### Bước 3: Test trên web trước
1. Mở https://nscarebooking.vercel.app trên browser
2. Kiểm tra app load được không
3. Kiểm tra console có lỗi không

### Bước 4: Kiểm tra device
1. Update Zalo app lên version mới nhất
2. Clear cache Zalo app
3. Thử scan QR bằng device khác

## 🔧 EMERGENCY FIXES:

### Fix 1: Update app-config.json với URLs
### Fix 2: Thêm error handling cho Zalo SDK
### Fix 3: Tạo fallback cho non-Zalo environments

## 📞 LIÊN HỆ HỖ TRỢ:
Nếu vẫn lỗi, cần liên hệ Zalo Developer Support với:
- App ID: 3794181198297525649
- Error message chi tiết
- Screenshots lỗi
- Device info (iOS/Android version)