"use client";

import clsx from "clsx";

export const BorderBox = ({ children, className }) => {
  return (
    <div
      className={clsx(
        "space-y-4 w-full rounded-2xl bg-white p-4 shadow-input dark:bg-neutral-800 dark:shadow-[0px_-1px_0px_0px_var(--neutral-700)] sm:p-6",
        className
      )}
    >
      {children}
    </div>
  );
};
