"use client";

import React, { useState, useEffect } from "react";
import SellerWrapper from "../../components/SellerWrapper";
import { TbArrowLeft } from "react-icons/tb";
import { FootTypo } from "@/app/components/ui/Typography";
import { useRouter } from "next/navigation";
import Avatar from "@/app/components/ui/Avatar/Avatar";
import { useParams } from "next/navigation";
import {
  useGetBookingDetailForProvider,
  useApproveCancelRequest,
  useRevokeCancelRequest,
} from "@/app/queries/book/book.query";
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
import { formatCurrency } from "@/app/helpers";
import { useGetPendingCancelByBookingCode } from "@/app/queries/book/book.query";
import { Textarea } from "@headlessui/react";
import useChatBox from "@/app/hooks/useChatBox";
import useChat from "@/app/hooks/useChat";
import { useAddContact } from "@/app/queries/contact/contact.query";

const RequestDetail = () => {
  const router = useRouter();
  const { id } = useParams();
  const [shouldFetch, setShouldFetch] = useState(false);

  const addContactMutation = useAddContact();

  const { onOpen } = useChatBox();
  const { setSelectedReceiver } = useChat();

  const { data: bookingsData, isLoading: isBookingLoading } =
    useGetBookingDetailForProvider(id);

  useEffect(() => {
    if (bookingsData?.status === 12) {
      setShouldFetch(true);
    }
  }, [bookingsData]);

  const { data: cancelDetails, isLoading: isCancelDetailsLoading } =
    useGetPendingCancelByBookingCode(id, shouldFetch);

  const {
    mutate: approveCancelRequest,
    isPending: isApproveCancelRequestPending,
  } = useApproveCancelRequest();
  const {
    mutate: revokeCancelRequest,
    isPending: isRevokeCancelRequestPending,
  } = useRevokeCancelRequest();

  if (isBookingLoading || isCancelDetailsLoading) {
    return (
      <SellerWrapper>
        <Skeleton />
      </SellerWrapper>
    );
  }

  const handleApproveCancelRequest = () => {
    approveCancelRequest(id);
  };

  const handleRevokeCancelRequest = () => {
    revokeCancelRequest(id);
  };

  const handleChatClick = (receiver) => {
    const receiverData = {
      contactId: receiver.id,
      contactName: receiver.businessName,
      avatar: receiver.avatar,
    };
    addContactMutation.mutate(receiver.id, {
      onSuccess: () => {
        setSelectedReceiver(receiverData);
        onOpen();
      },
      onError: (error) => {
        console.error("Error adding contact:", error);
      },
    });
  };

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
      <div className="grid grid-cols-2 grid-rows-1 gap-4 w-full font-semibold my-5">
        <BorderBox className="flex flex-col gap-2 border shadow-xl">
          <FootTypo footlabel="Information" className="!m-0 text-lg" />
          <div className="flex flex-row gap-3 items-center">
            <FaBarcode size={20} />
            <FootTypo footlabel="Booking Code" className="!m-0 text-sm" />
            <FootTypo footlabel={id} className="!m-0 underline" />
          </div>
          <div className="flex flex-row gap-3 items-center">
            <CgCalendarDates size={20} />
            <FootTypo
              footlabel="Requested survey date"
              className="!m-0 text-sm"
            />
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
            <StatusChip status={bookingsData.status} isBooking={true} />
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
            onClick={()=> handleChatClick(bookingsData.customer)}
            icon={<RiMessage2Line size={20} />}
            label="Send Message"
            className="w-fit bg-primary"
          />
        </BorderBox>
      </div>
      {bookingsData.status === 12 ? (
        <BorderBox className="flex flex-col gap-2 border shadow-xl w-full col-span-2 font-semibold">
          <FootTypo
            footlabel="Cancellation Request"
            className="!m-0 text-lg text-red-500"
          />
          <div className="flex flex-row gap-3 items-center">
            <FootTypo footlabel="Requested on:" className="!m-0 text-sm" />
            <FootTypo
              footlabel={formatDate(cancelDetails?.createdAt)}
              className="!m-0"
            />
          </div>
          <div className="flex justify-between mt-2 p-4 bg-rose-50 dark:bg-rose-900/10 rounded-lg border border-red font-semibold">
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <PiSealWarning size={24} />
                <FootTypo
                  footlabel="Reason for Cancellation"
                  className="!m-0 text-sm"
                />
                <FootTypo
                  footlabel={
                    cancelDetails?.cancelTypeName ||
                    "No specific reason provided by the customer."
                  }
                  className="!m-0 text-lg"
                />
              </div>
              <div className="ml-9 py-2 border-t">
                <FootTypo
                  footlabel="Customer's Explaination"
                  className="!m-0 text-sm"
                />
                <Textarea
                  as="textarea"
                  name="note"
                  value={cancelDetails?.cancelReason}
                  className="block w-full resize-none rounded-2xl bg-gray-100 dark:bg-gray-700
      border border-transparent py-3 px-4  text-gray-800 dark:text-white
      placeholder-gray-400 dark:placeholder-gray-500
      focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white
      transition duration-300 whitespace-pre-wrap shadow-sm"
                  placeholder="No explaination provided."
                  rows={5}
                  disabled
                  readOnly
                />
              </div>
            </div>

            <div className="flex flex-row gap-3 items-center">
              <Button
                label="Approve"
                onClick={handleApproveCancelRequest}
                isLoading={isApproveCancelRequestPending}
              />
              <Button
                label="Reject"
                className="bg-red text-white"
                onClick={handleRevokeCancelRequest}
                isLoading={isRevokeCancelRequestPending}
              />
            </div>
          </div>
        </BorderBox>
      ) : bookingsData.status === 13 ? (
        <div className="flex flex-col gap-2 border border-red rounded-xl p-4 shadow-xl w-full col-span-2 font-semibold">
          <FootTypo
            footlabel="The request is closed"
            className="!m-0 text-lg self-center"
          />
        </div>
      ) : (
        <BorderBox className="flex flex-col gap-2 border shadow-xl w-full col-span-2 font-semibold">
          <FootTypo footlabel="Service Details" className="!m-0 text-lg" />
          <div className="flex flex-row gap-3 items-center">
            <FootTypo footlabel="Service name" className="!m-0 text-sm" />
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
            <div className="flex flex-col gap-4 ">
              {bookingsData.bookingDetails.map((detail, index) => (
                <div
                  key={detail.id}
                  className="flex flex-col gap-2 p-4 rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <FootTypo
                      footlabel={detail.serviceItem}
                      className="!m-0 font-semibold text-primary"
                    />
                  </div>
                  <div className="flex flex-row gap-3 items-center">
                    <FootTypo footlabel="Cost:" className="!m-0 text-sm" />
                    <FootTypo
                      footlabel={formatCurrency(detail.cost)}
                      className="!m-0 font-semibold text-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/50 w-full h-full z-30 flex gap-2 items-center justify-start animate-pulse overflow-hidden">
              <FootTypo
                footlabel="Waiting for proceeding of the quotation"
                className="!m-0 text-sm"
              />
              <BsThreeDots size={30} />
            </div>
          )}
        </BorderBox>
      )}
    </SellerWrapper>
  );
};

export default RequestDetail;
