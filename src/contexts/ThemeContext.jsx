import React, { createContext, useContext, useState, useEffect } from 'react';

// Beautiful modern pastel gradient themes
const themes = {
  teal: {
    name: 'Teal Ocean',
    primary: '#4fd1c7',
    secondary: '#81e6d9',
    accent: '#38b2ac',
    background: {
      main: 'linear-gradient(135deg, #e6fffa 0%, #b2f5ea 50%, #81e6d9 100%)',
      light: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
      card: 'rgba(255, 255, 255, 0.9)'
    },
    text: {
      primary: '#234e52',
      secondary: '#2d5a87',
      muted: '#6b7280'
    },
    button: {
      primary: 'linear-gradient(135deg, #4fd1c7 0%, #38b2ac 100%)',
      secondary: 'linear-gradient(135deg, #81e6d9 0%, #4fd1c7 100%)',
      hover: 'linear-gradient(135deg, #38b2ac 0%, #2c7a7b 100%)'
    },
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    }
  },
  rose: {
    name: 'Rose Garden',
    primary: '#fb7185',
    secondary: '#fda4af',
    accent: '#e11d48',
    background: {
      main: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)',
      light: 'linear-gradient(135deg, #fef7ff 0%, #fae8ff 100%)',
      card: 'rgba(255, 255, 255, 0.9)'
    },
    text: {
      primary: '#881337',
      secondary: '#be185d',
      muted: '#6b7280'
    },
    button: {
      primary: 'linear-gradient(135deg, #fb7185 0%, #e11d48 100%)',
      secondary: 'linear-gradient(135deg, #fda4af 0%, #fb7185 100%)',
      hover: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)'
    },
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#dc2626',
      info: '#3b82f6'
    }
  },
  purple: {
    name: 'Purple Dream',
    primary: '#a78bfa',
    secondary: '#c4b5fd',
    accent: '#7c3aed',
    background: {
      main: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)',
      light: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
      card: 'rgba(255, 255, 255, 0.9)'
    },
    text: {
      primary: '#581c87',
      secondary: '#7c2d12',
      muted: '#6b7280'
    },
    button: {
      primary: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
      secondary: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%)',
      hover: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)'
    },
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#dc2626',
      info: '#3b82f6'
    }
  },
  amber: {
    name: 'Golden Sunset',
    primary: '#fbbf24',
    secondary: '#fcd34d',
    accent: '#d97706',
    background: {
      main: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%)',
      light: 'linear-gradient(135deg, #fffbeb 0%, #fef7cd 100%)',
      card: 'rgba(255, 255, 255, 0.9)'
    },
    text: {
      primary: '#92400e',
      secondary: '#b45309',
      muted: '#6b7280'
    },
    button: {
      primary: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
      secondary: 'linear-gradient(135deg, #fcd34d 0%, #fbbf24 100%)',
      hover: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
    },
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#dc2626',
      info: '#3b82f6'
    }
  },
  emerald: {
    name: 'Emerald Forest',
    primary: '#34d399',
    secondary: '#6ee7b7',
    accent: '#059669',
    background: {
      main: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)',
      light: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      card: 'rgba(255, 255, 255, 0.9)'
    },
    text: {
      primary: '#064e3b',
      secondary: '#065f46',
      muted: '#6b7280'
    },
    button: {
      primary: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
      secondary: 'linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)',
      hover: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
    },
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#dc2626',
      info: '#3b82f6'
    }
  },
  sky: {
    name: 'Sky Blue',
    primary: '#0ea5e9',
    secondary: '#38bdf8',
    accent: '#0284c7',
    background: {
      main: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
      light: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      card: 'rgba(255, 255, 255, 0.9)'
    },
    text: {
      primary: '#0c4a6e',
      secondary: '#075985',
      muted: '#6b7280'
    },
    button: {
      primary: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      secondary: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)',
      hover: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
    },
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#dc2626',
      info: '#3b82f6'
    }
  }
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('teal');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('appTheme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage when changed
  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem('appTheme', themeName);
    }
  };

  const theme = themes[currentTheme];

  const value = {
    currentTheme,
    theme,
    themes,
    changeTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;