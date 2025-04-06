"use client";

import React from "react";
import SellerWrapper from "../../components/SellerWrapper";
import { TbArrowLeft } from "react-icons/tb";
import { FootTypo } from "@/app/components/ui/Typography";
import { useRouter } from "next/navigation";
import Avatar from "@/app/components/ui/Avatar/Avatar";
import { useParams } from "next/navigation";
import { useGetBookingDetailForProvider } from "@/app/queries/book/book.query";
import { BorderBox } from "@/app/components/ui/BorderBox";
import { Skeleton } from "@mui/material";
import { formatDate } from "@/app/helpers";
import { FaBarcode } from "react-icons/fa";
import { CgCalendarDates } from "react-icons/cg";
import { RiMailLine, RiMessage2Line } from "react-icons/ri";
import StatusChip from "@/app/components/ui/statusChip/StatusChip";
import { BodyTypo } from "@/app/components/ui/Typography";
import Button from "@/app/components/ui/Buttons/Button";
import { PiSealWarning } from "react-icons/pi";
import { BsThreeDots } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { HiOutlineStatusOnline } from "react-icons/hi";


const RequestDetail = () => {
  const router = useRouter();
  const { id } = useParams();
  const { data: bookingsData, isLoading } = useGetBookingDetailForProvider(id);

  if (isLoading) {
    return (
      <SellerWrapper>
        <Skeleton />
      </SellerWrapper>
    );
  }

  return (
    <SellerWrapper>
      <button
        className="flex items-center gap-1 mb-5"
        onClick={() => router.back()}
      >
        <TbArrowLeft size={20} />
        <FootTypo footlabel="Go Back" className="!m-0" />
      </button>
      <BodyTypo bodylabel="Request Details" className="!m-0" />
      <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full font-semibold mt-5">
        <BorderBox className="flex flex-col gap-2 border shadow-xl">
          <FootTypo footlabel="Information" className="!m-0 text-lg" />
          <div className="flex flex-row gap-3 items-center">
            <FaBarcode size={20} />
            <FootTypo footlabel="Booking Code" className="!m-0 text-sm" />
            <FootTypo footlabel={id} className="!m-0 underline" />
          </div>
          <div className="flex flex-row gap-3 items-center">
            <CgCalendarDates size={20} />
            <FootTypo footlabel="Requested survey date" className="!m-0 text-sm" />
            <FootTypo
              footlabel={formatDate(bookingsData.surveyDate)}
              className="!m-0"
            />
          </div>
          <div className="flex flex-row gap-2 items-center text-rose-500">
            <PiSealWarning size={20} />
            <FootTypo
              footlabel="Please be aware that the survey date can't exceed than requested date!"
              className="!m-0 text-sm"
            />
          </div>
          <div className="flex flex-row gap-3 items-center">
            <HiOutlineStatusOnline size={20} />
            <FootTypo footlabel="Status" className="!m-0 text-sm" />
            <StatusChip status={bookingsData.status} isBooking={true}/>
          </div>
        </BorderBox>
        <BorderBox className="flex flex-col gap-2 border shadow-xl">
          <FootTypo footlabel="Customer Information" className="!m-0 text-lg" />
          <div className="flex flex-row gap-3 items-center">
            <Avatar
              userImg={bookingsData.customer.avatar}
              alt={bookingsData.customer.fullName}
              w={40}
              h={40}
            />
            <FootTypo
              footlabel={bookingsData.customer.fullName}
              className="!m-0"
            />
          </div>
          <div className="flex flex-row gap-3 items-center">
            <RiMailLine size={20} />
            <FootTypo footlabel=" Contact" className="!m-0 text-sm" />
            <FootTypo
              footlabel={bookingsData.customer.email}
              className="!m-0 underline"
            />
          </div>
          <div className="flex flex-row gap-3 items-center">
            <IoLocationOutline size={20} />
            <FootTypo footlabel="Location" className="!m-0 text-sm" />
            <FootTypo
              footlabel={bookingsData.address}
              className="!m-0 underline"
            />
          </div>
          <Button
            icon={<RiMessage2Line size={20} />}
            label="Send Message"
            className="w-fit bg-primary text-white"
          />
        </BorderBox>

        <BorderBox className="flex flex-col gap-2 border shadow-xl w-full col-span-2">
          <FootTypo footlabel="Service Details" className="!m-0 text-lg" />
          <div className="flex flex-row gap-3 items-center">
            <FootTypo footlabel="Service" className="!m-0 text-sm" />
            <FootTypo
              footlabel={bookingsData.decorService.style}
              className="!m-0 underline"
            />
          </div>
          <div className="flex flex-row gap-3 items-center">
            <FootTypo footlabel="Service Start Date" className="!m-0 text-sm" />
            <FootTypo
              footlabel={formatDate(bookingsData.decorService.startDate)}
              className="!m-0 underline"
            />
          </div>

          {bookingsData.bookingDetails.length > 0 ? (
            <div>have data</div>
          ) : (
            <div className="bg-white/50 w-full h-full z-30 flex gap-2 items-center justify-start animate-pulse overflow-hidden">
              <FootTypo
                footlabel="Waiting for proceeding of the quotaion"
                className="!m-0 text-sm"
              />
              <BsThreeDots size={30} />
            </div>
          )}
        </BorderBox>
      </div>
    </SellerWrapper>
  );
};

export default RequestDetail;
