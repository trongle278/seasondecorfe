import Logo from "../../Logo";
import { people } from "@/app/people";
import { ButtonInvert2 } from "../Buttons/ButtonInvert";
import { AnimatedTooltip } from "./components/AnimatedTooltip";
import { FaStar } from "react-icons/fa";
import { ColourfulTextSection } from "../ColorfulText";

const LandingEndSection = () => {
  return (
    <div className="sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl py-24 ">
        <div className="relative isolate overflow-hidden bg-gradient-to-br from-slate-900 to-slate-500 pl-6 pt-16 shadow-2xl sm:rounded-3xl sm:pl-16 md:pt-24 lg:flex lg:gap-x-20 lg:pl-24 lg:pt-0">
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto py-10 lg:py-10 lg:text-left">
            <Logo />
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mt-4">
              Want a styled house that suit you ? Get in touch!
            </h2>
            <p className="mt-6 text-lg leading-8 text-neutral-200">
              <span
                style={{
                  display: "inline-block",
                  verticalAlign: "top",
                  textDecoration: "inherit",
                  textWrap: "balance",
                }}
              >
                Experience the magic of a stunning website designed and
                developed just for you! ✨
              </span>
            </p>
            <ButtonInvert2 label="Book now" />
            <div className="mt-10">
              <div className="flex flex-row mb-10 lg:justify-start justify-center items-center">
                <AnimatedTooltip items={people} />
                <div className="flex justify-center ml-6">
                  <FaStar
                    color="yellow"
                    className="h-4 w-4 text-yellow-400 mx-1"
                  />
                  <FaStar
                    color="yellow"
                    className="h-4 w-4 text-yellow-400 mx-1"
                  />
                  <FaStar
                    color="yellow"
                    className="h-4 w-4 text-yellow-400 mx-1"
                  />
                  <FaStar
                    color="yellow"
                    className="h-4 w-4 text-yellow-400 mx-1"
                  />
                  <FaStar
                    color="yellow"
                    className="h-4 w-4 text-yellow-400 mx-1"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="relative  hidden lg:flex items-center w-full">
          <ColourfulTextSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingEndSection;
