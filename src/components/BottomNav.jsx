import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, Globe, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import SmartWebViewer from "./SmartWebViewer";

function BottomNav() {
  const location = useLocation();
  const { isAdmin } = useAuth();
  const [showWebsite, setShowWebsite] = useState(false);
  const [showZaloChat, setShowZaloChat] = useState(false);
  
  const navItems = [
    { path: "/", label: "Trang chủ", icon: <Home />, type: "route" },
    { path: "https://www.nscare.vn", label: "Website", icon: <Globe />, type: "website" },
    { 
      path: isAdmin ? "/admin" : null, 
      label: "", 
      icon: (
        <div className={`relative ${isAdmin ? "animate-pulse" : ""}`}>
          <img 
            src="/logo.png" 
            alt="NS CARE" 
            className={`w-8 h-8 object-contain ${isAdmin ? "border-2 border-teal-400 rounded-lg p-1 bg-teal-50" : "opacity-70"}`}
          />
          {isAdmin && (
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-teal-500 rounded-full animate-ping"></div>
          )}
        </div>
      ), 
      type: isAdmin ? "admin-route" : "logo" 
    },
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
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          } else if (item.type === "admin-route") {
            return (
              <Link
                key={idx}
                to={item.path}
                className="flex flex-col items-center justify-center text-sm hover:scale-105 transition-all duration-300 py-2"
              >
                {item.icon}
              </Link>
            );
          } else if (item.type === "logo") {
            // Logo cho non-admin users - không click được
            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-center text-sm text-gray-400 cursor-default py-2"
              >
                {item.icon}
              </div>
            );
          } else {
            return (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNavClick(item);
                }}
                className="flex flex-col items-center text-sm text-gray-500 hover:text-teal-600 transition-colors"
                type="button"
              >
                {item.icon}
                <span className="text-xs">{item.label}</span>
              </button>
            );
          }
        })}
      </nav>

      {/* Smart Website Viewer */}
      <SmartWebViewer
        isOpen={showWebsite}
        onClose={() => setShowWebsite(false)}
        url="https://www.nscare.vn"
        title="NS CARE Website"
      />

      {/* Smart Zalo Chat Viewer */}
      <SmartWebViewer
        isOpen={showZaloChat}
        onClose={() => setShowZaloChat(false)}
        url="https://zalo.me/25541911002217776"
        title="Zalo Chat - Tư vấn"
      />
    </>
  );
}

export default BottomNav;
