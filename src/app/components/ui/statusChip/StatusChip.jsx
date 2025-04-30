"use client";

import clsx from "clsx";
import {
  FaMoneyBillWave,
  FaTools,
  FaFile,
  FaClock,
  FaTruck,
} from "react-icons/fa";
import { BiSolidQuoteLeft } from "react-icons/bi";
import { TbFileInvoice } from "react-icons/tb";
import { GrInProgress } from "react-icons/gr";
import { CgUnavailable } from "react-icons/cg";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { LuClipboardList } from "react-icons/lu";
import { MdCancel, MdOutlineChecklist } from "react-icons/md";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { GoDotFill } from "react-icons/go";

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
        statusClass = "bg-green text-white";
        label = "Available";
        icon = <GoDotFill size={14} className="animate-pulse" />;
      } else {
        statusClass = "bg-yellow text-yellow-800";
        label = "Pending";
        icon = <FaClock size={14} />;
      }
      break;
    case 1:
      if (isService) {
        statusClass = "bg-red text-white";
        label = "Unavailable";
        icon = <CgUnavailable size={14} />;
      } else if (isBooking) {
        statusClass = "bg-primary text-white";
        label = "Planning";
        icon = <LuClipboardList size={14} />;
      } else if (isQuotation) {
        statusClass = "bg-green text-white";
        label = "Confirmed";
        icon = <IoCheckmarkDoneSharp size={14} />;
      } else {
        statusClass = "bg-green text-white";
        label = "Paid";
        icon = <FaMoneyBillWave size={14} />;
      }
      break;

    case 2:
      if (isBooking) {
        statusClass = "bg-yellow";
        label = "Quoting";
        icon = <BiSolidQuoteLeft size={14} />;
      } else {
        statusClass = "bg-red text-white";
        label = "Cancelled";
        icon = <MdCancel size={14} />;
      }
      break;
    case 3:
      if (isBooking) {
        statusClass = "bg-gray-300 text-gray-800";
        label = "Contracting";
        icon = <FaFile size={14} />;
      } else {
        statusClass = "bg-yellow";
        label = "Quotation";
        icon = <TbFileInvoice size={14} />;
      }
      break;

    case 4:
      if (isBooking) {
        statusClass = "bg-green text-white";
        label = "Confirmed";
        icon = <IoCheckmarkDoneSharp size={14} />;
      } else {
        statusClass = "bg-green text-white";
        label = "Paid";
        icon = <FaMoneyBillWave size={14} />;
      }
      break;
    case 5:
      if (isBooking) {
        statusClass = "bg-green text-white";
        label = "Deposit Paid";
        icon = <FaMoneyBillWave size={14} />;
      } else {
        statusClass = "bg-red text-white";
        label = "Failed";
        icon = <MdCancel size={14} />;
      }
      break;
    case 6:
      if (isBooking) {
        statusClass = "bg-primary text-white";
        label = "Preparing";
        icon = <FaTools size={14} />;
      } else {
        statusClass = "bg-green text-white";
        label = "None";
        icon = null;
      }
      break;
    case 7:
      statusClass = "bg-yellow";
      label = "In Transit";
      icon = <FaTruck size={14} />;
      break;
    case 8:
      statusClass = "bg-yellow";
      label = "Progressing";
      icon = <GrInProgress size={14} />;
      break;
    case 9:
      statusClass = "bg-green text-white";
      label = "All Done";
      icon = <MdOutlineChecklist size={14} />;
      break;
    case 10:
      statusClass = "bg-green text-white";
      label = "Final Paid";
      icon = <FaMoneyBillWave size={14} />;
      break;
    case 11:
      statusClass = "bg-green text-white";
      label = "Completed";
      icon = <HiOutlineBadgeCheck size={14} />;
      break;
    case 12:
      statusClass = "bg-yellow";
      label = "Pending Cancel";
      icon = <FaClock size={14} />;
      break;
    case 13:
      statusClass = "bg-red text-white";
      label = "Cancelled";
      icon = <MdCancel size={14} />;
      break;
    case 14:
      statusClass = "bg-red text-white";
      label = "Rejected";
      icon = <MdCancel size={14} />;
      break;
    default:
      statusClass = "bg-gray-300 text-gray-800";
      label = "Unknown";
      icon = null;
  }

  return (
    <div
      className={clsx(
        `px-3 py-1 rounded-md text-sm font-medium ${statusClass} w-fit flex items-center justify-center gap-2 shadow-sm`,
        className
      )}
    >
      {icon}
      {label}
    </div>
  );
};
export default StatusChip;
