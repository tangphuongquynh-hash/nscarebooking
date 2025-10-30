import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { ThemedContainer, ThemedButton, ThemedText, ThemedCard } from "../components/ThemeComponents";
import FloatingHourlyBookingButton from "../components/FloatingHourlyBookingButton";
import ZNSTestPanel from "../components/ZNSTestPanel";
import AuthDebugPanel from "../components/AuthDebugPanel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const { theme } = useTheme();
  const { user, isAdmin, isLoading } = useAuth();
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Helper component: try to load /public/icons/{name}.png, fallback to emoji
  function IconOrEmoji({ name, emoji, alt }) {
    const [imgError, setImgError] = useState(false);
    if (imgError) {
      return <div className="text-4xl mb-1">{emoji}</div>;
    }
    return (
      <img
        src={`/icons/${name}.png`}
        alt={alt}
        className="w-14 h-14 sm:w-12 md:w-14 mx-auto mb-1 object-contain"
        onError={() => setImgError(true)}
      />
    );
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 3000); // 3 giây đổi hình
    return () => clearInterval(interval);
  }, [banners.length]);

  useEffect(() => {
    const savedBanners = JSON.parse(localStorage.getItem("bannerImages")) || [
      "/banner1.png",
      "/banner2.png",
      "/banner3.png",
    ];
    setBanners(savedBanners);
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  const customerName = "Vicky";

  return (
    <ThemedContainer variant="main" className="min-h-screen p-4 pb-20">
      {/* Auth Status Display - For Testing */}
      <ThemedCard className="p-3 mb-4 border-2 border-blue-300">
        <div className="flex justify-between items-center">
          <div>
            <ThemedText size="sm" className="font-semibold">
              🔐 Auth Status
            </ThemedText>
            {isLoading ? (
              <ThemedText size="xs" className="text-blue-500">🔄 Loading...</ThemedText>
            ) : user ? (
              <div>
                <ThemedText size="xs">👤 {user.name} ({user.phone})</ThemedText>
                <ThemedText size="xs" className={isAdmin ? "text-green-600" : "text-gray-600"}>
                  {isAdmin ? "👑 Admin Access" : "👤 Regular User"}
                </ThemedText>
              </div>
            ) : (
              <ThemedText size="xs" className="text-red-500">❌ Not logged in</ThemedText>
            )}
          </div>
          <div className="flex gap-1">
            {/* Force Admin Test Buttons */}
            {!isAdmin ? (
              <ThemedButton 
                size="sm" 
                variant="accent"
                onClick={() => {
                  localStorage.setItem('forceAdmin', 'true');
                  window.location.reload();
                }}
              >
                👑 Test Admin
              </ThemedButton>
            ) : (
              <>
                <ThemedButton 
                  size="sm" 
                  variant="muted"
                  onClick={() => {
                    localStorage.removeItem('forceAdmin');
                    window.location.reload();
                  }}
                >
                  � Reset
                </ThemedButton>
                <Link to="/admin">
                  <ThemedButton size="sm" variant="primary">
                    🧭 Admin
                  </ThemedButton>
                </Link>
              </>
            )}
          </div>
        </div>
      </ThemedCard>

      {/* Banner */}
      <section className="mb-6">
        <div
          className="relative w-full overflow-hidden rounded-xl shadow-md"
          style={{ aspectRatio: "2 / 1" }}
        >
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {banners.map((banner, idx) => (
              <img
                key={idx}
                src={banner}
                alt={`Banner ${idx + 1}`}
                className="w-full flex-shrink-0 object-cover"
              />
            ))}
          </div>

          {/* Dấu chấm chỉ slide */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5">
            {banners.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? "bg-teal-500 w-4" : "bg-gray-300"
                }`}
              ></span>
            ))}
          </div>
        </div>
      </section>

      {/* Points display */}
      <section className="mb-6">
        <ThemedCard 
          className="p-6 text-center"
          style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <div className="flex flex-col items-center justify-center">
            {/* Greeting */}
            <ThemedText variant="primary" size="lg" className="font-semibold mb-2">
              {user ? (
                <>👋 Xin chào, {user.name || "Khách hàng"}!</>
              ) : (
                <>🎉 Chào mừng bạn đến với NS CARE!</>
              )}
            </ThemedText>
            
            <div className="text-4xl mb-3">⭐</div>
            <ThemedText variant="primary" size="xl" className="font-semibold mb-1">
              Số điểm của bạn
            </ThemedText>
            <ThemedText variant="muted" size="sm" className="mb-3">
              Your loyalty points
            </ThemedText>
            <ThemedText variant="accent" size="3xl" className="font-bold">
              120
            </ThemedText>
          </div>
        </ThemedCard>
      </section>

      {/* Other services */}
      <ThemedCard className="p-4 mb-6">
        <ThemedText variant="primary" size="lg" className="font-semibold mb-3">
          Các dịch vụ khác | Other services
        </ThemedText>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[{
            key: 'industrial-cleaning', 
            gradient: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', 
            emoji: '🏢', 
            title: 'Vệ sinh công nghiệp', 
            sub: 'Industrial cleaning'
          },{
            key: 'curtain-sofa-cleaning', 
            gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', 
            emoji: '🛋️', 
            title: 'Giặt rèm, thảm, sofa', 
            sub: 'Curtain, carpet, sofa cleaning'
          },{
            key: 'ac-cleaning', 
            gradient: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', 
            emoji: '❄️', 
            title: 'Vệ sinh máy lạnh', 
            sub: 'AC cleaning'
          },{
            key: 'washing-machine-cleaning', 
            gradient: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)', 
            emoji: '🧺', 
            title: 'Vệ sinh máy giặt', 
            sub: 'Washing machine cleaning'
          },{
            key: 'hard-spot-cleaning', 
            gradient: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', 
            emoji: '🧽', 
            title: 'Tẩy vẩy cá kính', 
            sub: 'Hard spot cleaning'
          },{
            key: 'tea-lady', 
            gradient: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)', 
            emoji: '🍵', 
            title: 'Tea Lady', 
            sub: 'Tea Lady'
          },{
            key: 'office-cleaning', 
            gradient: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', 
            emoji: '🏢', 
            title: 'Vệ sinh văn phòng', 
            sub: 'Office Cleaning'
          },{
            key: 'full-house-cleaning', 
            gradient: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', 
            emoji: '🏠', 
            title: 'Tổng vệ sinh nhà', 
            sub: 'Full house cleaning'
          }].map(item => (
            <Link key={item.key} to="/other-booking">
              <ThemedCard 
                hover 
                className="p-3 h-full flex flex-col justify-between"
                style={{
                  background: item.gradient,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div className="flex-grow flex items-start justify-center pt-2">
                  <IconOrEmoji name={item.key} emoji={item.emoji} alt={item.title} />
                </div>
                <div className="mt-2 text-center pb-1">
                  <ThemedText variant="primary" size="sm" className="leading-tight font-medium">
                    {item.title}
                  </ThemedText>
                  <ThemedText variant="muted" size="xs">
                    {item.sub}
                  </ThemedText>
                </div>
              </ThemedCard>
            </Link>
          ))}
        </div>
      </ThemedCard>

      {/* Floating Hourly Booking Button */}
      <FloatingHourlyBookingButton />
      
      {/* Test Panels for Development & Testing */}
      <ZNSTestPanel />
      <AuthDebugPanel />
      
      {/* Test Status Display */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 left-4 z-50">
          <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded text-xs">
            🧪 Test Mode: ZNS + Auth Ready
          </div>
        </div>
      )}
    </ThemedContainer>
  );
}