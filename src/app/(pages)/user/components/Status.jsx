"use client";

import clsx from "clsx";

const Status = ({ isDefault, className }) => {
  let statusClass;
  let label;

  if (isDefault) {
    statusClass = "bg-primary";
    label = "Default";
  } else {
    statusClass = "hidden";
    label = "Not Default";
  }

  return (
    <div
      className={clsx(
        `px-4 py-1 rounded-full text-center font-bold ${statusClass} max-w-[100px] mt-2`,
        className
      )}
    >
      {label}
    </div>
  );
};
export default Status;
