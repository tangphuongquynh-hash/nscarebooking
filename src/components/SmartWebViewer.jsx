// src/components/SmartWebViewer.jsx
import React, { useState, useEffect } from 'react';
import InAppBrowser from './InAppBrowser';

const SmartWebViewer = ({ isOpen, onClose, url, title }) => {
  const [useIframe, setUseIframe] = useState(true);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset states when opening
      setUseIframe(true);
      setShowFallback(false);
      
      // Check if URL can be embedded after a short delay
      const timer = setTimeout(() => {
        // Test iframe loading - if it fails, show fallback
        const testIframe = document.createElement('iframe');
        testIframe.style.display = 'none';
        testIframe.src = url;
        
        testIframe.onload = () => {
          document.body.removeChild(testIframe);
        };
        
        testIframe.onerror = () => {
          setUseIframe(false);
          setShowFallback(true);
          document.body.removeChild(testIframe);
        };
        
        document.body.appendChild(testIframe);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, url]);

  if (!isOpen) return null;

  // Fallback UI for websites that can't be embedded
  if (showFallback || !useIframe) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
          <div className="text-center">
            {/* Icon */}
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>

            {/* Content */}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Website này cần mở trong trình duyệt để có trải nghiệm tốt nhất
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  window.open(url, '_blank', 'noopener,noreferrer');
                  onClose();
                }}
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105"
              >
                🌐 Mở trong trình duyệt
              </button>
              
              <button
                onClick={() => {
                  setUseIframe(true);
                  setShowFallback(false);
                }}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                🔄 Thử hiển thị trong app
              </button>
              
              <button
                onClick={onClose}
                className="w-full text-gray-500 py-2 px-4 rounded-lg hover:text-gray-700 transition-colors"
              >
                ✕ Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use InAppBrowser for embeddable content
  return (
    <InAppBrowser
      isOpen={isOpen}
      onClose={onClose}
      initialUrl={url}
      title={title}
    />
  );
};

export default SmartWebViewer;