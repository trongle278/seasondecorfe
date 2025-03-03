"use client";

import { useRouter } from "next/navigation";
import Heading from "./ui/Modals/components/Heading";
import Button from "./ui/Buttons/Button";

const EmptyState = ({
  title ,
  subtitle ,
  showReset,
  label,
  button
}) => {
  const router = useRouter();
  return (
    <div className="h-[60vh] flex flex-col gap-2 justify-center items-center">
      <Heading center title={title} subtitle={subtitle} />
      <div className="w-48 ml-4">
        {showReset && (
          {button}
        )}
      </div>
    </div>
  );
};

export default EmptyState;
