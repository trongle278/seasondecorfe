"use client";
import { Label } from "@/app/components/ui/inputs/Label";
import { Field, Textarea } from "@headlessui/react";
import Input from "@/app/components/ui/inputs/Input";
import { FaPercent } from "react-icons/fa6";
import { IoWarning } from "react-icons/io5";

const Term = ({
  register,
  value = "",
  depositPercentage = 20,
  onTermsChange,
  onDepositChange,
}) => {
  return (
    <div className="space-y-4">
      <Label htmlFor="terms">Terms & Conditions</Label>
      <div className="w-full">
        <Field>
          <Textarea
            id="terms"
            name="terms"
            defaultValue={value}
            onChange={onTermsChange}
            placeholder="Terms & Conditions"
            className={`
      mt-3 block w-full resize-none rounded-lg border-[1px] 
      border-black dark:border-gray-600 py-1.5 px-3 text-sm/6 
      bg-white dark:bg-gray-800 text-black dark:text-white
      placeholder-gray-500 dark:placeholder-gray-400
      focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white
      transition duration-200
    `}
            rows={7}
          />
        </Field>
        <div className="flex flex-row items-center mt-5 gap-3">
          <Label htmlFor="depositPercentage">Deposit Percentage</Label>
          <Input
            id="depositPercentage"
            name="depositPercentage"
            defaultValue={depositPercentage}
            onChange={onDepositChange}
            register={register}
            placeholder="Deposit Percentage"
            type="text"
            min="0"
            max="20"
            maxLength={2}
            className="pl-3 max-w-20"
          />
          <FaPercent size={20} />
        </div>
        <span className="text-sm flex flex-row items-center gap-2 text-rose-600 mt-3">
          <IoWarning size={20} />
          The deposit percentage must be between 0 and 20.
        </span>
      </div>
    </div>
  );
};

export default Term;
