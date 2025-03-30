"use client";

import * as React from "react";

import Modal from "../Modal";
import Heading from "./components/Heading";
import useInfoModal from "@/app/hooks/useInfoModal";
import { formatDateVN, formatCurrency } from "@/app/helpers";
import { FootTypo } from "../Typography";
import StatusChip from "../statusChip/StatusChip";
import Image from "next/image";

const InformationModal = () => {
  const infoModal = useInfoModal();
  const {
    isOrder,
    description,
    title,
    orderCode,
    phoneNumber,
    address,
    orderDate,
    totalPrice,
    status,
    items,
  } = infoModal.data || {};

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Heading title={title} />
      </div>
      {!isOrder && (
        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
            {description || ""}
          </p>
        </div>
      )}
      {isOrder && (
        <div className="flex flex-col gap-3 font-semibold">
          <div className="flex flex-row items-center gap-2">
            <FootTypo footlabel="Order Code" className="!m-0 text-sm" />
            <FootTypo
              footlabel={orderCode}
              className="!m-0 text-lg bg-primary p-1 rounded-lg"
            />
          </div>
          <div className="flex flex-row items-center gap-2">
            <FootTypo footlabel="Phone Number" className="!m-0 text-sm" />
            <FootTypo footlabel={phoneNumber} className="!m-0 text-lg" />
          </div>
          <div className="flex flex-row items-center gap-2">
            <FootTypo footlabel="Address" className="!m-0 text-sm" />
            <FootTypo footlabel={address} className="!m-0 text-lg" />
          </div>
          <div className="flex flex-row items-center gap-2">
            <FootTypo footlabel="Order Date" className="!m-0 text-sm" />
            <FootTypo
              footlabel={formatDateVN(orderDate)}
              className="!m-0 text-lg"
            />
          </div>
          <div className="flex flex-row items-center gap-2">
            <FootTypo footlabel="Total Price" className="!m-0 text-sm" />
            <FootTypo
              footlabel={formatCurrency(totalPrice)}
              className="!m-0 text-lg underline"
            />
          </div>
          <div className="flex flex-row items-center gap-2">
            <FootTypo footlabel="Status" className="!m-0 text-sm" />
            <StatusChip status={status} />
          </div>
          <FootTypo footlabel="Items" className="!m-0 text-sm" />
         
        </div>
      )}
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
    </div>
  );

  return (
    <Modal
      isOpen={infoModal.isOpen}
      title={title || "Description"}
      secondaryAction={infoModal.onClose}
      onClose={infoModal.onClose}
      actionLabel="Done"
      onSubmit={infoModal.onClose}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default InformationModal;
