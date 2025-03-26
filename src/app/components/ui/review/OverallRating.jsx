import React from "react";
import { 
  FaSprayCan, 
  FaCheckCircle, 
  FaSearchLocation,
  FaCommentDots, 
  FaMapMarkerAlt, 
  FaTags
} from "react-icons/fa";
import { FootTypo } from "../Typography";

const RatingBar = ({ value, maxValue = 5 }) => {
  const percentage = (value / maxValue) * 100;
  
  return (
    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div 
        className="h-full bg-black dark:bg-white rounded-full" 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

const RatingCategory = ({ label, value, icon }) => {
  return (
    <div className="flex flex-col h-full justify-between px-4 border-l border-gray-200 dark:border-gray-700">
      <div className="flex flex-col items-start mb-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-bold">{value.toFixed(1)}</span>
      </div>
      <div className="flex justify-start items-center">
        {icon}
      </div>
    </div>
  );
};

const OverallRating = ({ 
  overallRating = 5.0,
  cleanliness = 5.0, 
  accuracy = 5.0, 
  checkIn = 5.0, 
  communication = 4.9, 
  location = 4.9, 
  value = 4.8
}) => {
  // Array of rating levels for the bars
  const ratingLevels = [5, 4, 3, 2, 1];
  
  return (
    <div className="w-full my-6 pb-20 text-sm border-b border-gray-200 dark:border-gray-700">
      <FootTypo footlabel="Ratings" className="font-bold mb-6" />
      
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {/* Overall Rating Column */}
        <div className="md:pr-4">
          <h3 className="font-medium mb-2">Overall rating</h3>
          <div className="space-y-1">
            {ratingLevels.map((level) => (
              <div key={level} className="flex items-center gap-2">
                <span className="w-4">{level}</span>
                <RatingBar 
                  value={level === Math.round(overallRating) ? 1 : 0} 
                  maxValue={1} 
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Rating Categories */}
        <div className="col-span-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <RatingCategory 
            label="Cleanliness" 
            value={cleanliness} 
            icon={<FaSprayCan size={32} />} 
          />
          <RatingCategory 
            label="Accuracy" 
            value={accuracy} 
            icon={<FaCheckCircle size={32} />} 
          />
          <RatingCategory 
            label="Check-in" 
            value={checkIn} 
            icon={<FaSearchLocation size={32} />} 
          />
          <RatingCategory 
            label="Communication" 
            value={communication} 
            icon={<FaCommentDots size={32} />} 
          />
          <RatingCategory 
            label="Location" 
            value={location} 
            icon={<FaMapMarkerAlt size={32}/>} 
          />
          <RatingCategory 
            label="Value" 
            value={value} 
            icon={<FaTags size={32} />} 
          />
        </div>
      </div>
    </div>
  );
};

export default OverallRating;
