"use client";
import * as React from "react";
import { cn } from "@/app/utils/Utils";
import { useMotionTemplate, useMotionValue, motion } from "framer-motion";
import { Controller } from "react-hook-form";

const formatNumber = (value) => {
  if (!value) return "";
  const valueStr = String(value);
  return new Intl.NumberFormat("vi-VN").format(valueStr.replace(/\D/g, ""));
};

const Input = ({
  id,
  className,
  label,
  type,
  defaultValue,
  icon,
  placeholder,
  register = () => {},
  control,
  disabled,
  required,
  errors,
  formatPrice,
  validate,
  ...props
  
}) => {
  const radius = 100; // change this to increase the rdaius of the hover effect
  const [visible, setVisible] = React.useState(false);

  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  return (
    <motion.div
      style={{
        background: useMotionTemplate`
      radial-gradient(
        ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
        var(--blue-500),
        transparent 80%
      )
    `,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="p-[2px] rounded-lg transition duration-300 group/input"
    >
      <div className="relative items-center">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-neutral-400 pointer-events-none">
            {icon}
          </span>
        )}
        {formatPrice ? (
          <Controller
            control={control}
            name={id}
            rules={{ required, validate }}
            render={({ field: { onChange, value } }) => (
              <input
                id={id}
                disabled={disabled}
                value={formatNumber(value)}
                onChange={(e) => {
                  const inputVal = e.target.value || '';
                  onChange(inputVal.replace(/\D/g, ""));
                }}
                placeholder={placeholder}
                className={cn(
                  `flex h-12 peer p-4 pt-6 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-10 py-2 text-sm
                  file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 
                  focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
                  disabled:cursor-not-allowed disabled:opacity-50
                  dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
                  group-hover/input:shadow-none transition duration-400
                  ${errors?.[id] ? "border-rose-500" : "border-neutral-300"}
                  ${
                    errors?.[id]
                      ? "focus:border-rose-500"
                      : "focus:border-neutral-black"
                  }`,
                  className
                )}
              />
            )}
          />
        ) : (
          <input
            id={id}
            defaultValue={defaultValue}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            {...register(id, { required, validate })}
            type={type}
            {...props}
            className={cn(
              `flex h-12 peer p-4 pt-6 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-10 py-2 text-sm
                file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 
                focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
                disabled:cursor-not-allowed disabled:opacity-50
                dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
                group-hover/input:shadow-none transition duration-400
                ${errors?.[id] ? "border-rose-500" : "border-neutral-300"}
                ${
                  errors?.[id]
                    ? "focus:border-rose-500"
                    : "focus:border-neutral-black"
                }`,
              className
            )}
          />
        )}
      </div>
    </motion.div>
  );
};

export default Input;
