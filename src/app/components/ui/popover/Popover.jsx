"use client";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { CiViewList } from "react-icons/ci";
import { Badge } from "@mui/material";

const PopoverComponent = ({ buttonLabel, children, itemCount}) => {
  return (
    <Popover className="relative border rounded-lg p-2 hover:bg-primary hover:text-white transition-colors duration-200">
      <div className="relative">
        <PopoverButton className="flex items-center gap-2">
          <CiViewList size={20} />
          {buttonLabel}
        </PopoverButton>
        
        {itemCount > 0 && (
          <Badge 
            badgeContent={itemCount} 
            color="error" 
            sx={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              '& .MuiBadge-badge': {
                fontSize: '10px',
                minWidth: '18px',
                height: '20px',
                padding: '0 7px'
              }
            }}
          />
        )}
      </div>
      
      <PopoverPanel transition anchor="bottom end" className="w-[500px] h-[60vh] overflow-y-auto right-0 mt-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg origin-top transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0">
        {children}
      </PopoverPanel>
    </Popover>
  );
};

export default PopoverComponent;
