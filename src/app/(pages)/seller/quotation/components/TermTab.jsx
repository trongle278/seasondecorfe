"use client";
import { Label } from "@/app/components/ui/inputs/Label";
import { Field, Textarea } from "@headlessui/react";
import Input from "@/app/components/ui/inputs/Input";

const Term = ({ 
  register, 
  value = "", 
  depositPercentage = 30, 
  onTermsChange, 
  onDepositChange 
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
        <div className="mt-5">
          <Label htmlFor="depositPercentage">Deposit Percentage</Label>
          <Input
            id="depositPercentage"
            name="depositPercentage"
            defaultValue={depositPercentage}
            onChange={onDepositChange}
            {...register("depositPercentage", { 
              required: true,
              valueAsNumber: true,
              min: 0,
              max: 100
            })}
            placeholder="Deposit Percentage"
            type="number"
            min="0"
            max="100"
            className="pl-3"
          />
        </div>
      </div>
    </div>
  );
};

export default Term;
