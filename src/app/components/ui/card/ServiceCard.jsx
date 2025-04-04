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

const ServiceCard = ({
  href = "",
  style,
  province,
  images = [],
  seasons: serviceSeasons = [],
  category,
}) => {
  const displayedImages = [...images, ...images, ...images].slice(0, 3);

  return (
    <>
      <Link
        href={href}
        className="mb-10 grid w-full cursor-pointer grid-cols-1 md:grid-cols-4 gap-4 px-4 xl:px-0"
      >
        <div className="order-last md:order-first flex flex-col gap-2 space-y-2">
          <FootTypo footlabel={style} className="!m-0 font-bold text-lg" />
          <FootTypo
            footlabel={category}
            className="!m-0 font-bold text-sm rounded-md bg-gray-800 w-fit p-2 text-white"
          />

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium">Suitable for :</span>
            {serviceSeasons.map((season, index) => {
              const { icon, bgColor } = getSeasonConfig(season.seasonName, seasons);
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

          <Button
            className="mt-4 w-fit"
            label="View details"
            icon={<IoIosArrowForward size={20} />}
          />
        </div>

        {displayedImages.map((img, index) => (
          <div
            key={index}
            className="hidden md:block h-full w-full bg-zinc-200 dark:bg-gray-50 rounded-lg"
          >
            <Image
              src={img.imageURL}
              alt={`service-${index}`}
              width={500}
              height={500}
              className="transition duration-300 blur-0 rounded-lg shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        ))}
      </Link>
    </>
  );
};

export default ServiceCard;
