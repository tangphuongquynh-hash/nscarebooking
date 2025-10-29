// src/components/InAppBrowser.jsx
import React, { useState, useRef } from 'react';
import { X, RefreshCw, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';

const InAppBrowser = ({ isOpen, onClose, initialUrl, title = "Browser" }) => {
  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);

  if (!isOpen) return null;

  const handleRefresh = () => {
    if (iframeRef.current) {
      setLoading(true);
      setError(null);
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleExternalOpen = () => {
    window.open(currentUrl, '_blank', 'noopener,noreferrer');
  };

  const handleIframeLoad = () => {
    setLoading(false);
    setError(null);
  };

  const handleIframeError = () => {
    setLoading(false);
    setError('Không thể tải trang web này. Website có thể chặn hiển thị trong iframe.');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col">
      {/* Browser Header */}
      <div className="bg-white border-b shadow-sm">
        {/* Top bar */}
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
            <h3 className="font-semibold text-gray-800">{title}</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={`text-gray-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleExternalOpen}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ExternalLink size={16} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* URL bar */}
        <div className="px-3 py-2">
          <div className="bg-gray-100 rounded-lg px-3 py-2 flex items-center">
            <span className="text-sm text-gray-600 truncate">{currentUrl}</span>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="bg-white border-b px-3 py-2">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-teal-600 rounded-full animate-pulse w-2/3"></div>
          </div>
        </div>
      )}

      {/* Iframe container */}
      <div className="flex-1 bg-white relative">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
              <div className="text-yellow-600 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Không thể hiển thị trong app</h3>
              <p className="text-gray-600 text-sm mb-4">{error}</p>
              <div className="space-y-2">
                <button
                  onClick={handleExternalOpen}
                  className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  🔗 Mở trong trình duyệt
                </button>
                <button
                  onClick={handleRefresh}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  🔄 Thử lại
                </button>
              </div>
            </div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={currentUrl}
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title={title}
            allowFullScreen
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
          />
        )}
      </div>
    </div>
  );
};

export default InAppBrowser;