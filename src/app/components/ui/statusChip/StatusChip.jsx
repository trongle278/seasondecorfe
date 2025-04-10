"use client";

import { FaCheck } from "react-icons/fa6";
import { TiCancel } from "react-icons/ti";
import { CgSpinner } from "react-icons/cg";
import { LiaSpinnerSolid } from "react-icons/lia";
import { GoDotFill } from "react-icons/go";
import { BsThreeDots } from "react-icons/bs";
import clsx from "clsx";

const StatusChip = ({
  status,
  className,
  isBooking = false,
  isService = false,
  isQuotation = false,
}) => {
  let statusClass;
  let label;
  let icon;

  switch (status) {
    case 0:
      if (isService) {
        statusClass = "bg-green";
        label = "Available";
        icon = <GoDotFill className="animate-ping" />;
      } else {
        statusClass = "bg-yellow";
        label = "Pending";
        icon = <CgSpinner className="animate-spin" size={20} />;
      }
      break;
    case 1:
      if (isService) {
        statusClass = "bg-red";
        label = "Not available";
      } else if (isBooking) {
        statusClass = "bg-primary";
        label = "Planning";
        icon = <LiaSpinnerSolid className="animate-spin" size={20} />;
      } else if (isQuotation) {
        statusClass = "bg-green";
        label = "Confirmed";
        icon = <FaCheck />;
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
      if (isBooking) {
        statusClass = "bg-lightGrey";
        label = "Contracting";
        icon = <BsThreeDots className="animate-pulse" size={20} />;
      } else {
        statusClass = "bg-yellow";
        label = "Quotation";
        icon = <LiaSpinnerSolid className="animate-spin" size={20} />;
      }
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
        `px-2 py-1 rounded-full text-white text-center font-bold ${statusClass} w-fit flex items-center justify-center gap-2`,
        className
      )}
    >
      {icon}
      {label}
    </div>
  );
};
export default StatusChip;
