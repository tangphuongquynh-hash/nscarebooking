const API_URL = "https://nscare-backend.onrender.com/api"; // backend của chị trên Render

// Mock data for comprehensive testing
const MOCK_BOOKINGS = [
  {
    id: 1,
    name: "Tăng Thị Phương Quynh",
    phone: "0909123456",
    service: "Tổng vệ sinh nhà",
    date: "30/10/2025",
    time: "14:30",
    address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
    status: "pending",
    type: "hourly",
    hours: 4,
    staff: 2,
    total: 800000,
    points: 40,
    note: "Cần vệ sinh kỹ phòng khách và bếp"
  },
  {
    id: 2,
    name: "Nguyễn Văn Nam",
    phone: "0987654321",
    service: "Vệ sinh điều hòa",
    date: "31/10/2025", 
    time: "09:00",
    address: "456 Lê Văn Việt, Quận 9, TP.HCM",
    status: "confirmed",
    type: "other",
    duration: 2,
    staff: 1,
    total: 600000,
    points: 30,
    note: "2 máy điều hòa"
  },
  {
    id: 3,
    name: "Lê Thị Mai",
    phone: "0912345678",
    service: "Vệ sinh văn phòng",
    date: "01/11/2025",
    time: "08:00", 
    address: "789 Võ Văn Tần, Quận 3, TP.HCM",
    status: "completed",
    type: "other",
    area: 100,
    staff: 3,
    total: 5000000,
    points: 250,
    note: "Văn phòng 100m², cần vệ sinh định kỳ hàng tuần"
  },
  {
    id: 4,
    name: "Trần Văn Đức", 
    phone: "0898765432",
    service: "Giặt rèm, sofa",
    date: "02/11/2025",
    time: "13:30",
    address: "321 Nguyễn Thị Minh Khai, Quận 1, TP.HCM", 
    status: "cancelled",
    type: "other",
    duration: 1,
    staff: 2,
    total: 500000,
    points: 25,
    note: "1 bộ sofa 3 chỗ ngồi"
  },
  {
    id: 5,
    name: "Phạm Thị Lan",
    phone: "0901234567",
    service: "Tổng vệ sinh nhà",
    date: "03/11/2025",
    time: "10:00",
    address: "654 Cách Mạng Tháng 8, Quận 10, TP.HCM",
    status: "pending", 
    type: "hourly",
    hours: 6,
    staff: 3,
    total: 1200000,
    points: 60,
    note: "Nhà 2 tầng, cần vệ sinh tổng thể"
  }
];

export async function createBooking(data) {
  try {
    console.log('📝 Creating booking:', data);
    
    // Try real API first
    const res = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.log('⚠️ API unavailable, using mock response');
  }
  
  // Fallback to mock response
  const newBooking = {
    ...data,
    id: Date.now(),
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  console.log('✅ Mock booking created:', newBooking);
  return newBooking;
}

export async function getBookings() {
  try {
    console.log('📊 Fetching bookings from API...');
    const res = await fetch(`${API_URL}/bookings`);
    
    if (res.ok) {
      const data = await res.json();
      console.log('✅ API bookings loaded:', data.length);
      return data;
    }
  } catch (error) {
    console.log('⚠️ API unavailable, using mock data');
  }
  
  // Fallback to mock data
  console.log('📋 Using mock bookings:', MOCK_BOOKINGS.length);
  return MOCK_BOOKINGS;
}