"use client";

import { useTheme } from "next-themes";


const Button = ({ onClick, icon, label, disabled, isLoading, link }) => {
  const { resolvedTheme } = useTheme();

  if (!resolvedTheme) {
    // Prevent rendering until theme is resolved
    return null;
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={` flex flex-row items-center rounded-md border px-4 py-2 text-sm transition duration-200 ${
        disabled
          ? "cursor-not-allowed border-gray-400 bg-gray-200 text-gray-400"
          : resolvedTheme === "dark"
          ? "border-white bg-black text-white hover:shadow-[4px_4px_0px_0px_rgba(255,255,255)]"
          : "border-black bg-white text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
      }`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </button>
  );
};

export default Button;
