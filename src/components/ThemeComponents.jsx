import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

// Themed Container Component
export const ThemedContainer = ({ 
  children, 
  variant = 'main', 
  className = '', 
  style = {},
  ...props 
}) => {
  const { theme } = useTheme();
  
  const getBackground = () => {
    switch (variant) {
      case 'main':
        return theme.background.main;
      case 'light':
        return theme.background.light;
      case 'card':
        return theme.background.card;
      default:
        return theme.background.main;
    }
  };

  return (
    <div
      className={`${className}`}
      style={{
        background: getBackground(),
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// Themed Button Component
export const ThemedButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  style = {},
  ...props 
}) => {
  const { theme } = useTheme();
  
  const getButtonStyle = () => {
    const baseStyle = {
      border: 'none',
      borderRadius: '0.75rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      color: 'white',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    };

    const variants = {
      primary: {
        background: theme.button.primary,
      },
      secondary: {
        background: theme.button.secondary,
      },
      success: {
        background: `linear-gradient(135deg, ${theme.status.success}, #047857)`,
        color: 'white !important'
      },
      error: {
        background: `linear-gradient(135deg, ${theme.status.error}, #dc2626)`,
        color: 'white !important'
      },
      outline: {
        background: 'transparent',
        border: `2px solid ${theme.primary}`,
        color: theme.text.primary,
      },
      ghost: {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
      }
    };

    const sizes = {
      sm: {
        padding: '0.5rem 1rem',
        fontSize: '0.875rem'
      },
      md: {
        padding: '0.75rem 1.5rem',
        fontSize: '1rem'
      },
      lg: {
        padding: '1rem 2rem',
        fontSize: '1.125rem'
      }
    };

    return {
      ...baseStyle,
      ...variants[variant],
      ...sizes[size]
    };
  };

  return (
    <button
      className={className}
      style={{
        ...getButtonStyle(),
        ...style
      }}
      onMouseOver={(e) => {
        if (variant === 'primary' || variant === 'secondary') {
          e.target.style.background = theme.button.hover;
        }
      }}
      onMouseOut={(e) => {
        if (variant === 'primary') {
          e.target.style.background = theme.button.primary;
        } else if (variant === 'secondary') {
          e.target.style.background = theme.button.secondary;
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};

// Themed Text Component
export const ThemedText = ({ 
  children, 
  variant = 'primary', 
  size = 'base',
  className = '',
  style = {},
  as = 'p',
  ...props 
}) => {
  const { theme } = useTheme();
  
  const getTextStyle = () => {
    const variants = {
      primary: { color: theme.text.primary },
      secondary: { color: theme.text.secondary },
      muted: { color: theme.text.muted },
      accent: { color: theme.primary }
    };

    const sizes = {
      xs: { fontSize: '0.75rem' },
      sm: { fontSize: '0.875rem' },
      base: { fontSize: '1rem' },
      lg: { fontSize: '1.125rem' },
      xl: { fontSize: '1.25rem' },
      '2xl': { fontSize: '1.5rem' },
      '3xl': { fontSize: '1.875rem' }
    };

    return {
      ...variants[variant],
      ...sizes[size]
    };
  };

  const Component = as;

  return (
    <Component
      className={className}
      style={{
        ...getTextStyle(),
        ...style
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

// Themed Card Component
export const ThemedCard = ({ 
  children, 
  className = '',
  style = {},
  hover = false,
  ...props 
}) => {
  const { theme } = useTheme();
  
  const cardStyle = {
    background: theme.background.card,
    borderRadius: '1rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.2s ease',
    ...(hover && {
      cursor: 'pointer',
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)'
      }
    })
  };

  return (
    <div
      className={`${className}`}
      style={{
        ...cardStyle,
        ...style
      }}
      onMouseOver={hover ? (e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.15)';
      } : undefined}
      onMouseOut={hover ? (e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      } : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

// Themed Input Component
export const ThemedInput = ({ 
  className = '',
  style = {},
  ...props 
}) => {
  const { theme } = useTheme();
  
  const inputStyle = {
    border: `2px solid rgba(${theme.primary.slice(1).match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.2)`,
    borderRadius: '0.5rem',
    padding: '0.75rem',
    fontSize: '1rem',
    background: 'rgba(255, 255, 255, 0.9)',
    transition: 'all 0.2s ease',
    outline: 'none'
  };

  return (
    <input
      className={className}
      style={{
        ...inputStyle,
        ...style
      }}
      onFocus={(e) => {
        e.target.style.borderColor = theme.primary;
        e.target.style.boxShadow = `0 0 0 3px rgba(${theme.primary.slice(1).match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.1)`;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = `rgba(${theme.primary.slice(1).match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.2)`;
        e.target.style.boxShadow = 'none';
      }}
      {...props}
    />
  );
};

// Themed Badge Component
export const ThemedBadge = ({ 
  children, 
  variant = 'primary',
  size = 'sm',
  className = '',
  style = {},
  ...props 
}) => {
  const { theme } = useTheme();
  
  const getBadgeStyle = () => {
    const baseStyle = {
      borderRadius: '9999px',
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      textShadow: '0 1px 2px rgba(0,0,0,0.2)',
      border: 'none',
      outline: 'none'
    };

    const variants = {
      primary: {
        background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
        color: 'white !important'
      },
      success: {
        background: `linear-gradient(135deg, ${theme.status.success}, #047857)`,
        color: 'white !important'
      },
      warning: {
        background: `linear-gradient(135deg, ${theme.status.warning}, #d97706)`,
        color: 'white !important'
      },
      error: {
        background: `linear-gradient(135deg, ${theme.status.error}, #dc2626)`,
        color: 'white !important'
      },
      outline: {
        background: 'transparent',
        border: `1px solid ${theme.primary}`,
        color: theme.text.primary
      }
    };

    const sizes = {
      xs: { padding: '0.25rem 0.5rem', fontSize: '0.75rem' },
      sm: { padding: '0.25rem 0.75rem', fontSize: '0.875rem' },
      md: { padding: '0.5rem 1rem', fontSize: '1rem' }
    };

    return {
      ...baseStyle,
      ...variants[variant],
      ...sizes[size]
    };
  };

  return (
    <span
      className={className}
      style={{
        ...getBadgeStyle(),
        ...style
      }}
      {...props}
    >
      {children}
    </span>
  );
};