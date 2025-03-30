"use client";

import { FootTypo } from "@/app/components/ui/Typography";
import { MdEmail, MdPhone, MdLocationOn, MdStore, MdDescription } from "react-icons/md";

const HomeTab = ({ phone, address, bio }) => {
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold mb-6  pb-2">Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        
        <InfoItem 
          icon={<MdPhone size={20}  />}
          label="Phone Number"
          value={phone || "Not provided"}
        />
        
        <InfoItem 
          icon={<MdLocationOn size={20}  />}
          label="Address"
          value={address || "Not provided"}
        />
      </div>
      
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-2">
          <MdDescription size={20} />
          <FootTypo
            footlabel="Bio"
            className="!m-0 text-lg font-semibold"
          />
        </div>
        <div className="whitespace-pre-line">
          <FootTypo
            footlabel={bio || "No bio provided."}
            className="!m-0 whitespace-pre-line"
          />
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex flex-col">
    <div className="flex items-center gap-2 my-3">
      {icon}
      <FootTypo
        footlabel={label}
        className="!m-0 text-sm font-medium text-gray-600 dark:text-gray-300"
      />
    </div>
    <FootTypo
      footlabel={value}
      className="!m-0 text-lg font-semibold ml-6"
    />
  </div>
);

export default HomeTab;
