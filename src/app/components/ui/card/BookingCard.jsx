"use client";

import { FootTypo } from "@/app/components/ui/Typography";
import { formatCurrency } from "@/app/helpers";
import StatusChip from "@/app/components/ui/statusChip/StatusChip";
import { formatDateVN } from "@/app/helpers";
import Button from "@/app/components/ui/Buttons/Button";
import { TbCancel } from "react-icons/tb";
import { MdErrorOutline } from "react-icons/md";
import { BorderBox } from "../BorderBox";
import Avatar from "../Avatar/Avatar";

const BookingCard = ({
  providerAvatar,
  providerName,
  serviceName,
  bookingCode,
  status,
  address,
  totalPrice = 0,
  createdDate,
  isPending,
  isPlanning,
  isContracting,
  detailClick,
  cancelClick,
  isCanceled,
  isQuoteExist,
  isDepositPaid,
  isPendingCancel,
}) => {
  const getStatusMessage = () => {
    if (isCanceled) {
      return "The request has been canceled";
    }
    
    if (isDepositPaid) {
      return "Your deposit has been paid";
    }
    
    if (isQuoteExist && !isDepositPaid) {
      return "The quotation has been created";
    }
    
    if (isContracting) {
      return "The contract is being processed";
    }

    if (isPendingCancel) {
      return "Your cancellation request is pending";
    }
    
    if (!isPending && !isContracting && !isCanceled && !isQuoteExist) {
      return "Provider is preparing quotation";
    }
    
    return null;
  };
  
  const statusMessage = getStatusMessage();
  
  return (
    <BorderBox className="rounded-lg mb-4 border shadow-md p-4 relative flex justify-between items-start">
      <div className="flex flex-col gap-2 space-y-2">
        <div className="flex flex-col">
          <FootTypo footlabel={`Booking Request for [${serviceName}]`} className="!m-0 font-semibold text-lg" />
          <FootTypo
            footlabel={formatDateVN(createdDate)}
            className="!m-0 text-sm text-gray-600 mt-1"
          />
        </div>
        
        <FootTypo 
          footlabel={address} 
          className="!m-0 text-sm"
        />

        <div className="flex items-center gap-2">
          <FootTypo footlabel="Provider" className="!m-0 text-sm" />
          <Avatar userImg={providerAvatar} alt="Provider Avatar" w={32} h={32} />
          <FootTypo footlabel={providerName} className="!m-0 text-lg font-bold" />
        </div>
        
        <button
          onClick={detailClick}
          className="text-primary hover:text-primary-dark text-sm font-medium underline mt-1 self-start"
        >
          View Details
        </button>
      </div>

      <div className="flex flex-col items-end gap-2">
        <FootTypo
          footlabel={bookingCode}
          className="!m-0 text-sm bg-primary px-3 py-1 rounded-full font-medium"
        />

        <div className="flex flex-col items-end gap-2 mt-2">
          <div className="flex items-center gap-2">
            <FootTypo footlabel="Total Price" className="!m-0 text-sm text-gray-600" />
            {totalPrice > 0 ? (
              <FootTypo
                footlabel={`${formatCurrency(totalPrice)}`}
                className="!m-0 text-sm font-medium"
              />
            ) : (
              <FootTypo
                footlabel="Processing..."
                className="!m-0 text-sm text-gray-500 italic"
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            <FootTypo footlabel="Status" className="!m-0 text-sm text-gray-600" />
            <StatusChip status={status} isBooking={true} />
          </div>

          {statusMessage && (
            <div className="flex items-center gap-2 text-gray-600 mt-1">
              <MdErrorOutline size={16} />
              <FootTypo 
                footlabel={statusMessage} 
                className="!m-0 text-sm"
              />
            </div>
          )}
        </div>

        {(isPending || isPlanning) && (
          <Button
            label="Cancel request"
            onClick={cancelClick}
            className="bg-red text-white mt-4 text-sm px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
            icon={<TbCancel size={16} />}
          />
        )}
      </div>
    </BorderBox>
  );
};

export default BookingCard;
