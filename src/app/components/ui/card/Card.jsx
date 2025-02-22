"use client";

import Image from "next/image";
import React from "react";
import { CardContainer, CardBody, CardItem } from "./components/3dCard";
import Link from "next/link";
import { TbCurrencyDong } from "react-icons/tb";
import { FavouriteBtn } from "../../layouts/header/components/indexBtn";

const Card = () => {
  return (
    <CardContainer className="inter-var flex">
      <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] max-w-[300px] sm:w-[30rem] h-auto rounded-xl p-2 border  ">
        <CardItem translateZ="100" className="w-full">
          <Image
            src="https://images.unsplash.com/photo-1555488205-d5e67846cf40?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <div className="flex flex-col items-start mt-5 flex-grow gap-3">
          <CardItem
            translateZ="50"
            className="text-xl font-bold text-neutral-600 dark:text-white flex-grow break-words w-full"
          >
            dasdasdafdsssssssssssssssssssssss
          </CardItem>
          <CardItem
            translateZ="50"
            className="flex flex-row items-center justify-between text-xl font-primary text-neutral-600 dark:text-white w-full"
          >
            <span className="inline-flex items-center">
              <TbCurrencyDong /> 123
            </span>

            <FavouriteBtn favClick={() => {}} />
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
};

export default Card;
