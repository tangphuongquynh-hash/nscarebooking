// Theme utility functions
export const getThemeColor = () => {
  return localStorage.getItem("themeColor") || "#91eae4";
};

export const getThemeGradient = () => {
  const color = getThemeColor();
  
  // Convert hex to RGB for gradient
  const r = parseInt(color.substr(1, 2), 16);
  const g = parseInt(color.substr(3, 2), 16);
  const b = parseInt(color.substr(5, 2), 16);
  
  // Create lighter version for gradient
  const lighterR = Math.min(255, r + 30);
  const lighterG = Math.min(255, g + 30);
  const lighterB = Math.min(255, b + 30);
  
  return `linear-gradient(to bottom, rgb(${lighterR}, ${lighterG}, ${lighterB}), #ffffff)`;
};

export const getThemeClasses = () => {
  const color = getThemeColor();
  
  // For simplicity, classify colors as warm or cool
  const r = parseInt(color.substr(1, 2), 16);
  const g = parseInt(color.substr(3, 2), 16);
  const b = parseInt(color.substr(5, 2), 16);
  
  // Simple heuristic: if red > green + blue, it's warm
  const isWarm = r > (g + b);
  
  return {
    gradient: isWarm 
      ? "from-red-100 to-orange-50" 
      : "from-teal-100 to-cyan-50",
    primary: isWarm ? "red" : "teal",
    textPrimary: isWarm ? "text-red-700" : "text-teal-700",
    bgPrimary: isWarm ? "bg-red-500" : "bg-teal-500",
    bgPrimaryHover: isWarm ? "hover:bg-red-600" : "hover:bg-teal-600",
    gradientPrimary: isWarm 
      ? "from-red-400 to-red-500" 
      : "from-teal-400 to-teal-500"
  };
};