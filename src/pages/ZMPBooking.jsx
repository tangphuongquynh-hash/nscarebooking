// src/pages/ZMPBooking.jsx
// Example booking form using ZMP UI Components

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Page,
  Header,
  Box,
  Text,
  Button,
  Input,
  List
} from 'zmp-ui';

export default function ZMPBooking() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    service: '',
    date: new Date(),
    time: '14:00',
    staff: 2,
    notes: '',
    agreeTerms: false
  });

  const services = [
    { value: 'hourly', label: '🏠 Tổng vệ sinh theo giờ' },
    { value: 'office', label: '🏢 Vệ sinh văn phòng' },
    { value: 'ac', label: '❄️ Vệ sinh điều hòa' },
    { value: 'sofa', label: '🛋️ Giặt rèm, sofa' },
    { value: 'industrial', label: '🏭 Vệ sinh công nghiệp' }
  ];

  const handleSubmit = () => {
    if (!formData.name || !formData.phone || !formData.service || !formData.agreeTerms) {
      alert('Vui lòng điền đầy đủ thông tin và đồng ý với điều khoản!');
      return;
    }
    
    alert(`✅ Đặt lịch thành công!\n\nThông tin:\n- Tên: ${formData.name}\n- SĐT: ${formData.phone}\n- Dịch vụ: ${services.find(s => s.value === formData.service)?.label}\n- Ngày: ${formData.date.toLocaleDateString('vi-VN')}\n- Giờ: ${formData.time}\n- Nhân viên: ${formData.staff}`);
  };

  return (
    <Page>
      <Header 
        title="🎨 ZMP Booking Form" 
        showBackIcon={true}
        backIcon="zi-arrow-left"
      />
      
      <Box p={4}>
        
        {/* Info Header */}
        <Box className="bg-blue-50 rounded-lg p-4 mb-6">
          <Text size="large" bold className="text-blue-800 mb-2">
            ✨ ZMP UI Booking Demo
          </Text>
          <Text size="small" className="text-blue-600">
            Demo form sử dụng Zalo Mini App UI Components với native styling
          </Text>
        </Box>

        {/* Customer Info */}
        <Box className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <Text bold className="mb-3">👤 Thông tin khách hàng</Text>
          
          <Box className="space-y-4">
            <Input
              label="Họ và tên *"
              placeholder="Nhập họ tên đầy đủ"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              clearable
            />
            
            <Input
              label="Số điện thoại *"
              type="tel"
              placeholder="0909123456"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              clearable
            />
            
            <Input
              label="Địa chỉ"
              placeholder="Nhập địa chỉ chi tiết"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              clearable
            />
          </Box>
        </Box>

        {/* Service Selection */}
        <Box className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <Text bold className="mb-3">🧽 Chọn dịch vụ</Text>
          
          <List>
            {services.map((service) => (
              <List.Item
                key={service.value}
                title={service.label}
                suffix={
                  <input
                    type="radio"
                    name="service"
                    value={service.value}
                    checked={formData.service === service.value}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                    className="w-5 h-5"
                  />
                }
                onClick={() => setFormData({...formData, service: service.value})}
              />
            ))}
          </List>
        </Box>

        {/* Schedule */}
        <Box className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <Text bold className="mb-3">📅 Chọn lịch</Text>
          
          <Box className="space-y-4">
            <Input
              label="Ngày làm việc"
              type="date"
              value={formData.date.toISOString().split('T')[0]}
              onChange={(e) => setFormData({...formData, date: new Date(e.target.value)})}
            />
            
            <Input
              label="Giờ làm việc"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
            />
            
            <Box>
              <Text size="small" className="mb-2 text-gray-600">Số nhân viên:</Text>
              <List>
                {[1,2,3,4,5].map(num => (
                  <List.Item
                    key={num}
                    title={`${num} nhân viên`}
                    suffix={
                      <input
                        type="radio"
                        name="staff"
                        value={num}
                        checked={formData.staff === num}
                        onChange={(e) => setFormData({...formData, staff: parseInt(e.target.value)})}
                        className="w-5 h-5"
                      />
                    }
                    onClick={() => setFormData({...formData, staff: num})}
                  />
                ))}
              </List>
            </Box>
          </Box>
        </Box>

        {/* Notes */}
        <Box className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <Text bold className="mb-3">📝 Ghi chú</Text>
          <Input
            placeholder="Ghi chú thêm về yêu cầu..."
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
        </Box>

        {/* Terms */}
        <Box className="bg-gray-50 rounded-lg p-4 mb-6">
          <Box className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
              className="w-5 h-5 mt-1"
            />
            <Text size="small" className="text-gray-700 leading-relaxed">
              Tôi đồng ý với <span className="text-blue-600 font-medium">điều khoản sử dụng</span> và 
              <span className="text-blue-600 font-medium"> chính sách bảo mật</span> của NS Care
            </Text>
          </Box>
        </Box>

        {/* Submit Buttons */}
        <Box className="space-y-3">
          <Button 
            type="primary" 
            fullWidth 
            size="large"
            onClick={handleSubmit}
            disabled={!formData.agreeTerms}
          >
            🎯 Đặt lịch ngay (ZMP UI)
          </Button>
          
          <Link to="/">
            <Button type="secondary" fullWidth>
              ← Về trang chủ
            </Button>
          </Link>
        </Box>

        {/* ZMP Info */}
        <Box className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <Text size="small" className="text-center text-gray-600">
            ✨ Form này sử dụng ZMP UI Components
          </Text>
          <Text size="xSmall" className="text-center text-gray-500 mt-1">
            Native Zalo Mini App styling với performance tối ưu
          </Text>
        </Box>

      </Box>
    </Page>
  );
}