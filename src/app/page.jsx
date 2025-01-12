"use client";

import { SiAdguard } from "react-icons/si";
import { IoPricetagsSharp } from "react-icons/io5";
import { MdContactSupport } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi";
import { AnimationBackground } from "./components/ui/AnimationBg";
import Button2 from "./components/ui/Buttons/Button2";
import { FaAngleRight } from "react-icons/fa6";
import { FlipWords } from "./components/ui/Flipword";
import { BannerCarousel } from "./components/BannerCarousel";
import {
  WhiteBgButon,
  BlackBgButton,
} from "./components/ui/Buttons/Button2colors";

export default function Main() {
  const words = ["spring", "summer", "autumn ", "winter"];

  return (
    <>
      <AnimationBackground>
        <div className="relative pb-40 bg-transparent dark:bg-transparent  pt-20 md:pt-20 overflow-hidden px-2 md:px-4 lg:px-8 ">
          <div className="max-w-[84rem] w-full mx-auto  relative">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 pb-10 md:pb-40">
              <div className="left-wrapper flex flex-col items-start xl:px-0 px-8 py-40">
                <Button2
                  label="Introducing new decorations"
                  icon={<FaAngleRight />}
                />
                <h1 className="text-4xl md:text-7xl font-bold mb-6 relative text-left dark:text-zinc-100 text-zinc-700 max-w-4xl">
                  <span
                    style={{
                      display: "inline-block",
                      verticalAlign: "top",
                      textDecoration: "inherit",
                      textWrap: "balance",
                    }}
                  >
                    We bring you the best decorations
                    <br />
                    for
                    <FlipWords words={words} />
                  </span>
                </h1>
                <h2 className="relative text-sm sm:text-xl text-zinc-500 dark:text-zinc-300 tracking-wide mb-8 text-left max-w-2xl antialiased leading-loose">
                  Our platform is dedicated to connecting users with skilled
                  house decorators from all over. Whether you're looking to
                  refresh a single room or transform your entire home, we
                  connect you with the right decorators, no matter where you
                  are.
                </h2>
                <div className="flex relative sm:flex-row flex-col space-y-2 justify-center sm:space-y-0 sm:space-x-4 sm:justify-start mb-4 w-full">
                  <WhiteBgButon whiteBtnlable="Browse providers" />
                  <BlackBgButton blackBtnlable="Custom design" />
                </div>
                <div className="relative mt-10">
                  <div className="block sm:hidden absolute h-full w-20 bg-white dark:bg-black right-0 [mask-image:linear-gradient(to_left,white,transparent)] z-40"></div>
                  <div
                    className="flex  justify-start items-center mb-4 overflow-x-auto relative z-20 no-visible-scrollbar "
                    style={{ scrollbarWidth: "none" }}
                  >
                    <div className="flex items-center space-x-2 mr-4">
                      <span>
                        <SiAdguard size={20} />
                      </span>
                      <span className="text-sm font-semibold text-neutral-500 flex-shrink-0">
                        Credibility
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mr-4">
                      <span>
                        <IoPricetagsSharp size={20} />
                      </span>
                      <span className="text-sm font-semibold text-neutral-500 flex-shrink-0">
                        Reasonable price
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mr-4">
                      <span>
                        <HiUserGroup size={20} />
                      </span>
                      <span className="text-sm font-semibold text-neutral-500 flex-shrink-0">
                        Big community
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mr-4">
                      <span>
                        <MdContactSupport size={20} />
                      </span>
                      <span className="text-sm font-semibold text-neutral-500 flex-shrink-0">
                        24/7 Support
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden xl:block w-full h-full relative">
                <BannerCarousel />
              </div>
            </div>
          </div>
        </div>
      </AnimationBackground>
    </>
  );
}
