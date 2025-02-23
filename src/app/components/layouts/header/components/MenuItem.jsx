"use client";

import React from "react";

const MenuItem = ({ onClick, label, icon, closeMenu }) => {

  const handleClick = () => {
   onClick();
   closeMenu();

  };
  return (
    <div
      onClick={handleClick}

      className="px-4 py-3 hover:bg-neutral-300 transition font-semibold flex flex-row items-center"
    >
      <p className="mr-3">{icon}</p>
      {label}
    </div>
  );
};

export default MenuItem;
