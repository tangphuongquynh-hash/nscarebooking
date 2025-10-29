# 🔐 Hệ Thống Xác Thực Zalo Mini App

## 📋 Tổng Quan
Hệ thống xác thực Zalo Mini App đã được tích hợp hoàn toàn với:
- **Mini App ID**: `3794181198297525649`
- **Official Account ID**: `25541911002217776`
- Kiểm tra quyền admin tự động
- Bảo vệ routes admin
- UI thân thiện với Zalo design

## 🏗️ Kiến Trúc Hệ Thống

### 1. **AuthContext** (`src/contexts/AuthContext.jsx`)
- Quản lý trạng thái authentication toàn app
- Auto-initialize khi app khởi động
- Cung cấp: `user`, `isAdmin`, `isLoading`, `login`, `logout`

### 2. **Zalo Auth Service** (`src/services/zaloAuth.js`)
- Tích hợp Zalo Mini App SDK
- Lấy thông tin user từ Zalo
- Kiểm tra quyền admin qua 3 phương pháp:
  - Danh sách hardcode
  - API backend `/api/admin/check`
  - Kiểm tra số điện thoại

### 3. **Protected Route** (`src/components/ProtectedRoute.jsx`)
- Bảo vệ routes yêu cầu quyền admin
- UI beautiful khi không có quyền
- Tự động redirect hoặc hiển thị login

## 🚀 Cách Sử Dụng

### Trong Components
```jsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAdmin, login, logout, isLoading } = useAuth();
  
  if (isLoading) return <Loading />;
  if (!user) return <LoginButton onClick={login} />;
  if (isAdmin) return <AdminPanel />;
  
  return <UserPanel user={user} />;
}
```

### Bảo Vệ Routes
```jsx
// Chỉ admin mới truy cập được
<Route path="/admin" element={
  <ProtectedRoute requireAdmin>
    <AdminDashboard />
  </ProtectedRoute>
} />

// User đã login mới truy cập được  
<Route path="/profile" element={
  <ProtectedRoute>
    <UserProfile />
  </ProtectedRoute>
} />
```

## 🔧 Cấu Hình Admin

### Phương Pháp 1: Hardcode (Hiện Tại)
```javascript
// src/services/zaloAuth.js
const ADMIN_PHONES = [
  "0909123456",
  "0888999777"  // Thêm SĐT admin vào đây
];
```

### Phương Pháp 2: Backend API
- Endpoint: `POST /api/admin/check`
- Body: `{ phone: "0909123456" }`
- Response: `{ isAdmin: true }`

### Phương Pháp 3: Database Integration
```javascript
// Backend có thể check từ database
const adminUsers = await User.find({ role: 'admin' });
```

## 🎯 Tính Năng Chính

### ✅ Đã Hoàn Thành
- [x] Zalo Mini App SDK integration
- [x] Auto-login khi mở app
- [x] Lấy user info (name, phone, avatar)
- [x] Kiểm tra quyền admin
- [x] Bảo vệ admin routes
- [x] Beautiful UI cho auth states
- [x] Logout functionality

### 🔄 Đang Phát Triển
- [ ] Remember login state
- [ ] User profile management
- [ ] Role-based permissions (staff, manager, admin)
- [ ] Session timeout handling

## 🧪 Testing

### Trong Zalo Environment
1. Mở app trong Zalo
2. Check console logs cho auth flow
3. Try truy cập `/admin` routes
4. Verify admin permissions

### Development Mode
```bash
# Run local server
npm run dev

# Open http://localhost:5173
# Auth sẽ fallback mode (mock data)
```

## 📱 Admin Features

### Admin Dashboard
- Hiển thị thông tin admin hiện tại
- Nút logout
- Statistics và reports
- Quick actions

### Protected Pages
- `/admin` - Main dashboard
- `/admin/approval` - Duyệt bookings  
- `/admin/usedpoint` - Quản lý điểm
- `/admin/ui-settings` - Cài đặt giao diện

## 🐛 Troubleshooting

### Lỗi Thường Gặp

1. **"Cannot get user info"**
   - Check Zalo Mini App permissions
   - Verify App ID trong zmp-cli.json
   - Restart Zalo app

2. **"Access denied - Not admin"**
   - Thêm số điện thoại vào ADMIN_PHONES
   - Check backend API response
   - Verify user phone number

3. **"Loading forever"**
   - Check network connection
   - Verify API endpoints
   - Check console errors

### Debug Commands
```bash
# Check auth state
console.log(localStorage.getItem('zalo_auth_user'));

# Force re-auth
localStorage.clear();
window.location.reload();

# Check admin status
fetch('/api/admin/check', { 
  method: 'POST',
  body: JSON.stringify({phone: 'YOUR_PHONE'}),
  headers: {'Content-Type': 'application/json'}
});
```

## 🔮 Future Enhancements

### Short Term
- User preferences storage
- Better error handling
- Loading states optimization

### Long Term  
- Multi-role permissions
- Advanced user management
- Integration với Zalo OA messaging
- Push notifications
- Analytics dashboard

---

**🎉 Authentication system đã sẵn sàng để production!**

For support: Contact NS Care technical team