import {
  Field,
  Label,
  Radio,
  RadioGroup as HeadlessRadioGroup,
} from "@headlessui/react";
import { useState, useEffect } from "react";

export function RadioGroup({ options = [], value, onChange, label }) {
  const [selected, setSelected] = useState(value || "");

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleChange = (newValue) => {
    setSelected(newValue);
    onChange?.(newValue); // Notify parent component
  };

  return (
    <>
    <div className="text-sm font-semibold">{label}</div>
      <HeadlessRadioGroup
        value={selected}
        onChange={handleChange}
        aria-label="Options"
        className="flex flex-row items-center gap-5"
      >
        {options.map((option) => (
          <Field key={option} className="flex items-center gap-2">
            <Radio
              value={option}
              className="group flex size-5 items-center justify-center rounded-full border bg-white data-[checked]:bg-primary"
            >
              <span className="invisible size-2 rounded-full bg-white group-data-[checked]:visible" />
            </Radio>
            <Label>{option}</Label>
          </Field>
        ))}
      </HeadlessRadioGroup>
    </>
  );
}
