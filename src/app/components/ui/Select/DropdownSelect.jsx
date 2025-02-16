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

const people = [
  { id: 0, name: "Female" },
  { id: 1, name: "Male" },
];
export default function DropdownSelect({ label, gender, onChange }) {
  const [selectedGender, setSelectedGender] = React.useState(gender || "None");
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="gender">{label}</Label>

      <Listbox
        value={selectedGender}
        onChange={(value) => {
          setSelectedGender(value);
          onChange(value); // Notify parent component
        }}
      >
        <ListboxButton
          className={clsx(
            "relative block w-full rounded-lg bg-gray-100 py-1.5 pl-3 pr-8 text-left text-sm/6 text-black",
            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2"
          )}
        >
          {selectedGender}
          <RiArrowDropDownLine
            size={20}
            className="group pointer-events-none absolute right-2.5 top-2.5 size-4 fill-black"
            aria-hidden="true"
          />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom"
          transition
          className={clsx(
            "mt-1 w-[var(--button-width)] rounded-xl border border-black bg-black p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none",
            "z-50 transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 dark:bg-white"
          )}
        >
          {people.map((person) => (
            <ListboxOption
              key={person.name}
              value={person.name}
              className="group flex cursor-default select-none items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-white/10"
            >
              <div className="text-sm/6 text-white dark:text-black cursor-pointer">
                {person.name}
              </div>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  );
}
