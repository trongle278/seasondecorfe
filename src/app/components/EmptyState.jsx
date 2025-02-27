"use client";

import { useRouter } from "next/navigation";
import Heading from "./Heading";
import Button from "./ui/Buttons/Button";

const EmptyState = ({
  title ,
  subtitle ,
  showReset,
  label,
  pathName
}) => {
  const router = useRouter();
  return (
    <div className="h-[60vh] flex flex-col gap-2 justify-center items-center">
      <Heading center title={title} subtitle={subtitle} />
      <div className="w-48 ml-4">
        {showReset && (
          <Button
            outline
            label={label}
            onClick={() => router.push({pathName})}
          />
        )}
      </div>
    </div>
  );
};

export default EmptyState;
