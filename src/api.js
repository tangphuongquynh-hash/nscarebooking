const API_URL = "https://nscare-backend.onrender.com/api"; // backend của chị trên Render

export async function createBooking(data) {
  const res = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create booking");
  return await res.json();
}

export async function getBookings() {
  const res = await fetch(`${API_URL}/bookings`);
  return await res.json();
}