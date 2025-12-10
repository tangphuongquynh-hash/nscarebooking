// src/components/APITestPanel.jsx
// Panel để test các API calls trong Zalo Mini App

import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ThemedCard, ThemedButton, ThemedText, ThemedInput } from './ThemeComponents';
import { createBooking, getBookings } from '../api';
import { sendBookingConfirmation } from '../services/znsService';

export default function APITestPanel() {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [testing, setTesting] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: 'Test User API',
    phone: '0909123456',
    service: 'Test Service',
    address: 'Test Address',
    date: '10/12/2025',
    time: '14:00',
    type: 'hourly',
    hours: 2,
    staff: 1,
    total: 400000
  });

  const addTestResult = (type, result) => {
    const newResult = {
      id: Date.now(),
      type,
      timestamp: new Date().toLocaleTimeString(),
      ...result
    };
    setTestResults(prev => [newResult, ...prev.slice(0, 9)]); // Keep last 10 results
  };

  // Test 1: Fetch Bookings API
  const testGetBookings = async () => {
    setTesting(true);
    try {
      console.log('🔍 Testing getBookings API...');
      const bookings = await getBookings();
      addTestResult('GET Bookings', { 
        success: true, 
        count: bookings.length,
        data: bookings.slice(0, 2) // Show first 2 for preview
      });
    } catch (error) {
      addTestResult('GET Bookings', { success: false, error: error.message });
    } finally {
      setTesting(false);
    }
  };

  // Test 2: Create Booking API
  const testCreateBooking = async () => {
    setTesting(true);
    try {
      console.log('📝 Testing createBooking API...');
      const result = await createBooking(bookingData);
      addTestResult('CREATE Booking', { 
        success: true, 
        bookingId: result.id,
        data: result
      });
    } catch (error) {
      addTestResult('CREATE Booking', { success: false, error: error.message });
    } finally {
      setTesting(false);
    }
  };

  // Test 3: ZNS API
  const testZNSAPI = async () => {
    setTesting(true);
    try {
      console.log('📱 Testing ZNS API...');
      const result = await sendBookingConfirmation(bookingData);
      addTestResult('ZNS API', { 
        success: result.success, 
        messageId: result.messageId,
        developmentMode: result.developmentMode
      });
    } catch (error) {
      addTestResult('ZNS API', { success: false, error: error.message });
    } finally {
      setTesting(false);
    }
  };

  // Test 4: Network Status
  const testNetworkStatus = async () => {
    setTesting(true);
    try {
      console.log('🌐 Testing Network Status...');
      const isOnline = navigator.onLine;
      const startTime = Date.now();
      
      // Test external API
      const response = await fetch('https://httpbin.org/json', {
        method: 'GET',
        timeout: 5000
      });
      
      const endTime = Date.now();
      const latency = endTime - startTime;
      
      addTestResult('Network Test', { 
        success: true, 
        online: isOnline,
        latency: `${latency}ms`,
        status: response.status
      });
    } catch (error) {
      addTestResult('Network Test', { 
        success: false, 
        error: error.message,
        online: navigator.onLine
      });
    } finally {
      setTesting(false);
    }
  };

  // Test 5: Local Storage
  const testLocalStorage = () => {
    try {
      console.log('💾 Testing Local Storage...');
      const testKey = 'api_test_' + Date.now();
      const testData = { test: true, timestamp: new Date().toISOString() };
      
      localStorage.setItem(testKey, JSON.stringify(testData));
      const retrieved = JSON.parse(localStorage.getItem(testKey));
      localStorage.removeItem(testKey);
      
      addTestResult('Local Storage', { 
        success: true, 
        stored: testData,
        retrieved: retrieved,
        matches: JSON.stringify(testData) === JSON.stringify(retrieved)
      });
    } catch (error) {
      addTestResult('Local Storage', { success: false, error: error.message });
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-20 right-4 z-50">
        <ThemedButton 
          size="sm" 
          onClick={() => setIsVisible(true)}
          className="bg-purple-500 text-white hover:bg-purple-600 shadow-lg"
        >
          🔧 API Test
        </ThemedButton>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 w-96 max-h-[70vh] overflow-y-auto">
      <ThemedCard className="p-4 shadow-2xl border-2 border-purple-300">
        <div className="flex justify-between items-center mb-3">
          <div>
            <ThemedText variant="primary" size="lg" className="font-bold">
              🔧 API Test Panel
            </ThemedText>
            <ThemedText variant="muted" size="xs">
              Test APIs in Zalo Mini App
            </ThemedText>
          </div>
          <ThemedButton 
            size="sm" 
            variant="error"
            onClick={() => setIsVisible(false)}
          >
            ✕
          </ThemedButton>
        </div>

        {/* Test Booking Data Preview */}
        <ThemedCard className="p-2 mb-3 bg-purple-50 border border-purple-200">
          <ThemedText variant="primary" size="xs" className="font-semibold mb-1">
            📋 Test Booking Data:
          </ThemedText>
          <div className="text-xs space-y-1" style={{ color: theme.text.muted }}>
            <div>Name: {bookingData.name}</div>
            <div>Phone: {bookingData.phone}</div>
            <div>Service: {bookingData.service}</div>
            <div>Total: {bookingData.total.toLocaleString()} ₫</div>
          </div>
        </ThemedCard>

        {/* Edit Test Data */}
        <div className="mb-4">
          <ThemedText variant="muted" size="xs" className="mb-2">Edit test phone:</ThemedText>
          <ThemedInput
            type="tel"
            value={bookingData.phone}
            onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
            placeholder="0909123456"
            size="sm"
            className="w-full"
          />
        </div>

        {/* Test Buttons */}
        <div className="space-y-2 mb-4">
          <ThemedButton 
            size="sm" 
            onClick={testNetworkStatus}
            disabled={testing}
            className="w-full"
            variant="secondary"
          >
            {testing ? '🔄 Testing...' : '🌐 Network Status'}
          </ThemedButton>
          
          <ThemedButton 
            size="sm" 
            onClick={testGetBookings}
            disabled={testing}
            className="w-full"
            variant="primary"
          >
            {testing ? '🔄 Testing...' : '📊 GET Bookings'}
          </ThemedButton>
          
          <ThemedButton 
            size="sm" 
            onClick={testCreateBooking}
            disabled={testing}
            className="w-full"
            variant="success"
          >
            {testing ? '🔄 Testing...' : '📝 CREATE Booking'}
          </ThemedButton>

          <ThemedButton 
            size="sm" 
            onClick={testZNSAPI}
            disabled={testing}
            className="w-full"
            variant="accent"
          >
            {testing ? '🔄 Testing...' : '📱 ZNS API'}
          </ThemedButton>

          <ThemedButton 
            size="sm" 
            onClick={testLocalStorage}
            disabled={testing}
            className="w-full"
            variant="muted"
          >
            💾 Local Storage
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
                        {result.count && <div>Count: {result.count}</div>}
                        {result.latency && <div>Latency: {result.latency}</div>}
                        {result.online !== undefined && <div>Online: {result.online ? 'Yes' : 'No'}</div>}
                        {result.messageId && <div>Message ID: {result.messageId}</div>}
                        {result.developmentMode && <div className="text-blue-600">Dev Mode</div>}
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
            🌐 {process.env.NODE_ENV || 'production'} mode • Zalo Mini App API Testing
          </ThemedText>
        </div>
      </ThemedCard>
    </div>
  );
}