import React from "react";
import { Compare } from "./Compare";

export function CompareCard({ firsImage, secondImage }) {
  return (
    <div className="w-full h-[80vh]">
      <Compare
        firstImage={firsImage}
        secondImage={secondImage}
        firstImageClassName="object-cover"
        secondImageClassname="object-cover"
        className="h-full w-full md:h-[90vh] md:w-full"
        slideMode="hover"
      />
    </div>
  );
}

export default CompareCard;
