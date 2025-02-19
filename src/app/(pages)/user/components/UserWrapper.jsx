"use client";

import * as React from "react";
import Container from "@/app/components/layouts/Container";
import Avatar from "@/app/components/ui/avatar/Avatar";
import { FootTypo } from "@/app/components/ui/typography";
import { MdEdit } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoNotificationsSharp } from "react-icons/io5";
import Sidebar from "./UserSidebar";
import { usePathname } from "next/navigation";
import { BorderBox } from "@/app/components/ui/BorderBox";

export const UserWrapper = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <Container>
        <div className="min-h-screen pt-5">
          <div className="flex container mx-auto rounded-lg">
            <div className="flex-shrink-0 w-[180px]">
              <div className="flex py-6">
                <Avatar userImg="" w={50} h={50} />
                <div className="flex flex-1 flex-col justify-center overflow-hidden pl-3">
                  <FootTypo footlabel="ten ng dung" className="!m-0" />
                  <span className="inline-flex items-center gap-1">
                    <MdEdit />
                    <FootTypo footlabel="Edit Profile" className="!m-0" />
                  </span>
                </div>
              </div>
              <div className="flex border-t-[2px] pt-10">
                <Sidebar
                  selectedPath={pathname}
                  //userId={currentUser.ID}
                  //userRole={currentUser.Role}
                />
              </div>
            </div>
            <BorderBox>{children}</BorderBox>
          </div>
        </div>
      </Container>
    </>
  );
};
