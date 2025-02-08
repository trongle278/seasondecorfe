"use client";

import { AnimationBackground } from "./components/ui/AnimationBg";
import Button2 from "./components/ui/Buttons/Button2";
import { FaAngleRight } from "react-icons/fa6";
import { FlipWords } from "./components/ui/Flipword";
import { BannerCarousel } from "./components/BannerCarousel";
import {
  WhiteBgButon,
  BlackBgButton,
} from "./components/ui/Buttons/Button2colors";
import WorkStepSection from "./components/ui/landing/WorkStepSection";
import HighlightSection from "./components/ui/landing/HighlightSection";
import InspiredSection from "./components/ui/landing/InspiredSection";
import ScrollAnimationWrapper from "./components/ScrollAnimation";
import ProviderSign from "./components/ui/landing/ProviderSign";
import MainWrapper from "./components/MainWrapper";
import { ProviderSpotlight } from "./components/ui/landing/ProviderSpotlight";
import { FeaturesSection } from "./components/ui/landing/FeatureSection";
import LandingEndSection from "./components/ui/landing/LandingEndSection";

export default function Main() {
  const words = ["spring", "summer", "autumn ", "winter"];

  return (
    <>
      <MainWrapper>
        <div className="max-w-[84rem] w-full mx-auto  relative">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 pb-10 md:pb-20">
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
                Our platform is dedicated to connecting users with skilled house
                decorators from all over. Whether you're looking to refresh a
                single room or transform your entire home, we connect you with
                the right decorators, no matter where you are.
              </h2>
              <div className="flex relative sm:flex-row flex-col space-y-2 justify-center sm:space-y-0 sm:space-x-4 sm:justify-start mb-4 w-full">
                <WhiteBgButon whiteBtnlable="Browse providers" />
                <BlackBgButton blackBtnlable="Custom design" />
              </div>
              <HighlightSection />
            </div>
            <div className="hidden xl:block w-full h-full relative">
              <BannerCarousel />
            </div>
          </div>
        </div>
        <ScrollAnimationWrapper>
          <WorkStepSection />
        </ScrollAnimationWrapper>

        <ScrollAnimationWrapper>
          <InspiredSection />
        </ScrollAnimationWrapper>

        <ScrollAnimationWrapper>
          <ProviderSign />
        </ScrollAnimationWrapper>
        <ProviderSpotlight />

        <ScrollAnimationWrapper>
          <FeaturesSection />
        </ScrollAnimationWrapper>

        <ScrollAnimationWrapper>
          <LandingEndSection />
        </ScrollAnimationWrapper>
      </MainWrapper>
    </>
  );
}
