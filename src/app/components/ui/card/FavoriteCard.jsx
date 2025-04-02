"use client";

import { BorderBox } from "../BorderBox";
import Image from "next/image";
import { FcLike } from "react-icons/fc";
import { FaDongSign } from "react-icons/fa6";
import { IoIosStar } from "react-icons/io";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FootTypo } from "../Typography";
import { MdLocationOn } from "react-icons/md";
import { getSeasonConfig } from "@/app/helpers";
import { CiSquareRemove } from "react-icons/ci";
import { seasons } from "@/app/constant/season";

const FavoriteCard = ({
  image,
  name,
  description,
  location,
  price,
  rating,
  id,
  slug,
  onRemove,
  isService,
  season,
  onRemoveFavorite,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  // Get the first image URL from the array, or default image if not available
  const imageUrl =
    Array.isArray(image) && image.length > 0
      ? image[0].imageURL
      : "/user-ava.jpg";

  const handleClick = () => {
    if (slug) {
      router.push(`/`);
    }
  };

  return (
    <BorderBox
      className="relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer dark:hover:shadow-lg dark:shadow-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="inline-flex items-center h-0">
        <div className="absolute top-0 left-0 w-fit rounded-full p-1">
          <CiSquareRemove size={30} className="hover:bg-rose-500 hover:text-white transition-all duration-300 rounded-lg" onClick={onRemoveFavorite} />
        </div>
        {isService ? (
          <div className="absolute top-0 right-0 w-fit bg-yellow rounded-bl-lg p-1">
            <FootTypo
              footlabel="Service"
              className=" !m-0 text-sm font-semibold"
            />
          </div>
        ) : null}
      </div>
      
      <div className="flex flex-col h-full" onClick={onClick}>
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={imageUrl}
            alt={name || "Favorite item"}
            fill
            className={`object-cover transition-transform duration-300 rounded-xl ${
              isHovered ? "scale-110" : "scale-100"
            }`}
            onClick={handleClick}
          />
          <button
            className="absolute top-2 right-2 bg-white dark:bg-black p-2 rounded-full shadow-md z-10"
            onClick={(e) => {
              e.stopPropagation();
              if (onRemove) onRemove(id);
            }}
          >
            <FcLike size={20} />
          </button>
        </div>

        {/* Content */}
        {isService ? (
          <div
            className="p-3 flex flex-col flex-grow space-y-3"
            onClick={handleClick}
          >
            <FootTypo
              footlabel={name}
              className="!m-0 font-semibold text-lg mb-1 line-clamp-1"
            />
            <div className="flex flex-wrap gap-2 items-center">
              {Array.isArray(season) && season.length > 0 ? (
                season.map((seasonItem, index) => {
                  if (!seasonItem || !seasonItem.seasonName) return null;
                  const { icon, bgColor } = getSeasonConfig(
                    seasonItem.seasonName,
                    seasons
                  );
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-2 text-white ${bgColor} rounded-xl py-1 px-3 text-xs font-medium`}
                    >
                      {icon}
                      <span>{seasonItem.seasonName}</span>
                    </div>
                  );
                })
              ) : (
                <span className="text-gray-500 text-sm">All seasons</span>
              )}
            </div>

            <FootTypo
              footlabel={description}
              className="text-sm mb-2 line-clamp-2"
            />

            <div className="flex items-center gap-1">
              <MdLocationOn size={20} />
              <FootTypo
                footlabel={location}
                className="!m-0 text-sm font-semibold line-clamp-2"
              />
            </div>

            <div className="mt-auto">
              <div className="flex items-center gap-1 mb-2">
                <IoIosStar className="text-yellow-400" />
                <span className="text-sm">{rating || "No ratings"}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 flex flex-col flex-grow" onClick={handleClick}>
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{name}</h3>
          </div>
        )}
      </div>
    </BorderBox>
  );
};

export default FavoriteCard;
