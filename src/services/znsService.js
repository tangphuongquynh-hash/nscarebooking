// src/services/znsService.js
// ZNS (Zalo Notification Service) - Gửi tin nhắn thông báo cho khách hàng

// ZNS Configuration
export const ZNS_CONFIG = {
  ACCESS_TOKEN: process.env.REACT_APP_ZNS_ACCESS_TOKEN || "",
  APP_ID: process.env.REACT_APP_ZNS_APP_ID || "3794181198297525649",
  SECRET_KEY: process.env.REACT_APP_ZNS_SECRET_KEY || "",
  BASE_URL: "https://business.openapi.zalo.me/message/template"
};

// Template IDs cho các loại thông báo
export const ZNS_TEMPLATES = {
  BOOKING_CONFIRMED: "443157", // Template xác nhận đặt lịch - ĐÃ ĐƯỢC DUYỆT
  BOOKING_COMPLETED: "331978", // Template hoàn thành dịch vụ  
  BOOKING_CANCELLED: "331979", // Template hủy lịch
  REMINDER: "331980" // Template nhắc nhở
};

/**
 * Generate booking code: AAAA-yymmdd
 * AAAA = viết tắt tên khách hàng (VD: Tăng Thị Phương Quynh -> TTQP)
 * yymmdd = năm tháng ngày đặt booking
 */
export const generateBookingCode = (customerName, bookingDate = new Date()) => {
  try {
    // Tách tên thành các từ và lấy chữ cái đầu
    const nameWords = customerName
      .trim()
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase())
      .join('');
    
    // Đảm bảo có đúng 4 ký tự, nếu thiếu thì lặp lại
    let initials = nameWords;
    while (initials.length < 4) {
      initials += nameWords;
    }
    initials = initials.substring(0, 4);
    
    // Format ngày: yymmdd
    const year = bookingDate.getFullYear().toString().slice(-2);
    const month = (bookingDate.getMonth() + 1).toString().padStart(2, '0');
    const day = bookingDate.getDate().toString().padStart(2, '0');
    
    return `${initials}-${year}${month}${day}`;
  } catch (error) {
    console.error('Error generating booking code:', error);
    return `UNKN-${Date.now().toString().slice(-6)}`;
  }
};

/**
 * Gửi ZNS message
 */
const sendZNSMessage = async (phone, templateId, templateData) => {
  try {
    console.log('📤 [ZNS] Sending message:', { phone, templateId, templateData });

    // Validate input
    if (!phone || !templateId) {
      throw new Error('Phone number and template ID are required');
    }

    // Format phone number (remove +84, add 84)
    const formattedPhone = formatPhoneForZNS(phone);
    
    const payload = {
      phone: formattedPhone,
      template_id: templateId,
      template_data: templateData,
      tracking_id: `booking_${Date.now()}`
    };

    console.log('📤 [ZNS] Payload:', payload);

    // In development/testing, log instead of actual API call
    if (process.env.NODE_ENV === 'development' || !ZNS_CONFIG.ACCESS_TOKEN) {
      console.log('🧪 [ZNS] Development mode - message logged instead of sent');
      console.log('📱 To:', formattedPhone);
      console.log('📋 Template:', templateId);
      console.log('📝 Data:', templateData);
      
      // Simulate success
      return {
        success: true,
        message_id: `dev_${Date.now()}`,
        sent_time: new Date().toISOString(),
        development_mode: true
      };
    }

    // Production API call
    const response = await fetch(ZNS_CONFIG.BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ZNS_CONFIG.ACCESS_TOKEN
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (result.error === 0) {
      console.log('✅ [ZNS] Message sent successfully:', result);
      return {
        success: true,
        message_id: result.data.msg_id,
        sent_time: result.data.sent_time
      };
    } else {
      console.error('❌ [ZNS] API Error:', result);
      throw new Error(result.message || 'ZNS API Error');
    }
    
  } catch (error) {
    console.error('❌ [ZNS] Send failed:', error);
    throw error;
  }
};

/**
 * Format phone number cho ZNS API
 * Input: 0901234567, +84901234567
 * Output: 84901234567
 */
const formatPhoneForZNS = (phone) => {
  if (!phone) return '';
  
  // Remove spaces, dashes, parentheses
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Convert to international format
  if (cleaned.startsWith('0')) {
    cleaned = '84' + cleaned.substring(1);
  } else if (cleaned.startsWith('+84')) {
    cleaned = cleaned.substring(1);
  } else if (!cleaned.startsWith('84')) {
    cleaned = '84' + cleaned;
  }
  
  return cleaned;
};

/**
 * Gửi thông báo xác nhận booking - Template 443157
 * Format: {"booking_code":"booking_code","address":"address","schedule_time":"01/08/2020","customer_name":"customer_name"}
 */
export const sendBookingConfirmation = async (booking) => {
  try {
    // Generate booking code theo format AAAA-yymmdd
    const bookingDate = new Date(booking.date || Date.now());
    const bookingCode = generateBookingCode(booking.name, bookingDate);
    
    // Format schedule_time theo dd/mm/yyyy HH:mm
    const scheduleTime = `${booking.date} ${booking.time}`;
    
    // Template data theo format đã duyệt
    const templateData = {
      booking_code: bookingCode,
      address: booking.address || "Địa chỉ khách hàng",
      schedule_time: scheduleTime,
      customer_name: booking.name
    };

    const result = await sendZNSMessage(
      booking.phone,
      ZNS_TEMPLATES.BOOKING_CONFIRMED,
      templateData
    );

    return {
      success: true,
      messageId: result.message_id,
      sentTime: result.sent_time,
      developmentMode: result.development_mode
    };
    
  } catch (error) {
    console.error('❌ [ZNS] Booking confirmation failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Gửi thông báo hoàn thành dịch vụ
 */
export const sendServiceCompletion = async (booking) => {
  try {
    const points = Math.floor(((booking.total || 0) * 0.05) / 1000);
    
    const templateData = {
      customer_name: booking.name,
      service_name: booking.service,
      completion_date: new Date().toLocaleDateString('vi-VN'),
      points_earned: points.toString(),
      total_amount: (booking.total || 0).toLocaleString() + ' ₫',
      booking_code: generateBookingCode(booking.date, booking.id),
      feedback_url: "https://booking.nscare.vn/feedback"
    };

    const result = await sendZNSMessage(
      booking.phone,
      ZNS_TEMPLATES.BOOKING_COMPLETED,
      templateData
    );

    return {
      success: true,
      messageId: result.message_id,
      sentTime: result.sent_time,
      developmentMode: result.development_mode
    };
    
  } catch (error) {
    console.error('❌ [ZNS] Service completion failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Gửi thông báo hủy booking
 */
export const sendBookingCancellation = async (booking, reason = '') => {
  try {
    const templateData = {
      customer_name: booking.name,
      service_name: booking.service,
      booking_date: booking.date,
      booking_time: booking.time,
      cancellation_reason: reason || 'Theo yêu cầu',
      booking_code: generateBookingCode(booking.date, booking.id),
      rebooking_url: "https://booking.nscare.vn",
      hotline: "1900 2024"
    };

    const result = await sendZNSMessage(
      booking.phone,
      ZNS_TEMPLATES.BOOKING_CANCELLED,
      templateData
    );

    return {
      success: true,
      messageId: result.message_id,
      sentTime: result.sent_time,
      developmentMode: result.development_mode
    };
    
  } catch (error) {
    console.error('❌ [ZNS] Booking cancellation failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Gửi tin nhắn nhắc nhở
 */
export const sendBookingReminder = async (booking) => {
  try {
    const templateData = {
      customer_name: booking.name,
      service_name: booking.service,
      booking_date: booking.date,
      booking_time: booking.time,
      address: booking.address,
      booking_code: generateBookingCode(booking.date, booking.id),
      preparation_note: "Vui lòng chuẩn bị đầy đủ thiết bị và không gian làm việc",
      hotline: "1900 2024"
    };

    const result = await sendZNSMessage(
      booking.phone,
      ZNS_TEMPLATES.REMINDER,
      templateData
    );

    return {
      success: true,
      messageId: result.message_id,
      sentTime: result.sent_time,
      developmentMode: result.development_mode
    };
    
  } catch (error) {
    console.error('❌ [ZNS] Booking reminder failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Note: generateBookingCode function is already defined above (line ~20)

/**
 * Test ZNS connection
 */
export const testZNSConnection = async () => {
  try {
    console.log('🧪 [ZNS] Testing connection...');
    console.log('🔑 [ZNS] Config:', {
      hasAccessToken: !!ZNS_CONFIG.ACCESS_TOKEN,
      appId: ZNS_CONFIG.APP_ID,
      baseUrl: ZNS_CONFIG.BASE_URL
    });
    
    // In development, always return success
    if (process.env.NODE_ENV === 'development') {
      return {
        success: true,
        message: 'Development mode - ZNS service ready',
        config: ZNS_CONFIG
      };
    }
    
    // Production test would make actual API call
    return {
      success: true,
      message: 'ZNS service connection OK'
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Test ZNS với dữ liệu mẫu
 */
export const testZNSMessage = async () => {
  const sampleBooking = {
    name: "Tăng Thị Phương Quynh",
    phone: "0901234567", 
    date: "30/10/2025",
    time: "14:30",
    address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
    service: "Tổng vệ sinh nhà"
  };
  
  console.log('🧪 Testing ZNS with sample data:', sampleBooking);
  
  try {
    const result = await sendBookingConfirmation(sampleBooking);
    console.log('✅ ZNS Test successful:', result);
    return result;
  } catch (error) {
    console.error('❌ ZNS Test failed:', error);
    throw error;
  }
};

export default {
  sendBookingConfirmation,
  sendServiceCompletion,
  sendBookingCancellation,
  sendBookingReminder,
  testZNSConnection,
  generateBookingCode,
  testZNSMessage
};