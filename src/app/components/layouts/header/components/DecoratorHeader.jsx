"use client";

import Link from "next/link";
import Logo from "@/app/components/Logo";
import ShinyText from "@/app/components/ui/ShinyText";
import ThemeSwitch from "@/app/components/ThemeSwitch";

const DecoratorHeader = () => {
  return (
    <header
      className="DecoratorNav z-[50] sticky top-0 w-full border-b bg-white dark:bg-black border-neutral-200 dark:border-white/[0.1]"
      tabIndex="-1"
    >
      <div className="hidden lg:block">
        <div className="header-container px-8 flex items-center max-w-[88rem] mx-auto">
          <div className="logo-wrapper flex justify-center items-center relative">
            <Logo />
            <span className="absolute right-[-15px] top-[14px]">
              <ShinyText
                text="Decorator"
                disabled={false}
                speed={3}
                className="text-sm font-semibold font-tertiary"
              />
            </span>
          </div>
          <div className="right-wrapper flex flex-1 items-center justify-end gap-5 sm:gap-3 md:justify-end">
            <div className="flex justify-between gap-16 items-center">
              <p className="hover:text-red">
                <Link href="/#">Do you need help ?</Link>
              </p>

              <ThemeSwitch />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DecoratorHeader;
