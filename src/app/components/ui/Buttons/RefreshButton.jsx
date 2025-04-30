"use client";

import React, { useState } from "react";
import { IoRefresh } from "react-icons/io5";
import { motion } from "framer-motion";
import { Tooltip } from "@mui/material";

/**
 * RefreshButton component for refetching API data
 * @param {function} onRefresh - Function to call when refresh button is clicked
 * @param {boolean} isLoading - Whether the refresh action is in progress
 * @param {string} tooltip - Optional tooltip text
 * @param {string} className - Additional CSS classes
 */
const RefreshButton = ({
  onRefresh,
  isLoading = false,
  tooltip = "Refresh data",
  className = "",
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (isLoading || isAnimating) return;

    setIsAnimating(true);
    // Call the refetch function
    onRefresh();

    // Reset animation after a period (should match the animation duration)
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  return (
    <Tooltip title={tooltip} arrow placement="top">
      <button
        onClick={handleClick}
        disabled={isLoading || isAnimating}
        className={`flex items-center justify-center gap-2 rounded-full px-3 py-2 transition-all hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none ${className}`}
        aria-label="Refresh data"
      >
        <motion.div
          animate={isAnimating || isLoading ? { rotate: 360 } : { rotate: 0 }}
          transition={{
            duration: 1,
            ease: "easeInOut",
            repeat: isLoading ? Infinity : 0,
          }}
        >
          <IoRefresh
            size={20}
            className={`${isLoading ? "text-primary" : ""}`}
          />
        </motion.div>
        <span className="text-sm font-medium">Refresh</span>
      </button>
    </Tooltip>
  );
};

export default RefreshButton;
