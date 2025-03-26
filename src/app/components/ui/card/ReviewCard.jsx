"use client";

import React, { useState } from "react";
import Avatar from "@/app/components/ui/avatar/Avatar";
import { FootTypo } from "@/app/components/ui/Typography";
import { FaStar } from "react-icons/fa";

const ReviewCard = ({
  review = {
    id: 1,
    user: {
      name: "Marco",
      image: "/images/default-avatar.png",
      serviceTime: "9 years on Airbnb",
    },
    date: new Date("February 2025"),
    rating: 4,
    comment:
      "una soluzione originale ed insolita per il contesto di Bangkok. Due stanze ognuna con il proprio carattere e design che ti lasciano davvero senza fiato. il fatto che il proprettario e sua moglie sono persone incredibilmente gentili e disponibili significa che il tuo soggiorno qui sarà incredibile. Consiglio vivamente questo posto!!!",
  },
}) => {
  return (
    <div className="ReviewCard mb-10">
      <div className="flex flex-col max-w-[400px]">
        {/* User Info and Date */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar w={48} h={48} userImg="" />
          <div className="flex flex-col">
            <FootTypo
              footlabel={review.user.name}
              className="!m-0 text-lg font-semibold"
            />
            <span className="text-sm text-gray-500">
              {review.user.serviceTime}
            </span>
          </div>
        </div>

        {/* Rating and Date */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, index) => (
              <FaStar
                key={index}
                className={
                  index < review.rating ? "text-black" : "text-gray-300"
                }
                size={16}
              />
            ))}
          </div>
          <span className="text-sm">
            ·{" "}
            {review.date instanceof Date
              ? `${review.date.toLocaleString("default", {
                  month: "long",
                })} ${review.date.getFullYear()}`
              : review.date}
          </span>
        </div>
        <div className="text-sm">
          <p className="whitespace-pre-line break-words line-clamp-3">
            dasssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssadddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
          </p>

          <button
            onClick={() => console.log("show more")}
            className="font-bold underline mt-1"
          >
            Show more
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
