"use client";

import * as React from "react";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useState, useEffect } from "react";
import {
  FaSnowflake,
  FaLeaf,
  FaSun,
  FaCanadianMapleLeaf,
} from "react-icons/fa";
import { MdCelebration } from "react-icons/md";
import { GiPartyPopper } from "react-icons/gi";

// Map of season names to icons
const seasonIcons = {
  Winter: <FaSnowflake />,
  Spring: <FaLeaf />,
  Summer: <FaSun />,
  Fall: <FaCanadianMapleLeaf />,
  Autumn: <FaCanadianMapleLeaf />,
  Christmas: <FaSnowflake />,
  "New Year": <GiPartyPopper />,
  Valentine: <MdCelebration />,
  Halloween: <MdCelebration />,
  Thanksgiving: <MdCelebration />,
  Easter: <MdCelebration />,
  Birthday: <GiPartyPopper />,
  Wedding: <MdCelebration />,
  Anniversary: <MdCelebration />,
};

const getSeasonIcon = (seasonName) => {
  if (seasonIcons[seasonName]) {
    return seasonIcons[seasonName];
  }

  // Try case-insensitive match
  const lowerName = seasonName.toLowerCase();
  for (const [key, icon] of Object.entries(seasonIcons)) {
    if (
      key.toLowerCase().includes(lowerName) ||
      lowerName.includes(key.toLowerCase())
    ) {
      return icon;
    }
  }

  // Default icon if no match
  return <MdCelebration />;
};

const MultiSelectChip = ({
  options = [],
  onChange,
  defaultSelected = [],
  label = "Select options",
}) => {
  const [selectedItems, setSelectedItems] = useState(defaultSelected);

  useEffect(() => {
    // Notify parent component when selections change
    if (onChange) {
      onChange(selectedItems);
    }
  }, [selectedItems, onChange]);

  const handleToggle = (id) => {
    setSelectedItems((prev) => {
      // If already selected, remove it
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      // Otherwise add it
      else {
        return [...prev, id];
      }
    });
  };

  return (
    <div>
      <p className="text-sm mb-2">{label}</p>
      <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
        {options.map((option) => (
          <Chip
            key={option.id}
            icon={getSeasonIcon(option.name)}
            label={option.name}
            onClick={() => handleToggle(option.id)}
            color={selectedItems.includes(option.id) ? "primary" : "default"}
            variant={selectedItems.includes(option.id) ? "filled" : "outlined"}
            sx={{ margin: "4px", padding: "4px", color: "#5fc1f1"  }}
          />
        ))}
      </Stack>
    </div>
  );
};

export default MultiSelectChip;
