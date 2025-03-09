"use client";

import * as React from "react";
import Image from "next/image";
import { Skeleton } from "@mui/material";

const ImageSlider = ({ img = [], loading }) => {
  const [activeImg, setActiveImg] = React.useState("");
  const [thumbnails, setThumbnails] = React.useState([]);

  React.useEffect(() => {
    if (img.length > 0) {
      setActiveImg("");
      setThumbnails([]);
      setTimeout(() => {
        setActiveImg(img[0]);
        setThumbnails(img);
      }, 100);
    }
  }, [img]);

  return (
    <div className="flex flex-col lg:flex-col gap-6 items-center">
      <div className="w-full max-w-lg">
        {activeImg || loading ? (
          <Image
            src={activeImg}
            alt="Selected Image"
            width={500}
            height={500}
            unoptimized={true}
            className="w-full h-96 object-cover rounded-xl"
          />
        ) : (
          <Skeleton animation="wave" />
        )}
      </div>

      <div className="flex flex-row gap-4 overflow-x-auto">
        {thumbnails.length > 0
          ? thumbnails.map((imageUrl, index) => (
              <Image
                key={index}
                src={imageUrl}
                alt={`Thumbnail ${index + 1}`}
                width={100}
                height={100}
                unoptimized={true}
                className={`w-24 h-24 object-cover rounded-md cursor-pointer border-2 ${
                  activeImg === imageUrl ? "border-primary" : "border-gray-300"
                }`}
                onClick={() => setActiveImg(imageUrl)}
              />
            ))
          : Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width={100}
                height={100}
                className="rounded-md"
              />
            ))}
      </div>
    </div>
  );
};

export default ImageSlider;
