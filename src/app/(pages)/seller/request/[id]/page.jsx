"use client";

import React from "react";
import SellerWrapper from "../../components/SellerWrapper";
import { TbArrowLeft } from "react-icons/tb";
import { FootTypo } from "@/app/components/ui/Typography";
import { useRouter } from "next/navigation";
import Avatar from "@/app/components/ui/Avatar/Avatar";

const RequestDetail = ({
  bookingCode,
  serviceStyle,
  serviceName,
  servicePrice,
  serviceDescription,
  customerName,
  customerPhone,
  customerEmail,
  customerImage,
}) => {
  const router = useRouter();
  return (
    <SellerWrapper>
      <div className="flex flex-col gap-4 font-semibold">
        <button
          className="flex items-center gap-1"
          onClick={() => router.back()}
        >
          <TbArrowLeft size={20} />
          <FootTypo footlabel="Go Back" className="!m-0" />
        </button>
        <div className="">
          <FootTypo footlabel="Request Details" />
          <div className="flex flex-row gap-1">
            <FootTypo footlabel="Booking Code" className="!m-0" />
            <FootTypo footlabel={bookingCode} className="!m-0 underline" />
          </div>
        </div>
      </div>
    </SellerWrapper>
  );
};

export default RequestDetail;
