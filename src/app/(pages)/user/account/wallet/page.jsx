"use client";

import * as React from "react";
import { UserWrapper } from "../../components/UserWrapper";
import { FootTypo } from "@/app/components/ui/Typography";
import Button from "@/app/components/ui/Buttons/Button";
import { FaRegEye } from "react-icons/fa";
import ShinyCard from "@/app/components/ui/animated/ShinyCard";
import { FaRegCreditCard } from "react-icons/fa";
import Image from "next/image";
import { FaDongSign } from "react-icons/fa6";

const UserWallet = () => {
  return (
    <UserWrapper>
      <div className="flex-grow ml-6 relative ">
        <div className="flex flex-col relative w-full ">
          <div className="pb-9 border-b-[1px]">
            <div className="flex flex-row justify-between items-center ">
              <span>
                <FootTypo
                  footlabel="My Wallet"
                  className="!m-0 text-lg font-semibold"
                />
              </span>

              <Button
                label="View transaction"
                icon={<FaRegEye size={20} />}
                onClick={() => {}}
              />
            </div>
          </div>
          <ShinyCard
            className="mt-5 max-w-[600px] h-full relative"
            spotlightColor="rgba(0, 229, 255, 0.2)"
          >
            <div className="flex flex-col h-full justify-center items-start">
              <Image
                src="https://payos.vn/wp-content/uploads/sites/13/2023/07/payos-logo-white.svg"
                width={200}
                height={200}
                alt="PayOs"
              />
              <div className="absolute right-20 top-5 text-white inline-flex">
                <Image
                  src="https://payos.vn/wp-content/uploads/sites/13/2023/12/download-removebg-preview.png"
                  width={30}
                  height={30}
                  alt="bank"
                />
                <Image
                  src="https://payos.vn/wp-content/uploads/sites/13/2023/12/mbbank-removebg-preview.png"
                  width={30}
                  height={30}
                  alt="bank"
                />
                <Image
                  src="https://payos.vn/wp-content/uploads/sites/13/2023/12/download__1_-removebg-preview.png"
                  width={30}
                  height={30}
                  alt="bank"
                />
                <Image
                  src="https://payos.vn/wp-content/uploads/sites/13/2023/12/download__2_-removebg-preview.png"
                  width={30}
                  height={30}
                  alt="bank"
                />
                <FootTypo
                  footlabel="+ 50"
                  className="!m-0 text-xl font-semibold text-white"
                />
              </div>
              <FootTypo
                footlabel="Fast & secure payment with PayOs"
                className="!m-0 text-lg font-semibold text-white pb-5"
              />
              <div className="inline-flex gap-3 my-5">
                <FootTypo
                  footlabel="Your balanced :"
                  className="!m-0 text-xl font-semibold text-white"
                />
                <span className="inline-flex items-center">
                  <FaDongSign size={20} color="white" />
                  <FootTypo
                    footlabel="131,23"
                    className="!m-0 text-xl font-semibold text-white"
                  />
                </span>
              </div>
              <Button
                label="Top up"
                icon={<FaRegCreditCard size={20} />}
                onClick={() => {}}
                className="bg-white dark:text-black"

              />
            </div>
          </ShinyCard>
        </div>
      </div>
    </UserWrapper>
  );
};

export default UserWallet;
