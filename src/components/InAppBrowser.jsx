// src/components/InAppBrowser.jsx
import React, { useState, useRef } from 'react';
import { X, RefreshCw, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';

const InAppBrowser = ({ isOpen, onClose, initialUrl, title = "Browser" }) => {
  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const iframeRef = useRef(null);

  if (!isOpen) return null;

  const handleRefresh = () => {
    if (iframeRef.current) {
      setLoading(true);
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleExternalOpen = () => {
    window.open(currentUrl, '_blank', 'noopener,noreferrer');
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
        <iframe
          ref={iframeRef}
          src={currentUrl}
          className="w-full h-full border-0"
          onLoad={() => setLoading(false)}
          title={title}
          allowFullScreen
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
};

export default InAppBrowser;