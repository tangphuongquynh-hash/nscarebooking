// src/utils/zaloAPI.js
// Utility functions for API calls in Zalo Mini App environment

// Zalo Mini App có một số đặc điểm riêng về network:
// 1. Request có thể bị chặn bởi Zalo security policy
// 2. Cần handle network timeout
// 3. CORS policy khác với web browser
// 4. Local storage behavior khác

export class ZaloAPIError extends Error {
  constructor(message, code, details) {
    super(message);
    this.name = 'ZaloAPIError';
    this.code = code;
    this.details = details;
  }
}

// Enhanced fetch with Zalo Mini App specific handling
export const zaloFetch = async (url, options = {}) => {
  const defaultOptions = {
    timeout: 10000, // 10 seconds default timeout
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'ZaloMiniApp/1.0',
      ...options.headers
    },
    ...options
  };

  console.log(`🌐 [ZaloAPI] ${options.method || 'GET'} ${url}`);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), defaultOptions.timeout);

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log(`📡 [ZaloAPI] Response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      throw new ZaloAPIError(
        `HTTP Error: ${response.status}`,
        'HTTP_ERROR',
        { status: response.status, statusText: response.statusText }
      );
    }

    const data = await response.json();
    console.log(`✅ [ZaloAPI] Success:`, data);
    return data;

  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.error('⏱️ [ZaloAPI] Request timeout');
      throw new ZaloAPIError('Request timeout', 'TIMEOUT', { timeout: defaultOptions.timeout });
    }
    
    if (!navigator.onLine) {
      console.error('📴 [ZaloAPI] No internet connection');
      throw new ZaloAPIError('No internet connection', 'OFFLINE');
    }

    console.error('❌ [ZaloAPI] Request failed:', error);
    throw error;
  }
};

// Check if running in Zalo Mini App
export const isZaloMiniApp = () => {
  return !!(window.ZaloMiniApp || window.ZaloJavaScriptInterface);
};

// Get Zalo environment info
export const getZaloEnvironment = () => {
  return {
    isZaloMiniApp: isZaloMiniApp(),
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    online: navigator.onLine,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    zaloMiniApp: !!window.ZaloMiniApp,
    zaloInterface: !!window.ZaloJavaScriptInterface
  };
};

// Safe local storage for Zalo Mini App
export const zaloStorage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`⚠️ [ZaloStorage] Failed to get ${key}:`, error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`⚠️ [ZaloStorage] Failed to set ${key}:`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`⚠️ [ZaloStorage] Failed to remove ${key}:`, error);
      return false;
    }
  }
};

// Network quality check
export const checkNetworkQuality = async () => {
  const start = Date.now();
  
  try {
    // Test với API nhẹ
    const response = await zaloFetch('https://httpbin.org/json', {
      method: 'GET',
      timeout: 5000
    });
    
    const end = Date.now();
    const latency = end - start;
    
    let quality = 'good';
    if (latency > 2000) quality = 'poor';
    else if (latency > 1000) quality = 'fair';
    
    return {
      success: true,
      latency,
      quality,
      online: navigator.onLine
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message,
      online: navigator.onLine
    };
  }
};

// Debug info for API testing
export const getAPIDebugInfo = () => {
  return {
    timestamp: new Date().toISOString(),
    environment: getZaloEnvironment(),
    localStorage: {
      available: !!window.localStorage,
      quotaExceeded: false // Will be set if we hit quota
    },
    network: {
      online: navigator.onLine,
      connection: navigator.connection || null
    }
  };
};

export default {
  zaloFetch,
  ZaloAPIError,
  isZaloMiniApp,
  getZaloEnvironment,
  zaloStorage,
  checkNetworkQuality,
  getAPIDebugInfo
};