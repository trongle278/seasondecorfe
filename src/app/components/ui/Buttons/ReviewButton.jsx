"use client";

import { BiCommentDetail } from "react-icons/bi";
import { FootTypo } from "../Typography";

const ReviewButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-action text-white text-center w-40 rounded-2xl h-10 relative text-sm font-semibold group"
      type="button"
    >
      <div className="bg-primary rounded-xl h-8 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[150px] z-10 duration-500">
        <BiCommentDetail size={20} />
      </div>
      <FootTypo footlabel="Rate" className="translate-x-2" />
    </button>
  );
};

export default ReviewButton;
