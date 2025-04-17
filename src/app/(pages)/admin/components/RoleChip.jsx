"use client";

import clsx from "clsx";
import { FaUser } from "react-icons/fa";
import { FaUserShield } from "react-icons/fa";


const RoleChip = ({
  status,
  className,
}) => {
  let statusClass;
  let label;
  let icon;

  switch (status) {
    case 2:
      statusClass = "bg-primary";
      label = "Provider";
      icon = <FaUserShield />;
      break;
    case 3:
      statusClass = "bg-lightGrey";
      label = "Customer";
      icon = <FaUser/>;
      break;
    default:
      statusClass = "bg-gray";
      label = "Unknown";
  }

  return (
    <div
      className={clsx(
        `px-2 py-1 rounded-full text-white text-sm text-center font-bold ${statusClass} w-fit flex items-center justify-center gap-2`,
        className
      )}
    >
      {icon}
      {label}
    </div>
  );
};
export default RoleChip;
