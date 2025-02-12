"use client";

import { MdOutlineExplore } from "react-icons/md";
import { CiFilter } from "react-icons/ci";
import { TbShoppingCartCopy } from "react-icons/tb";
import { FaRocketchat } from "react-icons/fa";
import { HeadTypo, BodyTypo, FootTypo } from "../Typography";

const WorkStepSection = () => {
  return (
    <div className="bg-transparent py-12 sm:py-28 lg:py-20 xl:pb-36">
      <div className="mx-auto max-w-[84rem] px-4 sm:px-6 lg:px-0">
        <div className="text-center">
          <HeadTypo label="How it works" />
          <BodyTypo bodylabel="Explore your favorite decorations with ease" />
          <FootTypo footlabel="Create your own style with us and launch it with just 4 easy steps" />
        </div>
        <ul className="mx-auto mt-12 grid max-w-md grid-cols-1 gap-10 sm:mt-16 lg:mt-20 lg:max-w-5xl lg:grid-cols-4">
          <li className="flex-start group relative flex lg:flex-col">
            <span
              className="absolute left-[18px] top-14 h-[calc(100%_-_32px)] w-px bg-gray-300 lg:right-0 lg:left-auto lg:top-[18px] lg:h-px lg:w-[calc(100%_-_72px)]"
              aria-hidden="true"
            ></span>
            <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-300 bg-gray-50 dark:bg-transparent">
              <MdOutlineExplore />
            </div>
            <div className="ml-6 lg:ml-0 lg:mt-10 flex-col">
              <h3 className="text-xl font-bold text-gray-900 before:mb-2 before:block before:font-mono before:text-sm before:text-gray-500 dark:text-zinc-300">
                Explore Inspiration
              </h3>
              <h4 className="mt-2 text-base text-gray-700 dark:text-zinc-300">
                Browse design ideas, themes, and styles.
              </h4>
            </div>
          </li>
          <li className="flex-start group relative flex lg:flex-col">
            <span
              className="absolute left-[18px] top-14 h-[calc(100%_-_32px)] w-px bg-gray-300 lg:right-0 lg:left-auto lg:top-[18px] lg:h-px lg:w-[calc(100%_-_72px)]"
              aria-hidden="true"
            ></span>
            <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-300 bg-gray-50 dark:bg-transparent">
              <CiFilter />
            </div>
            <div className="ml-6 lg:ml-0 lg:mt-10">
              <h3 className="text-xl font-bold text-gray-900 before:mb-2 before:block before:font-mono before:text-sm before:text-gray-500 dark:text-zinc-300">
                Customize Preferences
              </h3>
              <h4 className="mt-2 text-base text-gray-700 dark:text-zinc-300">
                Personalize your choices.
              </h4>
            </div>
          </li>
          <li className="flex-start group relative flex lg:flex-col">
            <span
              className="absolute left-[18px] top-14 h-[calc(100%_-_32px)] w-px bg-gray-300 lg:right-0 lg:left-auto lg:top-[18px] lg:h-px lg:w-[calc(100%_-_72px)]"
              aria-hidden="true"
            ></span>
            <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-300 bg-gray-50 dark:bg-transparent">
              <TbShoppingCartCopy />
            </div>
            <div className="ml-6 lg:ml-0 lg:mt-10">
              <h3 className="text-xl font-bold text-gray-900 before:mb-2 before:block before:font-mono before:text-sm before:text-gray-500 dark:text-zinc-300">
                Browse and Select Products
              </h3>
              <h4 className="mt-2 text-base text-gray-700 dark:text-zinc-300">
                Find suitable furniture and decor.
              </h4>
            </div>
          </li>
          <li className="flex-start group relative flex lg:flex-col">
            <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-300 bg-gray-50 dark:bg-transparent">
              <FaRocketchat />
            </div>
            <div className="ml-6 lg:ml-0 lg:mt-10">
              <h3 className="text-xl font-bold text-gray-900 before:mb-2 before:block before:font-mono before:text-sm before:text-gray-500 dark:text-zinc-300">
                Get in touch with your provider
              </h3>
              <h4 className="mt-2 text-base text-gray-700 dark:text-zinc-300">
                That's it. Happy exploring.
              </h4>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default WorkStepSection;
