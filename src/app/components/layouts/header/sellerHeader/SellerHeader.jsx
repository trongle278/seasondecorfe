"use client";

import * as React from "react";
import ThemeSwitch from "@/app/components/ThemeSwitch";
import Logo from "@/app/components/Logo";
import { UserMenu } from "../UserMenu";
import { useSession } from "next-auth/react";
import { NotificationBtn } from "../components/indexBtn";
import AnchorDrawer from "@/app/components/ui/notification/Notifcation";

const SellerHeader = () => {
  const { data } = useSession();

  const [isDrawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <header className="z-[50] sticky top-0 w-full border-b bg-white dark:bg-black border-neutral-200 dark:border-white/[0.1]">
      <div className="header-container px-8 flex items-center w-full mx-auto">
        <Logo />

        <div className="right-wrapper flex flex-1 items-center justify-end gap-5 sm:gap-3 md:justify-end">
          <ThemeSwitch />/
          <NotificationBtn toggleDrawer={toggleDrawer} />
          <AnchorDrawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
          {data?.user && (
            <>
              <UserMenu />
            </>
          )}
          {!data?.user && "not allow"}
        </div>
      </div>
    </header>
  );
};

export default SellerHeader;
