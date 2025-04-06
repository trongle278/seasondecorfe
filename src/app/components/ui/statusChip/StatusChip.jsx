"use client";

import { FaCheck } from "react-icons/fa6";
import { TiCancel } from "react-icons/ti";
import { CgSpinner } from "react-icons/cg";
import { LiaSpinnerSolid } from "react-icons/lia";
import clsx from "clsx";

const StatusChip = ({
  status,
  className,
  isBooking = false,
  isService = false,
}) => {
  let statusClass;
  let label;
  let icon;

  switch (status) {
    case 0:
      statusClass = "bg-yellow";
      label = "Pending";
      icon = <CgSpinner className="animate-spin" size={20} />;
      break;
    case 1:
      if (isService) {
        statusClass = "bg-gray-500";
        label = "Not available";
      } else if (isBooking) {
        statusClass = "bg-primary";
        label = "Planning";
        icon = <LiaSpinnerSolid className="animate-spin" size={20} />;
      } else {
        statusClass = "bg-green";
        label = "Paid";
        icon = <FaCheck />;
      }
      break;

    case 2:
      statusClass = "bg-yellow";
      label = "Quotation";
      icon = <LiaSpinnerSolid className="animate-spin" size={20} />;
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
        `px-1 py-1 rounded-full text-white text-center font-bold ${statusClass} max-w-[120px] flex items-center justify-center gap-2`,
        className
      )}
    >
      {icon}
      {label}
    </div>
  );
};
export default StatusChip;
