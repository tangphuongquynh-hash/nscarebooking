import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, PlusCircle, Globe, MessageCircle } from "lucide-react";
import { useState } from "react";
import InAppBrowser from "./InAppBrowser";

function BottomNav() {
  const location = useLocation();
  const [showWebsite, setShowWebsite] = useState(false);
  const [showZaloChat, setShowZaloChat] = useState(false);
  
  const navItems = [
    { path: "/", label: "Trang chủ", icon: <Home />, type: "route" },
    { path: "https://www.nscare.vn", label: "Website", icon: <Globe />, type: "website" },
    { path: "/hourly-booking", label: "Đặt lịch", icon: <PlusCircle />, type: "route" },
    { path: "/schedule", label: "Lịch hẹn", icon: <Calendar />, type: "route" },
    { path: "https://zalo.me/25541911002217776", label: "Tư vấn", icon: <MessageCircle />, type: "zalo" },
  ];

  const handleNavClick = (item) => {
    if (item.type === "website") {
      setShowWebsite(true);
    } else if (item.type === "zalo") {
      setShowZaloChat(true);
    }
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 shadow-md">
        {navItems.map((item, idx) => {
          if (item.type === "route") {
            return (
              <Link
                key={idx}
                to={item.path}
                className={`flex flex-col items-center text-sm ${location.pathname === item.path ? "text-teal-600" : "text-gray-500"}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          } else {
            return (
              <button
                key={idx}
                onClick={() => handleNavClick(item)}
                className="flex flex-col items-center text-sm text-gray-500 hover:text-teal-600 transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          }
        })}
      </nav>

      {/* In-App Website Browser */}
      <InAppBrowser
        isOpen={showWebsite}
        onClose={() => setShowWebsite(false)}
        initialUrl="https://www.nscare.vn"
        title="NS CARE Website"
      />

      {/* In-App Zalo Chat */}
      <InAppBrowser
        isOpen={showZaloChat}
        onClose={() => setShowZaloChat(false)}
        initialUrl="https://zalo.me/25541911002217776"
        title="Zalo Chat - Tư vấn"
      />
    </>
  );
}

export default BottomNav;
