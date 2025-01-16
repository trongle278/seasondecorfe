"use client";

import Image from "next/image";
import ButtonInvert from "../Buttons/ButtonInvert";
import { FaLongArrowAltRight } from "react-icons/fa";
import { AnimatedTooltip } from "./components/AnimatedTooltip";
import { people } from "@/app/people";
import { Input } from "../Inputs/Input";
import { IoIosMail } from "react-icons/io";

const ProviderSign = () => {
  return (
    <div className="relative z-20 sm:py-28 lg:py-52 xl:pb-36 mx-auto px-4 sm:px-6 lg:px-0">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-300">
          Become a provider now
        </p>
        <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-zinc-500 dark:text-zinc-300">
          Explore your benefits when become a provider
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg font-normal text-zinc-500 dark:text-zinc-300 lg:text-xl lg:leading-8">
          Fast and Reliable
        </p>
      </div>
      <div className="relative">
        <div className="section1 grid grid-cols-1 md:grid-cols-6 mt-12">
          <div className="p-4 sm:p-32 relative overflow-hidden col-span-1 md:col-span-3 border-r dark:border-neutral-800">
            <p className="mx-auto mt-4 text-lg font-tertiary text-zinc-500 dark:text-zinc-300 lg:text-xl lg:leading-8">
              Our platform is dedicated to connecting users with skilled house
            </p>
            <h2 className="text-black dark:text-primary font-normal text-left max-w-xl mx-0 md:text-sm my-2">
              <ul className="list-disc font-primary py-5 text-sm">
                <li className="my-3">
                  Expand your reach to potential customers seeking house decor
                  services.
                </li>
                <li className="my-4">
                  Boost credibility with ratings and reviews displayed on your
                  profile.
                </li>
                <li>Manage bookings easily through our platform's tools.</li>
                <li className="my-4">
                  Secure and fast payment handling for all your transactions.
                </li>
                <li className="my-4">
                  Flexible scheduling to suit your availability and preferences.
                </li>
                <li className="my-4">
                  Gain insights and analytics to improve your performance.
                </li>
              </ul>
            </h2>
            <div className="flex flex-col mb-4 max-w-xs">
              <Input placeholder="Your email for us to contact" type="text" icon={<IoIosMail />}/>
            </div>

            <ButtonInvert label="Get started" icon={<FaLongArrowAltRight />} />
          </div>
          <div className="section2 p-4 sm:p-8 relative overflow-hidden col-span-1 md:col-span-3">
            <div className="flex flex-col items-center mt-10 mb-3">
              <div className="flex flex-col sm:flex-row mb-2 lg:justify-start justify-center items-center">
                <AnimatedTooltip items={people} />
              </div>
              <p className="text-neutral-400 text-sm ml-8 relative z-40 lg:text-left text-center mb-5">
                Trusted by 27,000+ providers
              </p>
            </div>

            <div className="relative w-full h-[400px] flex items-center justify-center">
              <div
                className="absolute w-[80%] max-w-[220px] aspect-[9/16] transition-all duration-300 hover:z-50 hover:scale-105"
                style={{
                  transform: "translateX(-200px) rotate(0deg)",
                  zIndex: 3,
                  boxShadow:
                    "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
                }}
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <Image
                    src={
                      "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }
                    width={500}
                    height={500}
                    alt="colabimg"
                    className="object-cover w-full h-full inset-0"
                  />
                </div>
              </div>
              <div
                className="absolute w-[80%] max-w-[220px] aspect-[9/16] transition-all duration-300 hover:z-50 hover:scale-105"
                style={{
                  transform: "translateX(0px) rotate(10deg)",
                  zIndex: 2,
                  boxShadow:
                    "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
                }}
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <Image
                    src={
                      "https://images.unsplash.com/photo-1690264461712-d630b81890a4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }
                    width={500}
                    height={500}
                    alt="colabimg"
                    className="object-cover w-full h-full inset-0"
                  />
                </div>
              </div>
              <div
                className="absolute w-[80%] max-w-[220px] aspect-[9/16] transition-all duration-300 hover:z-50 hover:scale-105"
                style={{
                  transform: "translateX(200px) rotate(20deg)",
                  zIndex: 1,
                  boxShadow:
                    "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
                }}
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <Image
                    src={
                      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }
                    width={500}
                    height={500}
                    alt="colabimg"
                    className="object-cover w-full h-full inset-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="common_gridLineHorizontalDark__HxUpx hidden dark:block"
          style={{ top: 0, left: "-10%", width: "120%" }}
        ></div>
        <div
          className="common_gridLineHorizontal__WPmNg block dark:hidden"
          style={{ top: 0, left: "-10%", width: "120%" }}
        ></div>
        <div
          className="common_gridLineHorizontalDark__HxUpx hidden dark:block"
          style={{ bottom: 0, left: "-10%", width: "120%" }}
        ></div>
        <div
          className="common_gridLineHorizontal__WPmNg block dark:hidden"
          style={{ bottom: 0, left: "-10%", width: "120%" }}
        ></div>
        <div
          className="common_gridLineVerticalDark__IgDT_ hidden dark:block"
          style={{ top: "-10%", right: 0, height: "120%" }}
        ></div>
        <div
          className="common_gridLineVertical__V_DBc block dark:hidden"
          style={{ top: "-10%", right: 0, height: "120%" }}
        ></div>
        <div
          className="common_gridLineVerticalDark__IgDT_ hidden dark:block"
          style={{ top: "-10%", left: 0, height: "120%" }}
        ></div>
        <div
          className="common_gridLineVertical__V_DBc block dark:hidden"
          style={{ top: "-10%", left: 0, height: "120%" }}
        ></div>
      </div>
    </div>
  );
};

export default ProviderSign;
