import React from "react";
import { Rating } from "@mui/material";

const RatingBar = ({ value, maxValue = 5, count = 0 }) => {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

  return (
    <div className="flex items-center gap-4 w-full">
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-black dark:bg-white rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-gray-500 dark:text-gray-400 min-w-[30px] text-right">
        {count}
      </span>
    </div>
  );
};

const OverallRating = ({
  overallRating = 5.0,
  rateCount = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  },
  totalReviews = 0,
}) => {
  // Array of rating levels for the bars
  const ratingLevels = [5, 4, 3, 2, 1];

  // Calculate total count of all ratings
  const totalRatings =
    Object.values(rateCount).reduce((sum, count) => sum + count, 0) ||
    totalReviews ||
    1;

  return (
    <div className="w-full my-6 pb-6 text-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Overall Rating Column */}
        <div className="md:w-1/3 flex flex-col items-center justify-center">
          <div className="text-center mb-2">
            <span className="font-bold text-5xl">
              {overallRating?.toFixed(1) || "0.0"}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
              out of 5
            </span>
          </div>

          <Rating
            value={Number(overallRating) || 0}
            readOnly
            precision={0.5}
            size="medium"
            className="mb-2"
          />

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {totalRatings} {totalRatings === 1 ? "review" : "reviews"}
          </p>
        </div>

        {/* Rating Bars Column */}
        <div className="md:w-2/3">
          <div className="space-y-3 max-w-xl">
            {ratingLevels.map((level) => (
              <div key={level} className="flex items-center gap-2">
                <span className="w-4 text-gray-700 dark:text-gray-300">
                  {level}
                </span>
                <RatingBar
                  value={rateCount[level] || 0}
                  maxValue={totalRatings}
                  count={rateCount[level] || 0}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallRating;
