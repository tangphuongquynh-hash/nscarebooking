import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { ThemedContainer, ThemedButton, ThemedText, ThemedCard } from "../../components/ThemeComponents";

export default function UISettings() {
  const { currentTheme, themes, changeTheme } = useTheme();
  const [banners, setBanners] = useState([null, null, null]);
  const [previews, setPreviews] = useState([null, null, null]);

  // Lấy dữ liệu đã lưu trước đó
  useEffect(() => {
    const savedBanners = JSON.parse(localStorage.getItem("bannerImages")) || [null, null, null];
    setPreviews(savedBanners);
  }, []);

  // Xử lý chọn file ảnh banner
  const handleBannerUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...previews];
        newPreviews[index] = reader.result;
        setPreviews(newPreviews);
        
        const newBanners = [...banners];
        newBanners[index] = file;
        setBanners(newBanners);
      };
      reader.readAsDataURL(file);
    }
  };

  // Xóa banner
  const removeBanner = (index) => {
    const newPreviews = [...previews];
    newPreviews[index] = null;
    setPreviews(newPreviews);
    
    const newBanners = [...banners];
    newBanners[index] = null;
    setBanners(newBanners);
  };

  // Lưu cấu hình
  const handleSave = () => {
    // Save banner images (keep existing ones if not changed)
    const currentBanners = JSON.parse(localStorage.getItem("bannerImages")) || [
      "/banner1.png", "/banner2.png", "/banner3.png"
    ];
    const updatedBanners = previews.map((preview, index) => 
      preview || currentBanners[index] || `/banner${index + 1}.png`
    );
    localStorage.setItem("bannerImages", JSON.stringify(updatedBanners));
    
    alert("✅ Cập nhật giao diện thành công! | UI updated successfully!");
  };

  return (
    <ThemedContainer variant="main" className="min-h-screen p-4 pb-24">
      <ThemedText variant="primary" size="2xl" className="font-bold text-center mb-6">
        🎨 Cài đặt giao diện | UI Settings
      </ThemedText>

      {/* Theme Selection */}
      <ThemedCard className="p-5 mb-6">
        <ThemedText variant="primary" size="lg" className="font-semibold mb-3">
          🌈 Chủ đề màu sắc | Color Theme
        </ThemedText>
        <ThemedText variant="muted" size="sm" className="mb-4">
          Chọn chủ đề màu sắc cho toàn bộ ứng dụng
        </ThemedText>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(themes).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => changeTheme(key)}
              className={`p-3 rounded-xl border-2 transition-all ${
                currentTheme === key 
                  ? 'border-blue-500 scale-105' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{ background: theme.background.light }}
            >
              <div className="h-8 rounded-lg mb-2" style={{ background: theme.button.primary }}></div>
              <ThemedText size="xs" className="font-medium">{theme.name}</ThemedText>
            </button>
          ))}
        </div>
      </ThemedCard>

      {/* Banners (3 slots) */}
      <ThemedCard className="p-5 mb-6">
        <ThemedText variant="primary" size="lg" className="font-semibold mb-3">
          🖼️ Ảnh banner (3 hình) | Banner Images (3 images)
        </ThemedText>
        <ThemedText variant="muted" size="sm" className="mb-4">
          Tải lên tối đa 3 hình ảnh banner. Để trống nếu muốn giữ ảnh mặc định.
        </ThemedText>
        
        <div className="space-y-4">
          {[0, 1, 2].map((index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Banner {index + 1}:
                </label>
                {previews[index] && (
                  <button
                    onClick={() => removeBanner(index)}
                    className="text-red-500 text-xs hover:text-red-700"
                  >
                    ✕ Xóa
                  </button>
                )}
              </div>
              
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleBannerUpload(e, index)}
                className="block w-full border border-gray-300 rounded-lg p-2 mb-2 text-sm"
              />
              
              {previews[index] && (
                <div className="text-center">
                  <img
                    src={previews[index]}
                    alt={`Banner ${index + 1} Preview`}
                    className="rounded-lg shadow-sm mx-auto w-full max-h-32 object-cover"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </ThemedCard>

      {/* Nút lưu */}
      <ThemedButton
        onClick={handleSave}
        className="w-full py-3"
        size="lg"
      >
        💾 Lưu thay đổi | Save Changes
      </ThemedButton>
    </ThemedContainer>
  );
}