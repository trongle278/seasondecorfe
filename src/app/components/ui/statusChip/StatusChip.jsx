"use client";

import { FaCheck } from "react-icons/fa6";
import { TiCancel } from "react-icons/ti";
import { CgSpinner } from "react-icons/cg";
import clsx from "clsx";

const StatusChip = ({ status, className }) => {
  let statusClass;
  let label;
  let icon;

  switch (status) {
    case 0:
      statusClass = "bg-yellow";
      label = "Pending";
      icon = <CgSpinner className="animate-spin" />;
      break;
    case 1:
      statusClass = "bg-green";
      label = "Paid";
      icon = <FaCheck />;
      break;
    case 3:
      statusClass = "bg-red";
      label = "Unsold";
      icon = <FaCheck />;
      break;
    case 5:
      statusClass = "bg-red";
      label = "Canceled";
      icon = <TiCancel />;
      break;
    default:
      statusClass = "bg-gray";
      label = "Unknown";
      icon = null;
  }

  return (
    <div
      className={clsx(
        `px-2 py-1 rounded-full text-white text-center font-bold ${statusClass} max-w-[120px] flex items-center justify-center gap-2`,
        className
      )}
    >
      {icon}
      {label}
    </div>
  );
};
export default StatusChip;
