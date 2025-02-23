"use client";

import Button2 from "./components/ui/Buttons/Button2";
import { FaAngleRight } from "react-icons/fa6";
import RotatingText from "./components/ui/animated/Flipword";
import {
  WhiteBgButon,
  BlackBgButton,
} from "./components/ui/Buttons/Button2colors";
import ProductSection from "./components/ui/landing/ProductSection";
import HighlightSection from "./components/ui/landing/HighlightSection";
import InspiredSection from "./components/ui/landing/InspiredSection";
import ScrollAnimationWrapper from "./components/ScrollAnimation";
import ProviderSign from "./components/ui/landing/ProviderSign";
import MainWrapper from "./components/MainWrapper";
import { ProviderSpotlight } from "./components/ui/landing/ProviderSpotlight";
import { FeaturesSection } from "./components/ui/landing/FeatureSection";
import LandingEndSection from "./components/ui/landing/LandingEndSection";
import { AnimatedTooltip } from "./components/ui/landing/components/AnimatedTooltip";
import { people } from "@/app/people";
import DisclosureSection from "./components/ui/landing/Disclosure";

export default function Main() {
  const words = ["spring", "summer", "autumn ", "winter"];

  return (
    <>
      <MainWrapper>
        <div className="w-full mx-auto  relative">
          <div className="">
            <div className="left-wrapper relative pb-4 md:pb-20 flex flex-col items-center justify-center px-8  md:px-8 overflow-hidden ">
              <div className="relative flex flex-col items-center justify-center">
                <Button2
                  label="Introducing new decorations"
                  btnClass="mb-0"
                  labelClass="py-1.5 px-4"
                  icon={<FaAngleRight />}
                />
                <h1 className="text-4xl md:text-6xl font-bold mb-8 mt-20 relative text-center text-zinc-700 max-w-6xl mx-auto !leading-snug dark:text-white">
                  Style Your Demand House
                  <span>
                    <br className="hidden md:block" />
                    <div className="flex whitespace-pre gap-3 justify-center items-center">
                      {" "}
                      For
                      <RotatingText
                        texts={["Spring", "Summer", "Fall", "Winter"]}
                        mainClassName="px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-start rounded-lg w-fit mt-3"
                        staggerFrom={"last"}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-120%" }}
                        staggerDuration={0.025}
                        splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                        transition={{
                          type: "spring",
                          damping: 30,
                          stiffness: 400,
                        }}
                        rotationInterval={3000}
                      />
                    </div>
                  </span>
                </h1>
                <h2 className="relative font-regular text-base md:text-xl text-zinc-500 dark:text-white tracking-wide mb-8 text-center max-w-3xl mx-auto antialiased">
                  Our platform is dedicated to connecting users with skilled
                  house decorators from all over. Whether you're looking to
                  refresh a single room or transform your entire home, we
                  connect you with the right decorators, no matter where you
                  are.
                </h2>
                <div className="flex relative sm:flex-row flex-col space-y-2 justify-center dark:text-white sm:space-y-0 sm:space-x-4 sm:justify-center mb-4 w-full">
                  <WhiteBgButon whiteBtnlable="Browse providers" />
                  <BlackBgButton blackBtnlable="Custom design" />
                </div>
                <div>
                  <h2 className="text-neutral-500 text-center my-4 relative z-40 dark:text-white">
                    Trusted by Founders and Entrepreneurs from all over the
                    world
                  </h2>
                  <div className="flex flex-row items-center justify-center mb-10">
                    <AnimatedTooltip items={people} />
                  </div>
                </div>
              </div>

              <HighlightSection />
            </div>
          </div>
        </div>

        <ScrollAnimationWrapper>
          <InspiredSection />
        </ScrollAnimationWrapper>

        <ScrollAnimationWrapper>
          <ProductSection />
        </ScrollAnimationWrapper>

        <ScrollAnimationWrapper>
          <ProviderSign />
        </ScrollAnimationWrapper>
        <ProviderSpotlight />

        <ScrollAnimationWrapper>
          <FeaturesSection />
        </ScrollAnimationWrapper>

        <ScrollAnimationWrapper>
          <DisclosureSection />
        </ScrollAnimationWrapper>

        <ScrollAnimationWrapper>
          <LandingEndSection />
        </ScrollAnimationWrapper>
      </MainWrapper>
    </>
  );
}
