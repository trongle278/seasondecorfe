"use client";

import ThemeSwitch from "@/app/components/ThemeSwitch";

const MinimalHeader = () => {
  return (
    <div className="relative overflow-visible">
      <div className="absolute right-0">
        <ThemeSwitch />
      </div>
    </div>
  );
};

export default MinimalHeader;