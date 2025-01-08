"use client";

import Link from "next/link";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { IoIosArrowDown } from "react-icons/io";
import DropdownSection from "./Dropdown";
import ThemeSwitch from "../../ThemeSwitch";
import HeaderWrapping from "../../HeaderWrapping";
import Button from "../../ui/Button";

export default function Header() {
  return (
    <header
      className="fixed top-0 left-0 w-[100%] z-500 font-base translate-y-[1.3rem] duration-duration-slow ease-out"
      tabIndex="-1"
    >
      <div className="absolute inset-x-[-1.3rem] inset-y-0 bg-transparent transition-opacity-duration-slow ease-out"></div>
      <div className="header-container grid grid-cols-[1fr_auto_1fr] gap-xl items-center p-5 pointer-events-none relative">
        <section className="left-wrapper desktop-only pointer-events-auto flex flex-row">
          <div className="flex items-center gap-4 transition-all">
            <div className="relative group px-2 py-3 transition-all">
              <p className="flex cursor-pointer items-center gap-2 group-hover:text-red">
                <span>Providers</span>
                <IoIosArrowDown className="rotate-180 transition-all group-hover:rotate-0" />
              </p>
              <DropdownSection items="hello" />
            </div>
            <div className="relative group px-2 py-3 transition-all">
              <p className="flex cursor-pointer items-center gap-2 group-hover:text-red">
                <span>Features</span>
                <IoIosArrowDown className="rotate-180 transition-all group-hover:rotate-0" />
              </p>
              <DropdownSection items="hello2" />
            </div>
            <div className="relative group px-2 py-3 transition-all">
              <p className="flex cursor-pointer items-center gap-2 group-hover:text-red">
                <span>Pricing</span>
                <IoIosArrowDown className="rotate-180 transition-all group-hover:rotate-0" />
              </p>
              <DropdownSection items="hello" />
            </div>
          </div>
        </section>
        <div className="center-wrapper">SeasonDecor</div>
        <div className="right-wrapper flex gap-[1.4rem] items-center justify-end pointer-events-auto min-w-fit">
          <div className="search-container text-black">
            <button className="flex relative justify-start items-center text-sm text-muted-foreground dark:border-white/[0.2] py-2 w-fit border border-transparent shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] px-4 rounded-xl bg-white dark:bg-brand">
              <SearchOutlinedIcon className="text-muted-foreground dark:text-black" />
              <span className="transition-colors hover:text-foreground/80 text-foreground/60 text-xs sm:text-sm font-medium pl-2 pr-4">
                Search for anything
              </span>
            </button>
          </div>

          <Button label="Login" />
          <ThemeSwitch />
        </div>
      </div>
    </header>
  );
}
