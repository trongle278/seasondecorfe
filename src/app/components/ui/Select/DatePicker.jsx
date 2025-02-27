import * as React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import { FaCalendar } from "react-icons/fa";
import { Label } from "../inputs/Label";

export default function BasicDatePicker({ label, selectedDate, onChange, required, value }) {
  const [startDate, setStartDate] = React.useState();
  

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor="gender">{label}</Label>
      <div className="relative flex max-w-sm flex-row items-center justify-start gap-2">
        <div className="flex items-center">
          <FaCalendar size={25} />
        </div>
        <DatePicker
          icon={<FaCalendar />}
          selected={selectedDate}
          onChange={onChange}
          required={required}        
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          placeholderText="Select date"
          dateFormat="dd/MM/yyyy"
          isClearable
          
        />
      </div>
    </div>
  );
}
