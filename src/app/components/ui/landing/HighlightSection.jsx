"use client";

import { SiAdguard } from "react-icons/si";
import { IoPricetagsSharp } from "react-icons/io5";
import { MdContactSupport } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi";


const HighlightSection = () => {
  return (
    <div className="relative mt-10">
      <div className="block sm:hidden absolute h-full w-20 bg-white dark:bg-black right-0 [mask-image:linear-gradient(to_left,white,transparent)] z-40"></div>
      <div
        className="flex  justify-start items-center mb-4 overflow-x-auto relative z-20 no-visible-scrollbar gap-5 "
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex items-center space-x-2 mr-4">
          <span>
            <SiAdguard size={20} />
          </span>
          <span className="text-sm font-semibold text-neutral-500 flex-shrink-0">
            Credibility
          </span>
        </div>
        <div className="flex items-center space-x-2 mr-4">
          <span>
            <IoPricetagsSharp size={20} />
          </span>
          <span className="text-sm font-semibold text-neutral-500 flex-shrink-0">
            Reasonable price
          </span>
        </div>
        <div className="flex items-center space-x-2 mr-4">
          <span>
            <HiUserGroup size={20} />
          </span>
          <span className="text-sm font-semibold text-neutral-500 flex-shrink-0">
            Big community
          </span>
        </div>
        <div className="flex items-center space-x-2 mr-4">
          <span>
            <MdContactSupport size={20} />
          </span>
          <span className="text-sm font-semibold text-neutral-500 flex-shrink-0">
            24/7 Support
          </span>
        </div>
      </div>
    </div>
  );
};
export default HighlightSection;