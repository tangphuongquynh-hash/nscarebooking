// src/components/FloatingDashboardButton.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { ThemedButton } from './ThemeComponents';

export default function FloatingDashboardButton() {
  const { theme } = useTheme();

  return (
    <div className="fixed bottom-24 left-4 z-50 md:bottom-6">
      <Link to="/admin">
        <ThemedButton 
          size="lg"
          className="floating-dashboard-btn flex items-center gap-2 shadow-2xl border-2 border-white/20 backdrop-blur-sm active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
            color: 'white',
            borderRadius: '50px',
            padding: '12px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            minWidth: '160px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          <span className="text-xl">🧭</span>
          <span>Dashboard</span>
        </ThemedButton>
      </Link>
    </div>
  );
}