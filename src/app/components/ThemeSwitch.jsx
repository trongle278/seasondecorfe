"use client";

import { FiSun, FiMoon } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import IconButton from "@mui/material/IconButton";

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return <h1>error at theme</h1>;

  return (
    <IconButton>
      {resolvedTheme === "dark" ? (
        <FiSun
          size={25}
          color="#fff"

          onClick={() => setTheme("light")}
          className={`rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-yellow-500 text-yellow-400`}
        />
      ) : (
        <FiMoon
          size={25}
          onClick={() => setTheme("dark")}
          className={`rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-gray-800 text-gray-600`}
        />
      )}
    </IconButton>
  );
}
