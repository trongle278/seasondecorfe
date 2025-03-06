"use client";

import Image from "next/image";
import React from "react";
import { CardContainer, CardBody, CardItem } from "./components/3dCard";
import { TbCurrencyDong } from "react-icons/tb";
import { FootTypo } from "../Typography";
import { useRouter } from "next/navigation";

const ProductCard = ({ image, productName, rate, price, totalSold, href }) => {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      console.log("clicked");
      router.push(href);
    }
  };


  return (
    <CardContainer className="inter-var flex cursor-pointer" onClick={handleClick} >
      <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] max-w-[300px] sm:w-[30rem] h-auto rounded-xl p-2 border  ">
        <CardItem translateZ="100" className="w-full relative">
          <Image
            src={image}
            width={1000}
            height={1000}
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
          {/* <div className="absolute top-0 right-0 z-30">
            <FavouriteBtn favClick={() => console.log("clicked")} />
          </div> */}
        </CardItem>
        <div className="flex flex-col items-start mt-5 flex-grow gap-3">
          <CardItem
            translateZ="50"
            className="text-xl font-bold text-neutral-600 dark:text-white flex-grow break-words w-full"
          >
            {productName}
          </CardItem>
          <CardItem
            translateZ="50"
            className="flex flex-row items-center justify-between text-xl font-primary text-neutral-600 dark:text-white w-full"
          >
            <span className="inline-flex items-center justify-between text-primary">
              <TbCurrencyDong />

              {new Intl.NumberFormat("vi-VN", {
                currency: "VND",
              }).format(price)}
            </span>
            <FootTypo
              footlabel={`${totalSold} sold`}
              className="!m-0 text-sm"
            />
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
};

export default ProductCard;
