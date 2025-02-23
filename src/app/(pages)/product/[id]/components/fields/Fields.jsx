"use client";
import { FootTypo } from "@/app/components/ui/Typography";

export const Fields = ({ label, detail }) => {
  return (
    <div className="flex mb-4">
      <FootTypo
        footlabel={label}
        className="font-semibold w-36 pr-3 break-words !m-0"
      />
      <div className="flex items-center flex-nowrap">{detail}</div>
    </div>
  );
};
