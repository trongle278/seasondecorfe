import LineList from "./Linelist";
import ButtonInvert from "../Buttons/ButtonInvert";
import clsx from "clsx";
import { FaDongSign } from "react-icons/fa6";
import { FaCirclePlus } from "react-icons/fa6";
import Link from "next/link";
import { BorderBox } from "../BorderBox";

const PricingCard = ({
  pkgRank,
  cardcontent1,
  cardcontent2,
  cardcontent3,
  cardcontent4,
  cardcontent5,
  price,
  className,
  clickToBuy,
}) => {
  return (
    <div
      className={clsx(
        "rounded-3xl border border-gray-100 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-900 md:p-4",
        className
      )}
    >
      <div className="inside-content flex h-full flex-col justify-start gap-4">
        <div className="flex h-full flex-col justify-start gap-4">
          <BorderBox>
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-2">
                <p className="text-lg font-medium text-black dark:text-white">
                  {pkgRank}
                </p>
                <span className="inline-block rounded-md text-xs tracking-tight text-neutral-600 dark:text-neutral-200">
                  One-time Purchase
                </span>
              </div>
            </div>
            <div className="mt-8">
              <div className="flex items-end">
                <span className="flex items-end">
                  <FaDongSign />
                </span>
                <div className="flex items-start gap-2">
                  <span className="text-4xl font-bold text-neutral-800 dark:text-neutral-200 md:text-7xl">
                    {price}
                  </span>
                </div>
              </div>
            </div>
            <ButtonInvert
              label="Buy now"
              className="space-x-2 cursor-pointer transition duration-200 p-px font-semibold px-4 py-2 sm:w-44 rounded-lg text-sm text-center items-center justify-center z-20  text-white mb-4 mt-10 w-full md:w-full"
              onClick={clickToBuy}
            />
          </BorderBox>
          <ul
            role="list"
            className="text-lightGrey  space-y-3 text-sm leading-6 sm:mt-10 dark:text-neutral-100 mt-1 p-4"
          >
            <LineList content={cardcontent1} />
            <LineList content={cardcontent2} />
            <LineList content={cardcontent3} />
            <LineList content={cardcontent4} />
            <LineList content={cardcontent5} />
          </ul>
        </div>
        <div className="relative">
          <div className="h-px w-full bg-white dark:bg-neutral-950"></div>
          <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800"></div>
          <div className="absolute inset-0 m-auto flex h-5 w-5 items-center justify-center rounded-xl bg-white shadow-[0px_-1px_0px_0px_var(--neutral-200)] dark:bg-neutral-800 dark:shadow-[0px_-1px_0px_0px_var(--neutral-700)]">
            <FaCirclePlus />
          </div>
        </div>
        <div className="py-4">
          <Link className="w-full px-4 text-left text-sm text-neutral-500 hover:underline dark:text-neutral-200" href="#">
            Questions? Chat with us.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
