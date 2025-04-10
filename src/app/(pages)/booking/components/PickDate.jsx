"use client";

import React, { useState } from "react";
import { BorderBox } from "@/app/components/ui/BorderBox";
import { FootTypo } from "@/app/components/ui/Typography";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { addDays, format } from "date-fns";
import Button from "@/app/components/ui/Buttons/Button";
import { IoCalendarOutline } from "react-icons/io5";

// Custom styles to override default react-date-range styles
export const customCalendarStyles = `
  .rdrCalendarWrapper {
    width: 100%;
    font-size: 14px;
    background: transparent;
  }
  .rdrMonth {
    width: 100%;
  }
  .rdrMonthAndYearWrapper {
    align-items: center;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .rdrMonthAndYearPickers select {
    font-size: 16px;
  }
  .rdrDayNumber span {
    color: #ff385c;
  }
  .rdrDayDisabled .rdrDayNumber span {
    color: #aaa;
    text-decoration: line-through;
  }
  .rdrDayToday .rdrDayNumber span:after {
    background: #ff385c;
  }
  .rdrSelected {
    background: #ff385c;
  }
  .rdrDateDisplayWrapper {
    display: none;
  }
  .rdrWeekDay {
    color: #222;
    font-weight: 500;
  }
  .rdrDay {
    height: 40px;
  }
`;

const PickDate = ({ availableDates = [], onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateConfirmed, setDateConfirmed] = useState(false);

  // Function to determine if a date is available
  const isDateAvailable = (date) => {
    // This function would check against your availableDates array
    // For demonstration, we'll make specific dates unavailable
    const currentDate = new Date();
    const dateToCheck = new Date(date);
    
    // Only make dates before today unavailable
    return dateToCheck >= currentDate;
  };

  // Custom rendering for dates
  const customDayContentRenderer = (day) => {
    const isAvailable = isDateAvailable(day);
    const dayNum = day.getDate();
    const isToday =
      new Date().setHours(0, 0, 0, 0) === new Date(day).setHours(0, 0, 0, 0);

    return (
      <div
        className={`h-full w-full flex items-center justify-center ${
          isAvailable ? "text-black font-medium" : "text-gray-300 line-through"
        } ${isToday ? "bg-rose-500 rounded-full text-white" : ""}`}
      >
        {dayNum}
      </div>
    );
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    
    // Pass the selected date to parent component
    if (onDateSelect) {
      const formattedDate = format(date, "yyyy-MM-dd");
      onDateSelect({
        date: formattedDate,
        formattedDate: format(date, "MMMM d, yyyy")
      });
    }
  };

  return (
    <BorderBox className="shadow-xl p-4">
      <div className="flex flex-col gap-2">
        <FootTypo
          footlabel="Pick your desired date to survey"
          className="!m-0 font-bold text-lg"
        />
        <FootTypo
          footlabel="This schedule is the latest updated from the provider"
          className="!m-0 font-normal text-sm"
        />

        {/* Add custom styles to the document */}
        <style jsx global>
          {customCalendarStyles}
        </style>

        <div className="mt-2 border-2 border-black dark:border-white rounded-lg overflow-hidden bg-white">
          <Calendar
            date={selectedDate || new Date()}
            onChange={handleDateChange}
            minDate={new Date()}
            maxDate={addDays(new Date(), 90)}
            dayContentRenderer={customDayContentRenderer}
            color="#ff385c"
            showDateDisplay={false}
            showMonthAndYearPickers={true}
            showPreview={false}
            showMonthArrow={true}
            rangeColors={["#ff385c"]}
          />
        </div>

        <div className="mt-6">
          {selectedDate ? (
            <FootTypo
              footlabel={`Selected date: ${format(selectedDate, "MMMM d, yyyy")}`}
              className="!m-0 font-semibold text-md mb-3"
            />
          ) : (
            <FootTypo
              footlabel="Please select a date for your survey"
              className="!m-0 font-semibold text-md mb-3 text-gray-500"
            />
          )}
        </div>
      </div>
    </BorderBox>
  );
};

export default PickDate;
