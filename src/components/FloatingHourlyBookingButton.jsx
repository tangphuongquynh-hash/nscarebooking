// src/components/FloatingHourlyBookingButton.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { ThemedButton } from './ThemeComponents';

export default function FloatingHourlyBookingButton() {
  const { theme } = useTheme();

  return (
    <div className="fixed bottom-24 right-4 z-40 md:bottom-6">
      <Link to="/hourly-booking">
        <ThemedButton 
          size="md"
          className="floating-hourly-btn flex items-center gap-2 shadow-xl border-2 border-white/20 backdrop-blur-sm active:scale-95 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.primary})`,
            color: 'white',
            borderRadius: '25px',
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: 'bold',
            minWidth: '110px',
            boxShadow: '0 6px 24px rgba(0,0,0,0.25)',
          }}
        >
          <span className="text-lg">⏰</span>
          <span className="font-bold text-sm">Book ngay</span>
        </ThemedButton>
      </Link>
    </div>
  );
}