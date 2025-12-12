// src/components/ZaloDebugPanel.jsx
// Debug panel để kiểm tra Zalo Mini App environment

import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ThemedCard, ThemedButton, ThemedText } from './ThemeComponents';
import { getZaloEnvironment } from '../utils/zaloAPI';

export default function ZaloDebugPanel() {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    // Collect debug info on mount
    const info = {
      ...getZaloEnvironment(),
      url: window.location.href,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      zaloMiniAppSDK: !!window.ZaloJavaScriptInterface,
      zaloAPI: !!window.ZaloMiniApp,
      appConfig: {
        appId: "3794181198297525649",
        domain: window.location.hostname
      }
    };
    setDebugInfo(info);
  }, []);

  if (!isVisible) {
    return (
      <div className="fixed top-20 left-4 z-50">
        <ThemedButton 
          size="sm" 
          onClick={() => setIsVisible(true)}
          className="bg-red-500 text-white hover:bg-red-600"
        >
          🐛 Zalo Debug
        </ThemedButton>
      </div>
    );
  }

  return (
    <div className="fixed top-20 left-4 z-50 w-80 max-h-[70vh] overflow-y-auto">
      <ThemedCard className="p-3 shadow-2xl border-2 border-red-300">
        <div className="flex justify-between items-center mb-3">
          <ThemedText variant="primary" size="sm" className="font-bold">
            🐛 Zalo Environment Debug
          </ThemedText>
          <ThemedButton 
            size="sm" 
            variant="error"
            onClick={() => setIsVisible(false)}
          >
            ✕
          </ThemedButton>
        </div>

        {debugInfo && (
          <div className="space-y-2 text-xs">
            
            {/* Zalo Detection */}
            <div className="bg-blue-50 p-2 rounded">
              <div className="font-semibold">🎯 Zalo Detection:</div>
              <div>Is Zalo Mini App: {debugInfo.isZaloMiniApp ? '✅ YES' : '❌ NO'}</div>
              <div>Zalo SDK: {debugInfo.zaloMiniApp ? '✅' : '❌'}</div>
              <div>Zalo Interface: {debugInfo.zaloInterface ? '✅' : '❌'}</div>
            </div>

            {/* Network */}
            <div className="bg-green-50 p-2 rounded">
              <div className="font-semibold">🌐 Network:</div>
              <div>Online: {debugInfo.online ? '✅' : '❌'}</div>
              <div>Connection: {debugInfo.connection?.effectiveType || 'Unknown'}</div>
            </div>

            {/* Environment */}
            <div className="bg-yellow-50 p-2 rounded">
              <div className="font-semibold">📱 Environment:</div>
              <div>Platform: {debugInfo.platform}</div>
              <div>Language: {debugInfo.language}</div>
              <div>Cookies: {debugInfo.cookieEnabled ? '✅' : '❌'}</div>
            </div>

            {/* URLs */}
            <div className="bg-purple-50 p-2 rounded">
              <div className="font-semibold">🔗 URLs:</div>
              <div>Current: {debugInfo.url}</div>
              <div>Referrer: {debugInfo.referrer || 'None'}</div>
              <div>Domain: {debugInfo.appConfig.domain}</div>
            </div>

            {/* User Agent */}
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-semibold">🖥️ User Agent:</div>
              <div className="break-all text-xs">
                {debugInfo.userAgent}
              </div>
            </div>

            {/* App Config */}
            <div className="bg-orange-50 p-2 rounded">
              <div className="font-semibold">⚙️ App Config:</div>
              <div>App ID: {debugInfo.appConfig.appId}</div>
              <div>Timestamp: {debugInfo.timestamp}</div>
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2">
              <ThemedButton 
                size="sm" 
                variant="primary"
                className="w-full"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
                  alert('Debug info copied to clipboard!');
                }}
              >
                📋 Copy Debug Info
              </ThemedButton>
              
              <ThemedButton 
                size="sm" 
                variant="secondary"
                className="w-full"
                onClick={() => {
                  window.location.reload();
                }}
              >
                🔄 Reload App
              </ThemedButton>
            </div>
          </div>
        )}
      </ThemedCard>
    </div>
  );
}