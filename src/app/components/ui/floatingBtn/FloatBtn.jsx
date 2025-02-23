"use client";

import * as React from "react";
import { PiChats } from "react-icons/pi";

export const FloatBtn = () => {
  return (
    <div className="fixed bottom-0 right-20 z-[999999] overflow-hidden cursor-pointer">
      <div className="text-lg bg-primary font-semibold rounded-md px-4 py-2 flex items-center justify-center hover:bg-blue-600 transition duration-100 ease-ease-in shadow-lg">
        <span className="mr-2">
          <PiChats size={20} />
        </span>
        Chat
      </div>
    </div>
  );
};
