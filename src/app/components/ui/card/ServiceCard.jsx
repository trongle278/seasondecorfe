"use client";
import React from "react";
import { FootTypo } from "../Typography";
import Button from "../Buttons/Button";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";

const ServiceCard = ({ href = "", style, description, images = [] }) => {
  const displayedImages = [...images, ...images, ...images].slice(0, 3);

  return (
    <Link
      href={href}
      className="mb-10 grid w-full cursor-pointer grid-cols-1 md:grid-cols-4 gap-4 px-4 xl:px-0"
    >
      <div className="order-last md:order-first flex flex-col gap-2">
        <FootTypo footlabel={style} className="!m-0 font-bold text-lg" />
        <FootTypo footlabel={description} className="!m-0 line-clamp-4" />
        <Button className="mt-4 w-fit" label="View details" icon={<IoIosArrowForward size={20}/>} />
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
            className=" transition duration-300 blur-0 rounded-lg shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
          />
        </div>
      ))}
    </Link>
  );
};

export default ServiceCard;
