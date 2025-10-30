// src/components/ZMPComponents.jsx
// Demo Zalo Mini App UI Components

import React, { useState } from 'react';
import {
  Page,
  Header,
  Box,
  Text,
  Button,
  Input,
  List
} from 'zmp-ui';

export default function ZMPComponents() {
  return (
    <Page>
      <Header title="ZMP UI Demo" showBackIcon={false} />
      
      <Box p={4} className="space-y-6">
        
        {/* Basic Demo */}
        <Box className="bg-white rounded-lg p-4 shadow">
          <Text size="large" bold className="mb-4">🎯 ZMP UI Components</Text>
          
          {/* Buttons */}
          <Box className="space-y-3 mb-6">
            <Text bold>Buttons:</Text>
            <Button type="primary" fullWidth>Primary Button</Button>
            <Button type="secondary" fullWidth>Secondary Button</Button>
            <Button type="danger" fullWidth>Danger Button</Button>
            <Button disabled fullWidth>Disabled Button</Button>
          </Box>

          {/* Form Inputs */}
          <Box className="space-y-3 mb-6">
            <Text bold>Form Inputs:</Text>
            <Input 
              label="Tên khách hàng"
              placeholder="Nhập họ tên"
            />
            <Input 
              label="Số điện thoại"
              type="tel"
              placeholder="0909123456"
            />
          </Box>

          {/* Lists */}
          <Box className="mb-6">
            <Text bold className="mb-3">Lists:</Text>
            <List>
              <List.Item 
                title="Tổng vệ sinh nhà"
                subtitle="30/10/2025 - 14:30"
              />
              <List.Item 
                title="Vệ sinh văn phòng" 
                subtitle="31/10/2025 - 09:00"
              />
              <List.Item
                title="Vệ sinh điều hòa"
                subtitle="01/11/2025 - 13:00"
              />
            </List>
          </Box>

          <Text size="small" className="text-gray-500 text-center">
            🎨 ZMP UI Components Demo - Native Zalo Mini App Styling
          </Text>
        </Box>
      </Box>
    </Page>
  );
}

// Export individual components for use in other files
export {
  Page,
  Header, 
  Box,
  Text,
  Button,
  Input,
  List
};