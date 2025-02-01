"use client";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { TfiMoreAlt } from "react-icons/tfi";
import ThemeSwitch from "../../ThemeSwitch";
import Logo from "../../Logo";
import RightWrapper from "./RightWrapper";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header
      className="z-[50] sticky top-0 w-full border-b bg-white dark:bg-black border-neutral-200 dark:border-white/[0.1]"
      tabIndex="-1"
    >
      <div className="hidden lg:block">
        <div className="header-container px-8 flex items-center max-w-[88rem] mx-auto">
          <div className="logo-wrapper flex justify-center ">
            <Logo />
          </div>
          <section className="left-wrapper desktop-only flex items-center space-x-6 text-sm font-medium xl:flex">
            <div className="flex items-center gap-4 transition-all">
              <div className="relative">
                <p className="flex cursor-pointer items-center gap-2 hover:text-red">
                <Link href="/provider">Providers</Link>
                </p>
              </div>
              <div className="relative">
                <p className="flex cursor-pointer items-center gap-2 hover:text-red">
                <Link href="/features">Features</Link>           
                </p>
              </div>
              <div className="relative">
                <p className="flex cursor-pointer items-center gap-2 hover:text-red">
                  <Link href="/pricing">Pricing</Link>
                </p>
              </div>
              <div className="relative">
                <p className="flex cursor-pointer items-center gap-2 hover:text-red">
                  <Link href="/blog">Blog</Link>
                </p>
              </div>
            </div>
          </section>

          <div className="right-wrapper flex flex-1 items-center justify-end gap-5 sm:gap-3 md:justify-end">
            <div className="search-container text-black">
              <button className="flex relative justify-start items-center text-sm text-muted-foreground dark:border-white/[0.2] py-2 w-fit border border-transparent shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] px-4 rounded-xl bg-white dark:bg-brand">
                <SearchOutlinedIcon className="text-muted-foreground dark:text-black" />
                <span className="transition-colors hover:text-foreground/80 text-foreground/60 text-xs sm:text-sm font-medium pl-2 pr-4">
                  Search for anything
                </span>
              </button>
            </div>
            <RightWrapper />

            <ThemeSwitch />
          </div>
        </div>
      </div>
      <div className="block lg:hidden">
        <div className="flex justify-between  items-center w-full rounded-md px-4 py-4">
          <div className="flex items-center gap-1.5">
            <Image
              src={"/logo/logo-black.png"}
              alt="Logo"
              loading="lazy"
              width={24}
              height={24}
              decoding="async"
              className="block dark:hidden"
              style={{ color: "transparent" }}
            />
            <Image
              src={"/logo/logo-white.png"}
              alt="Logo"
              loading="lazy"
              width={24}
              height={24}
              decoding="async"
              className="hidden dark:block"
              style={{ color: "transparent" }}
            />
          </div>
          <div className="flex items-center gap-4">
            <TfiMoreAlt />
          </div>
        </div>
      </div>
    </header>
  );
}
