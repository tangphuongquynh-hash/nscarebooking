// src/components/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ThemedContainer, ThemedText, ThemedButton, ThemedCard } from './ThemeComponents';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAdmin, loading, login } = useAuth();

  // Show loading while checking auth
  if (loading) {
    return (
      <ThemedContainer variant="main" className="min-h-screen p-4 flex items-center justify-center">
        <ThemedCard className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <ThemedText variant="muted">Đang kiểm tra quyền truy cập...</ThemedText>
        </ThemedCard>
      </ThemedContainer>
    );
  }

  // If admin required but user is not admin
  if (requireAdmin && !isAdmin) {
    return (
      <ThemedContainer variant="main" className="min-h-screen p-4 flex items-center justify-center">
        <ThemedCard className="p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <ThemedText variant="primary" size="lg" className="font-bold mb-2">
            Quyền truy cập bị từ chối
          </ThemedText>
          <ThemedText variant="muted" size="sm" className="mb-6">
            Bạn cần có quyền quản trị viên để truy cập trang này. 
            {!user && " Vui lòng đăng nhập với tài khoản admin."}
          </ThemedText>
          
          {!user ? (
            <ThemedButton onClick={login} variant="primary" className="mb-3">
              🔑 Đăng nhập Zalo
            </ThemedButton>
          ) : (
            <div className="space-y-3">
              <ThemedText variant="muted" size="xs">
                Đã đăng nhập: {user.name}
              </ThemedText>
              <ThemedButton 
                onClick={() => window.history.back()} 
                variant="outline"
                size="sm"
              >
                ← Quay lại
              </ThemedButton>
            </div>
          )}
          
          <ThemedText variant="muted" size="xs" className="mt-4">
            💡 Liên hệ admin để được cấp quyền truy cập
          </ThemedText>
        </ThemedCard>
      </ThemedContainer>
    );
  }

  // If login required but user not logged in
  if (!user) {
    return (
      <ThemedContainer variant="main" className="min-h-screen p-4 flex items-center justify-center">
        <ThemedCard className="p-8 text-center max-w-md">
          <div className="text-6xl mb-4">👋</div>
          <ThemedText variant="primary" size="lg" className="font-bold mb-2">
            Chào mừng đến NS CARE
          </ThemedText>
          <ThemedText variant="muted" size="sm" className="mb-6">
            Đăng nhập để có trải nghiệm tốt nhất và truy cập đầy đủ tính năng
          </ThemedText>
          
          <ThemedButton onClick={login} variant="primary" className="mb-3">
            🔑 Đăng nhập với Zalo
          </ThemedButton>
          
          <ThemedText variant="muted" size="xs">
            Thông tin của bạn được bảo mật và chỉ dùng để cải thiện dịch vụ
          </ThemedText>
        </ThemedCard>
      </ThemedContainer>
    );
  }

  // User authenticated and has required permissions
  return children;
};

export default ProtectedRoute;