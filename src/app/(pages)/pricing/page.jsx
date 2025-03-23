"use client";
import * as React from "react";
import MainWrapper from "@/app/components/MainWrapper";
import PricingCard from "@/app/components/ui/PricingCard/PricingCard";
import { toast } from "sonner";
import { FeaturesSection } from "@/app/components/ui/landing/FeatureSection";
import ScrollAnimationWrapper from "@/app/components/ScrollAnimation";
import LandingEndSection from "@/app/components/ui/landing/LandingEndSection";
import { NextSeo } from "next-seo";


const PricingPage = () => {

  React.useEffect(() => {
    document.title = "Pricing | SeasonDecor";
  }, []);

  
  return (
    <>
      <NextSeo
        title="Simple Usage Example"
        description="A short description goes here."
      />
      <MainWrapper>
        <div className="relative z-20 mx-auto">
          <div className="relative isolate mx-auto max-w-7xl bg-transparent px-4 py-0 sm:py-10 lg:px-4">
            <div
              className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
              aria-hidden
            ></div>
            <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                Explore our membership packages
              </h1>
            </div>
            <p className="mx-auto mt-6 mb-20 max-w-lg text-center text-lg leading-8 text-gray-600 dark:text-gray-200">
              From varity styles to complete your house tailored to your needs.
              Simple pricing, no hidden fees.
            </p>
            <div className="mx-auto mt-20 grid grid-cols-1 items-start gap-4 max-w-[83rem] md:grid-cols-2 xl:grid-cols-3">
              <PricingCard
                className=""
                pkgRank="Silver"
                price="100.000"
                cardcontent1="Essential Home Makeover Package"
                cardcontent2="Starter Decor Delight"
                cardcontent3="Foundations of Elegance"
                cardcontent4="Compact Decor Transformation"
                cardcontent5="Basic Style Revamp"
                clickToBuy={() => toast.success("Success`")}
              />
              <PricingCard
                className=""
                pkgRank="Gold"
                price="200.000"
                cardcontent1="Enhanced Home Elegance Package"
                cardcontent2="Premium Decor Upgrade"
                cardcontent3="Style Redefined Package"
                cardcontent4="Advanced Decor Mastery"
                cardcontent5="Home Harmony Package"
              />
              <PricingCard
                className=""
                pkgRank="Platinum"
                price="500.000"
                cardcontent1="Premium Home Refinement Package"
                cardcontent2="Exclusive Decor Expertise"
                cardcontent3="Unique Style Customization"
                cardcontent4="Mastering Decor Excellence"
                cardcontent5="Home Style Revolution"
              />
            </div>
          </div>
        </div>
        <ScrollAnimationWrapper>
          <FeaturesSection />
        </ScrollAnimationWrapper>

        <ScrollAnimationWrapper>
          <LandingEndSection />
        </ScrollAnimationWrapper>
      </MainWrapper>
    </>
  );
};

export default PricingPage;
