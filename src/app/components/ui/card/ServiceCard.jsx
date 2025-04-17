"use client";
import React from "react";
import { FootTypo } from "../Typography";
import Button from "../Buttons/Button";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import { MdLocationOn } from "react-icons/md";
import { seasons } from "@/app/constant/season";
import { getSeasonConfig } from "@/app/helpers";
import StatusChip from "../statusChip/StatusChip";

const ServiceCard = ({
  href = "",
  style,
  province,
  images = [],
  seasons: serviceSeasons = [],
  category,
  isAvailable = false,
}) => {
  const displayedImages = [...images, ...images, ...images].slice(0, 3);

  return (
    <Link
      href={href}
      className="mb-10 grid w-full cursor-pointer grid-cols-1 md:grid-cols-4 gap-4 px-4 xl:px-0 hover:shadow-lg transition-shadow duration-300 rounded-lg"
    >
      <div className="order-last md:order-first flex flex-col gap-2 space-y-2 p-4">
        <FootTypo footlabel={style} className="!m-0 font-bold text-lg" />
        <FootTypo
          footlabel={category}
          className="!m-0 font-bold text-sm rounded-md bg-gray-800 w-fit p-2 text-white"
        />

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium">Suitable for :</span>
          {serviceSeasons.map((season, index) => {
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
          })}
        </div>
        <div className="flex items-center gap-2">
          <MdLocationOn size={20} />
          <FootTypo footlabel={province} className="!m-0 font-bold text-sm" />
        </div>
        {isAvailable ? (
          <StatusChip status={isAvailable} isService={true} />
        ) : (
          <Button
            className="mt-4 w-fit"
            label="View details"
            icon={<IoIosArrowForward size={20} />}
          />
        )}
      </div>

      {displayedImages.map((img, index) => (
        <div
          key={index}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-lg"
        >
          <Image
            src={img.imageURL}
            alt={`service-${index}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}
    </Link>
  );
};

export default ServiceCard;
