"use client";

import * as React from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";
import Avatar from "../../ui/Avatar/Avatar";
import { signOut } from "next-auth/react";
import MenuItem from "./components/MenuItem";
import { FaRegUser } from "react-icons/fa";
import { RiListUnordered } from "react-icons/ri";
import { PiSignOutBold } from "react-icons/pi";
import { FaRegSmileBeam } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/providers/userprovider";
import { useChangeStatus } from "@/app/queries/user/provider.query";
import { MdFavorite } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

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
        className="p-4 md:py-1 md:px-2 border-[1px] border-black dark:border-white flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
      >
        <div className="flex items-center justify-center w-5 h-5">
          {isOpen ? (
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <RxCross2 size={18} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ rotate: 90 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.2 }}
            >
              <RxHamburgerMenu size={18} />
            </motion.div>
          )}
        </div>
        <div className="hidden md:block">
          <Avatar userImg={user?.avatar} h={30} w={30} />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute rounded-xl shadow-md w-[12vw] md:w-3/1 bg-white overflow-hidden right-0 top-12 text-sm z-10 dark:text-black"
          >
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
                    label="My purchase"
                    icon={<RiListUnordered />}
                  />
                  <MenuItem
                    onClick={() => router.push("/favorite")}
                    closeMenu={closeMenu}
                    label="My favorite"
                    icon={<MdFavorite />}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
