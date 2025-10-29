// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeZaloAuth, isCurrentUserAdmin, logoutUser } from '../services/zaloAuth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        
        // Check existing user in localStorage first
        const existingUser = {
          id: localStorage.getItem('zalo_user_id'),
          name: localStorage.getItem('zalo_name'),
          avatar: localStorage.getItem('zalo_avatar'),
          phone: localStorage.getItem('zalo_phone')
        };

        if (existingUser.id) {
          setUser(existingUser);
          setIsAdmin(isCurrentUserAdmin());
          console.log('👤 Restored user from localStorage:', existingUser);
        }

        // Try to initialize Zalo auth (only works in Zalo environment)
        try {
          const authResult = await initializeZaloAuth();
          
          if (authResult) {
            setUser(authResult.userInfo);
            setIsAdmin(authResult.isAdmin);
            console.log('✅ Zalo auth initialized successfully');
          }
        } catch (zaloError) {
          console.log('⚠️ Zalo auth not available (probably running in browser):', zaloError.message);
          // This is normal when testing in browser
        }
        
        setInitialized(true);
      } catch (error) {
        console.error('❌ Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async () => {
    try {
      setLoading(true);
      const authResult = await initializeZaloAuth();
      
      if (authResult) {
        setUser(authResult.userInfo);
        setIsAdmin(authResult.isAdmin);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setIsAdmin(false);
  };

  const refreshAdminStatus = async () => {
    if (user) {
      try {
        const { checkAdminRole } = await import('../services/zaloAuth');
        const adminStatus = await checkAdminRole(user);
        setIsAdmin(adminStatus);
        localStorage.setItem('is_admin', adminStatus.toString());
        return adminStatus;
      } catch (error) {
        console.error('❌ Failed to refresh admin status:', error);
        return false;
      }
    }
    return false;
  };

  const value = {
    user,
    isAdmin,
    loading,
    initialized,
    login,
    logout,
    refreshAdminStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};