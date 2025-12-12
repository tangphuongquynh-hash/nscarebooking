// src/services/zaloAuth.js
import {
  getUserInfo,
  login,
  authorize,
  getAccessToken,
  getSetting
} from 'zmp-sdk';

// Zalo Mini App và OA configuration
export const ZALO_CONFIG = {
  MINI_APP_ID: "3794181198297525649",
  OA_ID: "25541911002217776"
};

// Admin user IDs hoặc phone numbers (có thể lưu trong backend)
const ADMIN_USERS = [
  // Thêm Zalo ID hoặc phone numbers của admin
  "0909123456", // Số điện thoại admin mẫu
  "0888999777", // Thêm số của bạn vào đây
  // TODO: Thêm số điện thoại thực của chủ app
  // Ví dụ: "0901234567", "84901234567", "+84901234567"
];

// Backup admin phones để test - THÊM SỐ ĐIỆN THOẠI THỰC CỦA BẠN VÀO ĐÂY
const ADMIN_PHONES = [
  "0909123456",
  "0888999777",
  // Thêm format khác nhau của số điện thoại để đảm bảo
  // Ví dụ: "0901234567", "84901234567", "+84901234567"
];

/**
 * Lấy thông tin user từ Zalo
 */
export const getZaloUserInfo = async () => {
  try {
    // Request permission nếu chưa có
    await authorize({
      scopes: ["scope.userInfo", "scope.userPhonenumber"]
    });

    // Lấy thông tin user
    const userInfo = await getUserInfo({});
    
    console.log('🧩 Zalo User Info:', userInfo);
    
    // Lưu vào localStorage để sử dụng sau
    if (userInfo) {
      localStorage.setItem('zalo_user_id', userInfo.id || '');
      localStorage.setItem('zalo_name', userInfo.name || '');
      localStorage.setItem('zalo_avatar', userInfo.avatar || '');
    }

    return userInfo;
  } catch (error) {
    console.error('❌ Error getting Zalo user info:', error);
    throw error;
  }
};

/**
 * Lấy số điện thoại user (cần permission)
 */
export const getZaloUserPhone = async () => {
  try {
    // Check quyền trước
    const settings = await getSetting({});
    
    if (!settings['scope.userPhonenumber']) {
      // Yêu cầu quyền
      await openSetting({});
      return null;
    }

    // Lấy access token
    const tokenResponse = await getAccessToken({});
    
    if (tokenResponse.accessToken) {
      // Gọi API Zalo để lấy phone
      const response = await fetch(`https://graph.zalo.me/v2.0/me/info`, {
        headers: {
          'Authorization': `Bearer ${tokenResponse.accessToken}`
        }
      });
      
      const data = await response.json();
      const phone = data.phone;
      
      if (phone) {
        localStorage.setItem('zalo_phone', phone);
      }
      
      return phone;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error getting user phone:', error);
    return null;
  }
};

/**
 * Kiểm tra user có phải admin không
 * Dựa trên Zalo ID, phone, hoặc OA follower status
 */
export const checkAdminRole = async (userInfo) => {
  try {
    console.log('🔍 [ADMIN] Checking admin role for user:', userInfo);
    console.log('🔍 [ADMIN] Available admin lists:', { ADMIN_USERS, ADMIN_PHONES });

    // Method 1: Check user ID
    if (userInfo?.id && ADMIN_USERS.includes(userInfo.id)) {
      console.log('✅ [ADMIN] Admin confirmed by user ID:', userInfo.id);
      return true;
    }

    // Method 2: Check userInfo phone
    if (userInfo?.phone && (ADMIN_USERS.includes(userInfo.phone) || ADMIN_PHONES.includes(userInfo.phone))) {
      console.log('✅ [ADMIN] Admin confirmed by userInfo phone:', userInfo.phone);
      return true;
    }

    // Method 3: Check localStorage phone
    const storedPhone = localStorage.getItem('zalo_phone');
    if (storedPhone && (ADMIN_USERS.includes(storedPhone) || ADMIN_PHONES.includes(storedPhone))) {
      console.log('✅ [ADMIN] Admin confirmed by stored phone:', storedPhone);
      return true;
    }

    // Method 4: Check any phone format variations
    const phoneVariations = [
      userInfo?.phone,
      storedPhone,
      userInfo?.phone?.replace(/^0/, '+84'),
      storedPhone?.replace(/^0/, '+84'),
      userInfo?.phone?.replace(/^\+84/, '0'),
      storedPhone?.replace(/^\+84/, '0')
    ].filter(Boolean);
    
    for (const phone of phoneVariations) {
      if (ADMIN_USERS.includes(phone) || ADMIN_PHONES.includes(phone)) {
        console.log('✅ [ADMIN] Admin confirmed by phone variation:', phone);
        return true;
      }
    }

    // Method 5: Check manual admin override (for testing)
    const manualAdmin = localStorage.getItem('manual_admin_override');
    if (manualAdmin === 'true') {
      console.log('✅ [ADMIN] Manual admin override activated');
      return true;
    }

    // Method 6: Check backend API (recommended)
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://api.nscare.vn/api'}/admin/check-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          zaloId: userInfo.id,
          phone: phone,
          name: userInfo.name
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Admin role from backend:', data.isAdmin);
        return data.isAdmin;
      }
    } catch (backendError) {
      console.log('⚠️ Backend check failed, using fallback');
    }

    // Method 4: Fallback - check OA interaction (nâng cao)
    // Có thể implement sau với OA API

    console.log('❌ Not admin user');
    return false;
  } catch (error) {
    console.error('❌ Error checking admin role:', error);
    return false;
  }
};

/**
 * Initialize Zalo authentication
 */
export const initializeZaloAuth = async () => {
  try {
    console.log('🚀 [ZALO] Initializing Zalo Auth...');
    console.log('🌐 [ZALO] Environment Info:');
    console.log('  - URL:', window.location.href);
    console.log('  - User Agent:', navigator.userAgent);
    console.log('  - Is Zalo App:', navigator.userAgent.includes('ZaloMiniApp'));
    console.log('  - Config:', ZALO_CONFIG);
    
    const userInfo = await getZaloUserInfo();
    console.log('👤 [ZALO] User info retrieved:', userInfo);
    
    if (userInfo) {
      // Thử lấy phone number (optional)
      console.log('📱 [ZALO] Attempting to get phone number...');
      await getZaloUserPhone();
      
      // Check admin role
      console.log('👑 [ZALO] Checking admin role...');
      const isAdmin = await checkAdminRole(userInfo);
      localStorage.setItem('is_admin', isAdmin.toString());
      console.log('✅ [ZALO] Auth initialization complete:', { userInfo, isAdmin });
      
      return {
        userInfo,
        isAdmin
      };
    }
    
    return null;
  } catch (error) {
    console.error('❌ Failed to initialize Zalo auth:', error);
    return null;
  }
};

/**
 * Check if current user is admin (from localStorage)
 */
export const isCurrentUserAdmin = () => {
  return localStorage.getItem('is_admin') === 'true';
};

/**
 * Logout user
 */
export const logoutUser = () => {
  localStorage.removeItem('zalo_user_id');
  localStorage.removeItem('zalo_name');
  localStorage.removeItem('zalo_avatar');
  localStorage.removeItem('zalo_phone');
  localStorage.removeItem('is_admin');
  
  console.log('👋 User logged out');
};