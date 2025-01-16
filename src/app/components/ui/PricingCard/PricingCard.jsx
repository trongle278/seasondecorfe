import LineList from "./Linelist";
import ButtonInvert from "../Buttons/ButtonInvert";
import clsx from "clsx";

const PricingCard = ({cardcontent1, cardcontent2, cardcontent3, cardcontent4, cardcontent5, price, description, className, contentStyle, clickToBuy }) => {
  return (
    <div className={clsx(className)}>
      <div className="inside-content">
        <h3
          id="tier-1"
          className="text-emerald-600 text-base font-semibold leading-7"
        >
          Benefits
        </h3>
        <p className="mt-4 gap-x-2">
          <span className="dark:text-white text-gray-500 text-sm block h-6">
            Pause or cancel anytime
          </span>
          <span className="text-lightGrey text-4xl font-bold tracking-tight dark:text-white">
            {price}
          </span>
        </p>
        <p className="text-lightGrey mt-6 text-sm leading-7 dark:text-neutral-200 h-24 md:h-32 xl:h-24">
          All the features that are available on the website are free
          to use.
        </p>
        <ul
          role="list"
          className="text-lightGrey mt-8 space-y-3 text-sm leading-6 sm:mt-10 dark:text-neutral-100"
        >
          <LineList content={cardcontent1} />
          <LineList content={cardcontent2} />
          <LineList content={cardcontent3} />
          <LineList content={cardcontent4} />
          <LineList content={cardcontent5}  />
        </ul>
      </div>
      <div className="text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-20 block w-full">
        <ButtonInvert label="Buy now" className="w-full" onClick={clickToBuy}/>
      </div>
    </div>
  );
};

export default PricingCard;
