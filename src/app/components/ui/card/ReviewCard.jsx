"use client";

import React, { useState } from "react";
import Avatar from "@/app/components/ui/avatar/Avatar";
import { FootTypo } from "@/app/components/ui/Typography";
import { Rating } from "@mui/material";
import { formatDate } from "@/app/helpers";
import Image from "next/image";

const ReviewCard = ({
  id,
  comment,
  rate,
  createAt,
  images = [],
  username = "User",
  userAvatar = "",
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="ReviewCard mb-10">
      <div className="flex flex-col max-w-[400px]">
        {/* User Info and Date */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar w={48} h={48} userImg={userAvatar} />
          <div className="flex flex-col">
            <FootTypo
              footlabel={username || "Anonymous"}
              className="!m-0 text-lg font-semibold"
            />
            <span className="text-sm text-gray-500">
              {formatDate(createAt)}
            </span>
          </div>
        </div>

        {/* Rating and Date */}
        <div className="flex items-center gap-2 mb-2">
          <Rating value={rate || 0} readOnly precision={0.5} size="small" />
        </div>
        <div className="text-sm">
          <p
            className={`whitespace-pre-line break-words ${
              expanded ? "" : "line-clamp-3"
            }`}
          >
            {comment || "No comment provided."}
          </p>

          {comment && comment.length > 150 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="font-bold underline mt-1"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        {/* Review Images Grid */}
        {images && images.length > 0 && (
          <div className="mt-4">
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="aspect-square relative rounded-lg overflow-hidden"
                >
                  <Image
                    src={img}
                    alt={`Review image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 30vw, 120px"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
