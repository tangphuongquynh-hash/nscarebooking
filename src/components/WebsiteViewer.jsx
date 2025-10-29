// src/components/WebsiteViewer.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';

const WebsiteViewer = ({ isOpen, onClose, url = "https://www.nscare.vn" }) => {
  const [loading, setLoading] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b flex items-center justify-between p-4">
        <h3 className="font-semibold text-gray-800">NS CARE Website</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <X size={20} />
        </button>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Đang tải website...</p>
          </div>
        </div>
      )}

      {/* Iframe */}
      <iframe
        src={url}
        className="flex-1 w-full border-0"
        onLoad={() => setLoading(false)}
        title="NS CARE Website"
        allowFullScreen
      />
    </div>
  );
};

export default WebsiteViewer;