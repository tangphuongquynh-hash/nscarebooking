import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, PlusCircle, Globe, MessageCircle } from "lucide-react";

function BottomNav() {
  const location = useLocation();
  const navItems = [
    { path: "/", label: "Trang chủ", icon: <Home /> },
    { path: "https://www.nscare.vn", label: "Website", icon: <Globe /> },
    { path: "/hourly-booking", label: "Đặt lịch", icon: <PlusCircle /> },
    { path: "/schedule", label: "Lịch hẹn", icon: <Calendar /> },
    { path: "https://zalo.me/25541911002217776", label: "Tư vấn", icon: <MessageCircle /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 shadow-md">
      {navItems.map((item, idx) =>
        item.path.startsWith("http") ? (
          <a
            key={idx}
            href={item.path}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col items-center text-sm ${location.pathname === item.path ? "text-teal-600" : "text-gray-500"}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        ) : (
          <Link
            key={idx}
            to={item.path}
            className={`flex flex-col items-center text-sm ${location.pathname === item.path ? "text-teal-600" : "text-gray-500"}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        )
      )}
    </nav>
  );
}

export default BottomNav;
