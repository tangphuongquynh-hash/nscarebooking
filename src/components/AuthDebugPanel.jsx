// src/components/AuthDebugPanel.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ThemedCard, ThemedButton, ThemedText } from './ThemeComponents';
import { getZaloUserInfo, checkAdminRole } from '../services/zaloAuth';

export default function AuthDebugPanel() {
  const { user, isAdmin, isLoading, login, logout } = useAuth();
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(false);

  // Test Zalo user info manually
  const testZaloAuth = async () => {
    setTesting(true);
    setTestResults({});
    
    try {
      console.log('🧪 [DEBUG] Starting Zalo auth test...');
      
      // Test 1: Get Zalo user info
      const userInfo = await getZaloUserInfo();
      console.log('🧪 [DEBUG] Zalo user info:', userInfo);
      
      // Test 2: Check admin role
      const adminStatus = await checkAdminRole(userInfo?.phone);
      console.log('🧪 [DEBUG] Admin status:', adminStatus);
      
      setTestResults({
        userInfo,
        adminStatus,
        timestamp: new Date().toLocaleTimeString(),
        success: true
      });
      
    } catch (error) {
      console.error('🧪 [DEBUG] Auth test failed:', error);
      setTestResults({
        error: error.message,
        timestamp: new Date().toLocaleTimeString(),
        success: false
      });
    } finally {
      setTesting(false);
    }
  };

  // Clear localStorage and reset
  const resetAuth = () => {
    localStorage.clear();
    setTestResults({});
    console.log('🧪 [DEBUG] Auth state cleared');
    window.location.reload();
  };

  // Show debug info in console
  const logDebugInfo = () => {
    console.group('🧪 [DEBUG] Current Auth State');
    console.log('User:', user);
    console.log('Is Admin:', isAdmin);
    console.log('Is Loading:', isLoading);
    console.log('LocalStorage zalo_auth_user:', localStorage.getItem('zalo_auth_user'));
    console.log('LocalStorage zalo_name:', localStorage.getItem('zalo_name'));
    console.log('LocalStorage zalo_phone:', localStorage.getItem('zalo_phone'));
    console.log('Current URL:', window.location.href);
    console.log('User Agent:', navigator.userAgent);
    console.groupEnd();
  };

  if (!isVisible) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <ThemedButton 
          size="sm" 
          onClick={() => setIsVisible(true)}
          className="bg-red-500 text-white hover:bg-red-600 shadow-lg"
        >
          🧪 Debug
        </ThemedButton>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-80">
      <ThemedCard className="p-4 shadow-2xl border-2 border-red-300">
        <div className="flex justify-between items-center mb-3">
          <ThemedText variant="primary" size="lg" className="font-bold">
            🧪 Auth Debug Panel
          </ThemedText>
          <ThemedButton 
            size="sm" 
            variant="error"
            onClick={() => setIsVisible(false)}
          >
            ✕
          </ThemedButton>
        </div>

        {/* Current Auth State */}
        <div className="mb-4 p-3 bg-gray-100 rounded-lg">
          <ThemedText size="sm" className="font-semibold mb-2">📊 Current State:</ThemedText>
          <div className="space-y-1 text-xs">
            <div>🔄 Loading: <span className={isLoading ? 'text-orange-500' : 'text-green-500'}>
              {isLoading ? 'YES' : 'NO'}
            </span></div>
            <div>👤 User: <span className={user ? 'text-green-500' : 'text-red-500'}>
              {user ? `${user.name}` : 'NOT LOGGED IN'}
            </span></div>
            <div>📱 Phone: <span className="text-blue-600">
              {user?.phone || localStorage.getItem('zalo_phone') || 'N/A'}
            </span></div>
            <div>👑 Admin: <span className={isAdmin ? 'text-green-500' : 'text-red-500'}>
              {isAdmin ? 'YES' : 'NO'}
            </span></div>
            <div>🔧 Override: <span className="text-purple-600">
              {localStorage.getItem('manual_admin_override') === 'true' ? 'ACTIVE' : 'OFF'}
            </span></div>
          </div>
        </div>

        {/* Test Results */}
        {testResults.timestamp && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <ThemedText size="sm" className="font-semibold mb-2">
              📋 Test Results ({testResults.timestamp}):
            </ThemedText>
            {testResults.success ? (
              <div className="text-xs space-y-1">
                <div>✅ User Info: {testResults.userInfo?.name || 'N/A'}</div>
                <div>📱 Phone: {testResults.userInfo?.phone || 'N/A'}</div>
                <div>👑 Admin: {testResults.adminStatus ? '✅ YES' : '❌ NO'}</div>
              </div>
            ) : (
              <div className="text-xs text-red-600">
                ❌ Error: {testResults.error}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <ThemedButton 
            size="sm" 
            onClick={testZaloAuth}
            disabled={testing}
            className="w-full"
          >
            {testing ? '🔄 Testing...' : '🧪 Test Zalo Auth'}
          </ThemedButton>
          
          <ThemedButton 
            size="sm" 
            onClick={logDebugInfo}
            className="w-full"
          >
            📝 Log to Console
          </ThemedButton>
          
          <ThemedButton 
            size="sm" 
            variant="error"
            onClick={resetAuth}
            className="w-full"
          >
            🔄 Reset Auth
          </ThemedButton>

          {/* Manual Admin Override for Testing */}
          <ThemedButton 
            size="sm" 
            variant="success"
            onClick={() => {
              localStorage.setItem('manual_admin_override', 'true');
              console.log('🔧 [DEBUG] Manual admin override activated');
              window.location.reload();
            }}
            className="w-full"
          >
            👑 Force Admin (Test)
          </ThemedButton>

          {user && !isAdmin && (
            <ThemedButton 
              size="sm" 
              variant="error"
              onClick={() => window.location.href = '/admin'}
              className="w-full"
            >
              🚫 Try Admin Access
            </ThemedButton>
          )}
        </div>

        {/* Environment Info */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <ThemedText size="xs" className="text-gray-500">
            🌐 {window.location.hostname} • {navigator.userAgent.includes('ZaloMiniApp') ? '📱 Zalo' : '💻 Web'}
          </ThemedText>
        </div>
      </ThemedCard>
    </div>
  );
}