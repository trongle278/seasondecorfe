"use client";
import Link from "next/link";
import { TiThList } from "react-icons/ti";

const DropdownSection = ({ items }) => {
  return (
    <div className="absolute right-0 top-10 hidden w-auto flex-col gap-1 rounded-lg bg-white py-3 shadow-md transition-all group-hover:flex text-black">
      <Link
        href={"#"}
        className="flex cursor-pointer items-center py-1 pl-6 pr-8"
      >
        {/*icon*/}
        <TiThList />
        <span className="whitespace-nowrap pl-3">{items}</span>
      </Link>
    </div>
  );
};

export default DropdownSection;
