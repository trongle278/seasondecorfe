"use client";

import Link from "next/link";
import { FootTypo } from "@/app/components/ui/Typography";
import { BorderBox } from "@/app/components/ui/BorderBox";
import Avatar from "@/app/components/ui/Avatar/Avatar";
import Button from "@/app/components/ui/Buttons/Button";
import { Divider } from "@mui/material";
import { MdVerifiedUser } from "react-icons/md";
import { IoChatboxEllipsesOutline } from "react-icons/io5";

const HostSection = ({ href = "", avatar, name, joinDate, followers }) => {
  return (
    <div className="border-t py-10 flex flex-col">
      <FootTypo
        footlabel="Meet Provider"
        className="!m-0 text-xl font-semibold pb-5"
      />
      <div className="w-full flex flex-row gap-10">
        <BorderBox className="w-2/5 shadow-xl">
          <Link
            href={href}
            className="flex flex-row gap-4 justify-between items-center"
          >
            <div className="flex flex-col items-center gap-1 w-2/3">
              <div className="relative inline-block">
                <div className="rounded-full p-1.5 bg-gradient-to-r from-primary to-white">
                  <div className="rounded-full overflow-hidden">
                    <Avatar userImg={avatar} w={104} h={104} />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white border-2 border-white shadow-md">
                  <MdVerifiedUser size={20} />
                </div>
              </div>
              <FootTypo
                footlabel={name}
                className="!m-0 text-xl font-bold mt-2"
              />
            </div>
            <div className="flex flex-col items-center gap-2 w-1/3">
              <div className="flex flex-col self-start">
                <FootTypo
                  footlabel={joinDate}
                  className="!m-0 text-lg font-semibold"
                />
                <FootTypo footlabel="Join date" className="!m-0 text-sm" />
              </div>
              <Divider
                variant="fullWidth"
                className=" dark:bg-gray-500"
                flexItem
              />
              <div className="flex flex-col self-start">
                <FootTypo
                  footlabel={followers}
                  className="!m-0 text-lg font-semibold"
                />
                <FootTypo footlabel="Followers" className="!m-0 text-sm" />
              </div>
            </div>
          </Link>
        </BorderBox>

        <div className="flex flex-col gap-4 w-4/5">
          <FootTypo
            footlabel="About Host"
            className="!m-0 text-lg font-semibold"
          />
          <Button
            label="Message provider"
            icon={<IoChatboxEllipsesOutline size={20} />}
            onClick={() => {
              console.log("message provider");
            }}
            className="w-fit"
          />
        </div>
      </div>
    </div>
  );
};

export default HostSection;
