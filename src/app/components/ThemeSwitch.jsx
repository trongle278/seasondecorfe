"use client";

import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "next-themes";
import IconButton from "@mui/material/IconButton";

export default function ThemeSwitch() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <>
      {resolvedTheme === "dark" ? (
        <IconButton  onClick={() => setTheme("light")}>
          <FiSun
            size={25}
            color="#fff"
            className={`rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-yellow-500 text-yellow-400`}
          />
        </IconButton>
      ) : (
        <IconButton onClick={() => setTheme("dark")}>
          <FiMoon
            size={25}
            className={`rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-gray-800 text-gray-600`}
          />
        </IconButton>
      )}
    </>
  );
}
