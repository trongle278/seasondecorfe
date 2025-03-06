"use client";

import { useRouter } from "next/navigation";
import Heading from "./ui/Modals/components/Heading";
import Button from "./ui/Buttons/Button";

const EmptyState = ({ title, subtitle, showBtn, label, icon, linkTo= "" }) => {
  const router = useRouter();
  return (
    <div className="col-span-full flex flex-col items-center justify-center w-full h-60 gap-10">
      <Heading center title={title} subtitle={subtitle} />
      <div>
        {showBtn && (
          <Button
            outline
            className="bg-primary"
            label={label}
            onClick={() => router.push(linkTo)}
            icon={icon}
          />
        )}
      </div>
    </div>
  );
};

export default EmptyState;
