"use client";

import { FootTypo } from "@/app/components/ui/Typography";
import { formatCurrency } from "@/app/helpers";
import StatusChip from "@/app/components/ui/statusChip/StatusChip";
import { formatDateVN } from "@/app/helpers";
import Button from "@/app/components/ui/Buttons/Button";
import { TbCancel } from "react-icons/tb";
import { MdErrorOutline } from "react-icons/md";
import { BorderBox } from "../BorderBox";
import { Divider } from "@mui/material";

const BookingCard = ({
  bookingCode,
  status,
  address,
  totalPrice = 0,
  createdDate,
  isPending,
  detailClick,
  cancelClick,
}) => {
  return (
    <BorderBox className="bg-transparent rounded-lg shadow-xl p-5 relative mt-4 border dark:border-gray-50">
      <div className="flex items-center gap-4 justify-between">
        <div className="flex flex-row gap-32">
          <div className="flex flex-col justify-between gap-3 font-semibold ">
            <div className="absolute top-0 right-0">
              <FootTypo
                footlabel={bookingCode}
                className="!m-0 text-sm bg-primary p-2 rounded-bl-lg rounded-tr-lg"
              />
            </div>
            <FootTypo footlabel="Booking Request" className="!m-0 text-lg" />

            <FootTypo
              footlabel={formatDateVN(createdDate)}
              className="!m-0 text-sm"
            />

            <FootTypo footlabel={address} className="!m-0 text-sm" />

            <button
              className="text-sm underline self-start"
              onClick={detailClick}
            >
              View Details
            </button>
          </div>

          <Divider
            orientation="vertical"
            flexItem
            className="dark:border-gray-50"
          />

          <div className="flex flex-col gap-3 justify-center">
            <div className="flex items-center gap-2">
              <FootTypo footlabel="Total Price" className="!m-0 text-sm" />

              {totalPrice > 0 ? (
                <FootTypo
                  footlabel={formatCurrency(totalPrice)}
                  className="!m-0 text-sm underline"
                />
              ) : (
                <FootTypo
                  footlabel="Processing..."
                  className="!m-0 text-sm animate-pulse bg-gray-200 p-1 rounded-md dark:text-black"
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              <FootTypo footlabel="Status" className="!m-0 text-sm" />
              <StatusChip status={status} isBooking={true} />
            </div>


            {!isPending && (
              <div className="flex items-center gap-2">
                <StatusNotify label="Provider is preparing quotation" />
              </div>
            )}
          </div>
        </div>

        {isPending && (
          <div className="flex items-center gap-2">
            <Button
              label="Cancel request"
              onClick={cancelClick}
              className="bg-red text-white"
              icon={<TbCancel size={20} />}
            />
          </div>
        )}
      </div>
    </BorderBox>
  );
};

export default BookingCard;

const StatusNotify = ({ label, isHidden = false }) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <MdErrorOutline size={20} />
        <FootTypo footlabel={label} className="!m-0 text-sm" />
      </div>

      {!isHidden && <div></div>}
    </>
  );
};
