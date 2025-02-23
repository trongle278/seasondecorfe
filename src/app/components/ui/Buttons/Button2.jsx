"use client";
import clsx from "clsx";
import { ClipLoader } from "react-spinners";

const Button2 = ({
  label,
  icon,
  onClick,
  type,
  btnClass,
  labelClass,
  disabled,
  loading = false,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
      className={clsx(
        "relative group cursor-pointer rounded-full p-px text-[10px] sm:text-xs font-semibold leading-6 w-fit mb-4",
        "bg-neutral-50 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 md:shadow-2xl shadow-zinc-900",
        "transition-all duration-300 ease-in-out",
        { "opacity-50 cursor-not-allowed": disabled || loading }, 
        btnClass
      )}
    >
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </span>
      <div
        className={clsx(
          "relative flex space-x-2 items-center z-10 rounded-full ring-1 px-4 py-2",
          "bg-neutral-100 dark:bg-neutral-800 ring-white/10",
          labelClass
        )}
      >
        {loading ? (
          <span className="flex items-center space-x-2">
            <ClipLoader size={20}/>
          </span>
        ) : (
          <>
            <span>{label}</span>
            {icon && <span>{icon}</span>}
          </>
        )}
      </div>
      <span
        className={clsx(
          "absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)]",
          "bg-gradient-to-r from-neutral-400/0 via-neutral-400/90 to-neutral-400/0",
          "transition-opacity duration-500 group-hover:opacity-40"
        )}
      />
    </button>
  );
};

export default Button2;
