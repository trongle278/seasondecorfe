"use client";

import * as React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "../../ui/Avatar/Avatar";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import MenuItem from "./components/MenuItem";
import { FaRegUser } from "react-icons/fa";
import { MdSubscriptions } from "react-icons/md";
import { RiListUnordered } from "react-icons/ri";
import { PiSignOutBold } from "react-icons/pi";
import { FaRegSmileBeam } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/providers/userprovider";
import { useChangeStatus } from "@/app/queries/user/provider.query";

export const UserMenu = () => {
  const { user } = useUser();

  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();

  const mutationChangeStatus = useChangeStatus();

  const onChangeStatus = React.useCallback(() => {
    mutationChangeStatus.mutate(false, {
      onSuccess: () => {
        router.push("/");
      },
      onError: () => {
        console.log("error");
      },
    });
  }, [mutationChangeStatus, router]);

  const ToggleOpen = React.useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="relative">
      <div
        onClick={ToggleOpen}
        className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition "
      >
        <AiOutlineMenu />
        <div className="hidden md:block">
          <Avatar userImg={user?.avatar} h={30} w={30} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute rounded-xl shadow-md w-[10vw] md:w-3/1 bg-white overflow-hidden right-0 top-12 text-sm z-10 dark:text-black">
          <div className="flex flex-col cursor-pointer">
            <div className="px-4 py-3 cursor-default transition font-semibold flex flex-col items-start gap-2 border-b">
              <span className="flex flex-row items-center gap-2">
                Hello <FaRegSmileBeam />
              </span>
              {user?.lastName}
            </div>

            {!user?.isProvider ? (
              <>
                <MenuItem
                  onClick={() => router.push("/user/account/profile")}
                  closeMenu={closeMenu}
                  label="Profile"
                  icon={<FaRegUser />}
                />
                <MenuItem
                  onClick={() => {}}
                  closeMenu={closeMenu}
                  label="Followed"
                  icon={<MdSubscriptions />}
                />
                <MenuItem
                  onClick={() => {}}
                  closeMenu={closeMenu}
                  label="Orders"
                  icon={<RiListUnordered />}
                />
                <MenuItem
                  onClick={() => signOut({ callbackUrl: "/authen/login" })}
                  closeMenu={closeMenu}
                  label="Sign Out"
                  icon={<PiSignOutBold />}
                />
              </>
            ) : (
              <>
                <MenuItem
                  onClick={onChangeStatus}
                  closeMenu={closeMenu}
                  label="Sign Out"
                  icon={<PiSignOutBold />}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
