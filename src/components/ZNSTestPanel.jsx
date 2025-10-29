// src/components/ZNSTestPanel.jsx
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ThemedCard, ThemedButton, ThemedText, ThemedInput } from './ThemeComponents';
import { 
  sendBookingConfirmation, 
  sendServiceCompletion, 
  sendBookingCancellation,
  testZNSConnection 
} from '../services/znsService';

export default function ZNSTestPanel() {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [testing, setTesting] = useState(false);
  const [testPhone, setTestPhone] = useState('0909123456');

  // Mock booking data for testing
  const mockBooking = {
    id: 'test_001',
    name: 'Nguyễn Văn Test',
    phone: testPhone,
    service: 'Dọn dẹp theo giờ',
    date: new Date().toLocaleDateString('vi-VN'),
    time: '14:00',
    address: '123 Đường Test, Quận 1, TP.HCM',
    total: 500000,
    staff: 2,
    duration: 3
  };

  const addTestResult = (type, result) => {
    const newResult = {
      id: Date.now(),
      type,
      timestamp: new Date().toLocaleTimeString(),
      ...result
    };
    setTestResults(prev => [newResult, ...prev.slice(0, 9)]); // Keep last 10 results
  };

  const testConnection = async () => {
    setTesting(true);
    try {
      const result = await testZNSConnection();
      addTestResult('Connection Test', result);
    } catch (error) {
      addTestResult('Connection Test', { success: false, error: error.message });
    } finally {
      setTesting(false);
    }
  };

  const testConfirmation = async () => {
    setTesting(true);
    try {
      const result = await sendBookingConfirmation({ ...mockBooking, phone: testPhone });
      addTestResult('Booking Confirmation', result);
    } catch (error) {
      addTestResult('Booking Confirmation', { success: false, error: error.message });
    } finally {
      setTesting(false);
    }
  };

  const testCompletion = async () => {
    setTesting(true);
    try {
      const result = await sendServiceCompletion({ ...mockBooking, phone: testPhone });
      addTestResult('Service Completion', result);
    } catch (error) {
      addTestResult('Service Completion', { success: false, error: error.message });
    } finally {
      setTesting(false);
    }
  };

  const testCancellation = async () => {
    setTesting(true);
    try {
      const result = await sendBookingCancellation({ ...mockBooking, phone: testPhone }, 'Test cancellation');
      addTestResult('Booking Cancellation', result);
    } catch (error) {
      addTestResult('Booking Cancellation', { success: false, error: error.message });
    } finally {
      setTesting(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <ThemedButton 
          size="sm" 
          onClick={() => setIsVisible(true)}
          className="bg-blue-500 text-white hover:bg-blue-600 shadow-lg"
        >
          📱 ZNS Test
        </ThemedButton>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <ThemedCard className="p-4 shadow-2xl border-2 border-blue-300 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-3">
          <ThemedText variant="primary" size="lg" className="font-bold">
            📱 ZNS Test Panel
          </ThemedText>
          <ThemedButton 
            size="sm" 
            variant="error"
            onClick={() => setIsVisible(false)}
          >
            ✕
          </ThemedButton>
        </div>

        {/* Phone Input */}
        <div className="mb-4">
          <label className="block text-xs mb-1" style={{ color: theme.text.muted }}>
            Số điện thoại test:
          </label>
          <ThemedInput
            type="text"
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value)}
            placeholder="0909123456"
            size="sm"
            className="w-full"
          />
        </div>

        {/* Test Buttons */}
        <div className="space-y-2 mb-4">
          <ThemedButton 
            size="sm" 
            onClick={testConnection}
            disabled={testing}
            className="w-full"
            variant="secondary"
          >
            {testing ? '🔄 Testing...' : '🔗 Test Connection'}
          </ThemedButton>
          
          <ThemedButton 
            size="sm" 
            onClick={testConfirmation}
            disabled={testing}
            className="w-full"
            variant="primary"
          >
            {testing ? '🔄 Sending...' : '✅ Test Confirmation'}
          </ThemedButton>
          
          <ThemedButton 
            size="sm" 
            onClick={testCompletion}
            disabled={testing}
            className="w-full"
            variant="success"
          >
            {testing ? '🔄 Sending...' : '🎉 Test Completion'}
          </ThemedButton>

          <ThemedButton 
            size="sm" 
            onClick={testCancellation}
            disabled={testing}
            className="w-full"
            variant="error"
          >
            {testing ? '🔄 Sending...' : '❌ Test Cancellation'}
          </ThemedButton>

          <ThemedButton 
            size="sm" 
            onClick={clearResults}
            className="w-full"
            variant="outline"
          >
            🗑️ Clear Results
          </ThemedButton>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="border-t pt-3" style={{ borderColor: theme.primary + '40' }}>
            <ThemedText size="sm" className="font-semibold mb-2">
              📋 Test Results:
            </ThemedText>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {testResults.map((result) => (
                <div key={result.id} className="p-2 bg-gray-50 rounded text-xs">
                  <div className="flex justify-between items-start mb-1">
                    <ThemedText size="xs" className="font-semibold">
                      {result.type}
                    </ThemedText>
                    <ThemedText size="xs" className="text-gray-500">
                      {result.timestamp}
                    </ThemedText>
                  </div>
                  <div className={result.success ? 'text-green-600' : 'text-red-600'}>
                    {result.success ? (
                      <div>
                        ✅ Success
                        {result.developmentMode && (
                          <div className="text-blue-600">📝 Dev Mode</div>
                        )}
                        {result.messageId && (
                          <div>ID: {result.messageId}</div>
                        )}
                      </div>
                    ) : (
                      <div>❌ {result.error}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Environment Info */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <ThemedText size="xs" className="text-gray-500">
            🌐 Development Mode • Mock Templates
          </ThemedText>
        </div>
      </ThemedCard>
    </div>
  );
}