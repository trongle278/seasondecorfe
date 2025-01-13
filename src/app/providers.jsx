"use client";

import { ThemeProvider } from "next-themes";
import { useState, useEffect, useRef } from "react";

export function Providers({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
     {children}
    </ThemeProvider>
  );
}
