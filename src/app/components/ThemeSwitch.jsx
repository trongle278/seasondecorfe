"use client";

import { useState, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "next-themes";
import IconButton from "@mui/material/IconButton";

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>Loading icon</>
    );
  }


  return (
    <>
      {resolvedTheme === "dark" ? (
        <IconButton onClick={() => setTheme("light")} className="dark:hover:bg-zinc-700">
          <FiSun
            size={20}
            color="#fff"
            className={`rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-yellow-500 text-yellow-400`}
          />
        </IconButton>
      ) : (
        <IconButton onClick={() => setTheme("dark")} className="dark:hover:bg-zinc-700">
          <FiMoon
            size={20}
            className={`rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-gray-800 text-gray-600`}
          />
        </IconButton>
      )}
    </>
  );
}
