"use client";
import Avatar from "../ui/avatar/Avatar";
import { MdEdit } from "react-icons/md";
import clsx from "clsx";

export const EditAvatar = ({userImg, className, childStyle}) => {
  return (
    <div className={clsx("relative flex", className)}>
      <Avatar
        userImg={userImg}
        h={120}
        w={120}
        className={"cursor-pointer"}
      />
      <div className={clsx("absolute bottom-0 inline-flex items-center gap-1 rounded bg-black bg-opacity-50 p-1 text-sm text-white dark:bg-white dark:text-black", childStyle)}>
        <MdEdit />
        Edit
      </div>
    </div>
  );
};
