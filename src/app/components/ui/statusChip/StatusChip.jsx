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
        statusClass = "bg-green";
        label = "Available";
      } else {
        statusClass = "bg-yellow";
        label = "Pending";
      }
      break;
    case 1:
      if (isService) {
        statusClass = "bg-red";
        label = "Unavailable";
      } else if (isBooking) {
        statusClass = "bg-primary";
        label = "Planning";
      } else if (isQuotation) {
        statusClass = "bg-green";
        label = "Confirmed";
      } else {
        statusClass = "bg-green";
        label = "Paid";
      }
      break;

    case 2:
      statusClass = "bg-yellow";
      label = "Quoting";
      break;
    case 3:
      if (isBooking) {
        statusClass = "bg-lightGrey";
        label = "Contracting";
      } else {
        statusClass = "bg-yellow";
        label = "Quotation";
      }
      break;

    case 4:
      if (isBooking) {
        statusClass = "bg-green";
        label = "Confirmed";
      } else {
        statusClass = "bg-green";
        label = "Paid";
      }
      break;
    case 5:
      statusClass = "bg-red";
      label = "Canceled";
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
      {label}
    </div>
  );
};
export default StatusChip;
