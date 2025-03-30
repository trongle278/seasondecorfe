"use client";

import clsx from "clsx";

const StatusChip = ({ status, className }) => {
  let statusClass;
  let label;

  switch (status) {
    case 0:
      statusClass = "bg-yellow";
      label = "Pending";
      break;
    case 2:
      statusClass = "bg-green";
      label = "Sold";
      break;
    case 3:
      statusClass = "bg-red";
      label = "Unsold";
      break;
    case 4:
      statusClass = "bg-red";
      label = "Canceled";
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
        `px-4 py-1 rounded-full text-white text-center font-bold ${statusClass} max-w-[120px]`,
        className
      )}
    >
      {label}
    </div>
  );
};
export default StatusChip;
