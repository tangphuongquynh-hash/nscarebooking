import React from 'react';
import logoSrc from '../assets/logo.png';
// use window.ZMP at runtime instead of importing named binding which may not exist

export default function Header({ title }) {
  const handleBack = () => {
    try {
      // Try web history first
      if (window.history && window.history.length > 1) {
        window.history.back();
        return;
      }
    } catch (e) {
      console.warn('history.back failed', e);
    }

    // If running inside Zalo Mini App, call native close
    if (window.ZaloMiniApp || (typeof window.ZMP !== 'undefined' && window.ZMP)) {
      try {
        // zmp-sdk provides a way to close window in mini environments
        if (window.ZMP && window.ZMP.window && typeof window.ZMP.window.close === 'function') {
          window.ZMP.window.close();
          return;
        }
        // fallback to postMessage for older bridge
        window.postMessage(JSON.stringify({ action: 'WINDOW_CLOSE' }), '*');
      } catch (e) {
        console.warn('zmp close failed', e);
      }
    }
  };

  return (
    <div className="w-full flex items-center py-3 px-3" style={{ backgroundColor: '#043700', color: 'white' }}>
      <button aria-label="back" onClick={handleBack} className="mr-3 p-1">
        {/* simple back chevron */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="flex items-center">
        <img src={logoSrc} alt="NS Care" className="h-8 w-8 mr-3" />
        <h1 className="text-lg font-semibold" style={{ textAlign: 'left' }}>{title}</h1>
      </div>
    </div>
  );
}
