"use client";

import * as React from "react";

import Modal from "../Modal";
import Heading from "./components/Heading";
import useInfoModal from "@/app/hooks/useInfoModal";
import { formatDateVN, formatCurrency } from "@/app/helpers";
import { FootTypo } from "../Typography";
import StatusChip from "../statusChip/StatusChip";
import Image from "next/image";
import { getSeasonConfig } from "@/app/helpers";
import { seasons } from "@/app/constant/season";
import Avatar from "../Avatar/Avatar";
import Button from "../Buttons/Button";
import { RiProfileLine } from "react-icons/ri";
import { IoChatboxEllipsesOutline } from "react-icons/io5";

const InformationModal = () => {
  const infoModal = useInfoModal();
  const {
    isOrder,
    isBooking,
    description,
    title,
    orderCode,
    phoneNumber,
    address,
    orderDate,
    totalPrice,
    status,
    items,
    bookingCode,
    serviceStyle,
    serviceImage,
    serviceName,
    serviceSeason,
    providerImage,
    providerName,
    profileClick,
    chatClick,
  } = infoModal.data || {};

  const bodyContent = (
    <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto ">
      <div className="flex items-center gap-2">
        <Heading title={title} />
      </div>
      {!isOrder && (
        <div className="mt-4">
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

      {isBooking && (
        <div className="flex flex-col gap-3 font-semibold">
          <div className="flex flex-row items-center gap-2">
            <FootTypo footlabel="Booking Code" className="!m-0 text-sm" />
            <FootTypo
              footlabel={bookingCode}
              className="!m-0 text-lg bg-primary p-1 rounded-lg"
            />
          </div>
          <div className="flex flex-row items-center gap-2">
            <FootTypo footlabel="Status" className="!m-0 text-sm" />
            <StatusChip status={status} isBooking={true} />
          </div>
          <div className="flex flex-col items-start gap-2">
            <FootTypo footlabel="About the service" className="!m-0 text-sm" />
            <FootTypo
              footlabel={serviceStyle}
              className="!m-0 text-lg self-center"
            />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full mt-3">
              {Array.isArray(serviceImage) ? (
                serviceImage.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden"
                  >
                    <Image
                      src={image}
                      alt={`${serviceName || "Service"} image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                ))
              ) : serviceImage ? (
                <div className="relative aspect-square rounded-xl overflow-hidden">
                  <Image
                    src={serviceImage}
                    alt={serviceName || "Service image"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex flex-row items-center gap-2 my-5">
            <FootTypo footlabel="Suitable for" className="!m-0 text-sm" />
            <div className="flex flex-wrap gap-2">
              {Array.isArray(serviceSeason) && serviceSeason.length > 0 ? (
                serviceSeason.map((season, index) => {
                  if (!season || !season.seasonName) return null;
                  const { icon, bgColor } = getSeasonConfig(
                    season.seasonName,
                    seasons
                  );
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-2 text-white ${bgColor} rounded-xl py-1 px-3 text-xs font-medium`}
                    >
                      {icon}
                      {season.seasonName}
                    </div>
                  );
                })
              ) : (
                <span className="text-gray-500 text-sm">All seasons</span>
              )}
            </div>
          </div>
          <div className="flex flex-row items-center gap-5 border border-black rounded-lg p-5 w-fit relative">
            <span className="absolute top-[-12px] left-2 bg-white dark:bg-transparent px-2 overflow-hidden">
              A service from
            </span>
            <div className="flex flex-row items-center gap-2">
              <Avatar userImg={providerImage} alt={providerName} w={40} h={40} />
              <FootTypo footlabel={providerName} className="!m-0 text-lg" />
            </div>
            <div className="flex flex-row items-center gap-2">
              <Button
              label="View Profile"
              onClick={profileClick}
              icon={<RiProfileLine />}
            />
            <Button
                label="Chat now"
                onClick={chatClick}
                icon={<IoChatboxEllipsesOutline />}
              />
            </div>
          </div>
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
