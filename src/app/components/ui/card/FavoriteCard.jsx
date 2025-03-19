"use client";

import { BorderBox } from "../BorderBox";
import Image from "next/image";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import { FaDongSign } from "react-icons/fa6";
import { IoIosStar } from "react-icons/io";
import { useState } from "react";
import { useRouter } from "next/navigation";

const FavoriteCard = ({ image, name, description, price, rating, id, slug, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

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
      <div className="flex flex-col h-full">
        <div className="relative w-full h-48 overflow-hidden">
          <Image 
            src={image || "/user-ava.jpg"} 
            alt="image" 
            fill
            className={`object-cover transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
            onClick={handleClick}
          />
          <button 
            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md z-10 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              if (onRemove) onRemove(id);
            }}
          >
            <MdFavorite className="text-red-500 text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow" onClick={handleClick}>
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{name}</h3>
          
          {description && (
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
          )}
          
          <div className="mt-auto">
            <div className="flex items-center gap-1 mb-2">
              <IoIosStar className="text-yellow-400" />
              <span className="text-sm">{rating || "No ratings"}</span>
            </div>
            
            <div className="flex items-center text-red-500 font-bold">
              <FaDongSign className="mr-1" />
              <span>{new Intl.NumberFormat("vi-VN").format(price || 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </BorderBox>
  );
};

export default FavoriteCard;
