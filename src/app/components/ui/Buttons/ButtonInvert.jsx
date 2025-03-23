"use client";
import clsx from "clsx";
import { ClipLoader } from "react-spinners";

const ButtonInvert = ({ label, icon, className, onClick, loading = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={clsx(
        "inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50",
        {
          "opacity-50 cursor-not-allowed": loading,
        },
        className
      )}
    >
      {loading ? (
        <>
          <span className="mr-3">{label}</span>{" "}
          <ClipLoader size={20} color="#fff" />
        </>
      ) : (
        <span className="mr-3">{label}</span>
      )}
      {!loading && icon}
    </button>
  );
};

export default ButtonInvert;

export const ButtonInvert2 = ({ label, icon, className, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-slate-900 no-underline w-full sm:w-fit group mb-4 cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-base font-semibold leading-6  text-white block mt-6"
    >
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
      </span>
      <div className="relative inline-flex space-x-2 items-center justify-center z-10 rounded-full bg-zinc-950 py-4 px-8 ring-1 ring-white/10 ">
        {icon}
        <span>{label}</span>
      </div>
      <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
    </button>
  );
};
