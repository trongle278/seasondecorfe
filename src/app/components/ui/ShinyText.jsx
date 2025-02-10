"use client"

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ShinyText = ({ text, disabled = false, speed = 5, className = '' }) => {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); 
  }, []);

  if (!isMounted) return <span className={className}>{text}</span>; 

  const textColor = theme === "light" ? "#333" : "#b5b5b5a4";
  const shimmerColor = theme === "light"
    ? "linear-gradient(120deg, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, 0) 60%)"
    : "linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)";

  return (
    <div
      className={`inline-block ${disabled ? '' : 'animate-shine'} ${className}`}
      style={{
        color: textColor,
        backgroundImage: shimmerColor,
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        animationDuration: `${speed}s`,
      }}
    >
      {text}
    </div>
  );
};

  
  export default ShinyText;
  