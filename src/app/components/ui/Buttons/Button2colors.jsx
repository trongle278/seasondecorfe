"use client";

import Link from "next/link";

export const BlackBgButton = ({ blackBtnlable }) => {
  return (
    <Link
      href="#"
      className="bg-slate-900 dark:bg-white dark:text-black no-underline flex space-x-2 group cursor-pointer relative hover:shadow-2xl transition duration-200 shadow-zinc-900 p-px font-semibold text-white px-4 py-2 w-full sm:w-52 h-14 rounded-2xl text-sm text-center items-center justify-center"
    >
      {blackBtnlable}
    </Link>
  );
};

export const WhiteBgButon = ({ whiteBtnlable }) => {
  return (
    <Link
      href="#"
      className="w-full sm:w-52 text-sm text-black bg-white dark:bg-black h-14 border border-transparent  dark:text-white dark:border-neutral-600 flex justify-center items-center rounded-2xl hover:shadow-lg transition duration-200 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
    >
      {whiteBtnlable}
    </Link>
  );
};
