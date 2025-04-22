"use client";

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

  switch (status) {
    case 0:
      if (isService) {
        statusClass = "bg-green text-white";
        label = "Available";
      } else {
        statusClass = "bg-yellow text-yellow-800";
        label = "Pending";
      }
      break;
    case 1:
      if (isService) {
        statusClass = "bg-red text-white";
        label = "Unavailable";
      } else if (isBooking) {
        statusClass = "bg-primary text-white";
        label = "Planning";
      } else if (isQuotation) {
        statusClass = "bg-green text-white";
        label = "Confirmed";
      } else {
        statusClass = "bg-green text-white";
        label = "Paid";
      }
      break;

    case 2:
      statusClass = "bg-yellow";
      label = "Quoting";
      break;
    case 3:
      if (isBooking) {
        statusClass = "bg-gray-300 text-gray-800";
        label = "Contracting";
      } else {
        statusClass = "bg-yellow";
        label = "Quotation";
      }
      break;

    case 4:
      if (isBooking) {
        statusClass = "bg-green text-white";
        label = "Confirmed";
      } else {
        statusClass = "bg-green text-white";
        label = "Paid";
      }
      break;
    case 5:
      if (isBooking) {
        statusClass = "bg-green text-white";
        label = "Deposit Paid";
      } else {
        statusClass = "bg-red text-white";
        label = "Failed";
      }
      break;
    case 11:
      statusClass = "bg-yellow";
      label = "Pending Cancel";
      break;
    case 12:
      statusClass = "bg-red text-white";
      label = "Cancelled";
      break;
    default:
      statusClass = "bg-gray-300 text-gray-800";
      label = "Unknown";
  }

  return (
    <div
      className={clsx(
        `px-3 py-1 rounded-md text-sm font-medium ${statusClass} w-fit flex items-center justify-center gap-2 shadow-sm`,
        className
      )}
    >
      {label}
    </div>
  );
};
export default StatusChip;
