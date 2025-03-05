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
    <div className="col-span-full flex items-center justify-center w-full h-60">
      <Heading center title={title} subtitle={subtitle} />
    </div>
  );
};

export default EmptyState;
