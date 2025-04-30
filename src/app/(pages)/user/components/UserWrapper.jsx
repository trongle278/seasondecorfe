"use client";

import * as React from "react";
import Container from "@/app/components/layouts/Container";
import Avatar from "@/app/components/ui/Avatar/Avatar";
import { FootTypo } from "@/app/components/ui/Typography";
import { MdEdit } from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Sidebar from "./UserSidebar";
import { BorderBox } from "@/app/components/ui/BorderBox";
import { useSession } from "next-auth/react";
import { useGetAccountDetails } from "@/app/queries/user/user.query";


export const UserWrapper = ({ children }) => {
  const {data: session} = useSession();
  const accountId = session?.accountId;

  const { data: account} = useGetAccountDetails(accountId);

  const pathname = usePathname();

  return (
    <>
      <Container>
        <div className="min-h-screen pt-5">
          <div className="flex container mx-auto rounded-lg">
            <div className="flex-shrink-0 w-[180px]">
              <div className="flex py-6">
                <Avatar userImg={account?.avatar || ""} w={50} h={50} />
                <div className="flex flex-1 flex-col justify-center overflow-hidden pl-3">
                  <FootTypo footlabel={account?.lastName || "error"} className="!m-0" />
                  <Link href="/user/account/profile" className="inline-flex items-center gap-1 cursor-pointer">
                    <MdEdit />
                    <FootTypo footlabel="Edit Profile" className="!m-0" />
                  </Link>
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
