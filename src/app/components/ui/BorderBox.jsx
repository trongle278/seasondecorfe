"use client";

import clsx from "clsx";

export const BorderBox = ({ children, className }) => {
  return (
    <div
      className={clsx(
        "relative space-y-4 w-full rounded-2xl bg-white p-4 shadow-input dark:bg-neutral-800 dark:shadow-[0px_-1px_0px_0px_var(--neutral-700)] sm:p-6",
        className
      )}
    >
      <div className="absolute inset-y-0 left-0 h-fit w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-0 h-32 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-fit w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute h-32 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-fit bg-neutral-200/80 dark:bg-neutral-800/80 ">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>
      {children}
    </div>
  );
};
