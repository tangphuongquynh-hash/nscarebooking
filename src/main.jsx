import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { login } from "zmp-sdk";
import "./index.css";
import "./App.css";
import "zmp-ui/zaui.css"; // ZMP UI styles

// Minimal Error Boundary to display errors instead of a white screen
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("🛑 Uncaught error in React tree:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h2>Có lỗi xảy ra — vui lòng kiểm tra console</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function Root() {
  useEffect(() => {
    if (window.ZaloMiniApp) {
      login({
        scopes: ["user:phone", "user:profile"],
        success: (res) => {
          const { user_info } = res;
          if (user_info) {
            localStorage.setItem("zalo_name", user_info.name || "");
            localStorage.setItem("zalo_phone", user_info.phone || "");
            localStorage.setItem("zalo_uid", user_info.id || "");
            console.log("🟢 Lấy info từ Zalo thành công:", user_info);
          }
        },
        fail: (err) => console.warn("⚠️ Zalo login thất bại:", err),
      });
    } else {
      console.log("🌐 Chạy ngoài Mini App — bỏ qua login test");
    }
  }, []);

  return (
    <HashRouter>
      <App />
    </HashRouter>
  );
}

// Ensure root element exists to avoid createRoot(null) crash in some embed environments
let rootEl = document.getElementById("root");
if (!rootEl) {
  rootEl = document.createElement("div");
  rootEl.id = "root";
  document.body.appendChild(rootEl);
  console.warn("⚠️ Created missing #root element dynamically");
}

try {
  ReactDOM.createRoot(rootEl).render(
    <ErrorBoundary>
      <Root />
    </ErrorBoundary>
  );
} catch (err) {
  // Last-resort catch to prevent white screen and surface the error in console
  console.error("Fatal error while mounting React app:", err);
  if (rootEl) {
    rootEl.innerHTML = `
      <div style="padding:24px;font-family:system-ui,Arial,sans-serif;">
        <h2>Ứng dụng bị lỗi khi khởi động</h2>
        <pre style="white-space:pre-wrap;">${String(err)}</pre>
        <p>Kiểm tra console để biết chi tiết.</p>
      </div>
    `;
  }
}