import { useState, useEffect } from "react";
import { Checkbox, Field, Label } from "@headlessui/react";

const CustomCheckBox = ({ value = false, onChange }) => {
  const [enabled, setEnabled] = useState(value);

  // Sync local state when `value` prop changes
  useEffect(() => {
    setEnabled(value);
  }, [value]);

  const handleChange = (checked) => {
    setEnabled(checked);
    onChange?.(checked); // ✅ Pass only the boolean `checked`, NOT the event object
  };

  return (
    <Field className="flex items-center gap-2">
      <Checkbox
        checked={enabled}
        onChange={(checked) => handleChange(checked)} // ✅ Ensure only `true/false` is passed
        className={`group block size-4 rounded border transition-all 
          ${enabled ? "bg-primary border-primary" : "bg-white border-gray-300"}
        `}
      >
        {enabled && (
          <svg
            className="stroke-white w-3 h-3 mx-auto"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M3 8L6 11L11 3.5"
              stroke="white"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </Checkbox>
      <Label className={enabled ? "text-primary" : "text-gray-700"}>
        Set as default Address
      </Label>
    </Field>
  );
};

export default CustomCheckBox;
