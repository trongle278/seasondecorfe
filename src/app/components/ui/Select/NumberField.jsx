import React from "react";
import { NumberField } from "@base-ui-components/react/number-field";
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";

export default function ExampleNumberField() {
  const id = React.useId();
  return (
    <NumberField.Root
      id={id}
      defaultValue={1}
      min={1}
      max={9999}
      className=""
    >
      <NumberField.ScrubArea className="cursor-ew-resize">
        <NumberField.ScrubAreaCursor className="drop-shadow-[0_1px_1px_#0008] filter dark:drop-shadow-[0_1px_1px_#fff8]">
          <CursorGrowIcon />
        </NumberField.ScrubAreaCursor>
      </NumberField.ScrubArea>

      <NumberField.Group className="flex">
        <NumberField.Decrement className="flex size-6 items-center justify-center rounded-tl-md rounded-bl-md border border-gray-200 bg-gray-50 text-gray-900 select-none hover:bg-gray-100 active:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 dark:active:bg-gray-600">
          <FaMinus />
        </NumberField.Decrement>
        <NumberField.Input className="h-6 w-24 border-t border-b border-gray-200 text-center text-lg text-gray-900 tabular-nums focus:z-1 focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:outline-blue-400" />
        <NumberField.Increment className="flex size-6 items-center justify-center rounded-tr-md rounded-br-md border border-gray-200 bg-gray-50 text-gray-900 select-none hover:bg-gray-100 active:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 dark:active:bg-gray-600">
          <FaPlus />
        </NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  );
}

function CursorGrowIcon(props) {
  return (
    <svg
      width="26"
      height="14"
      viewBox="0 0 24 14"
      fill="black"
      stroke="white"
      className="dark:fill-white dark:stroke-black"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M19.5 5.5L6.49737 5.51844V2L1 6.9999L6.5 12L6.49737 8.5L19.5 8.5V12L25 6.9999L19.5 2V5.5Z" />
    </svg>
  );
}

