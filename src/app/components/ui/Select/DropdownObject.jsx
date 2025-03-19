import * as React from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import clsx from "clsx";
import { RiArrowDropDownLine } from "react-icons/ri";
import { Label } from "../inputs/Label";

export default function DropdownSelectReturnObj({
  label,
  options = [],
  value,
  onChange,
  labelKey = "name", // Default key for displaying labels
  valueKey = "value", // Key for identifying values
  returnObject = false, // Flag to determine return type
  lisboxClassName,
}) {
  const getDefaultSelected = () => {
    if (value) return value;
    if (options.length > 0) return options[0];
    return null;
  };

  const [selected, setSelected] = React.useState(getDefaultSelected());

  return (
    <div className="flex flex-col gap-2">
      {label && <Label htmlFor="dropdown">{label}</Label>}

      <Listbox
        value={selected}
        onChange={(selectedOption) => {
          setSelected(selectedOption);
          onChange?.(returnObject ? selectedOption : selectedOption[labelKey]); // Conditional return
        }}
      >
        <ListboxButton
          className={clsx(
            "relative block w-full rounded-lg bg-gray-100 py-1.5 pl-3 pr-8 text-left text-sm text-black",
            "focus:outline-none focus:ring-2 focus:ring-gray-400"
          )}
        >
          {selected ? selected[labelKey] : "Select"}
          <RiArrowDropDownLine
            size={20}
            className="absolute right-2.5 top-2.5 size-4 fill-black"
            aria-hidden="true"
          />
        </ListboxButton>

        <ListboxOptions
          modal={false}
          className={clsx(
            "absolute w-fit rounded-xl border border-gray-300 bg-white p-1 shadow-lg",
            "z-50 transition-opacity duration-100 ease-in max-h-60 overflow-y-auto",
            lisboxClassName
          )}
        >
          {options.map((option, index) => (
            <ListboxOption
              key={option[valueKey] || `${option[labelKey]}-${index}`}
              value={option}
              className="group flex cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-gray-200"
            >
              <div className="text-sm text-black">{option[labelKey]}</div>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  );
}
