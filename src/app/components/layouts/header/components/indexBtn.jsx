"use client";

import { IoNotificationsSharp } from "react-icons/io5";
import { IconButton } from "@mui/material";
import { MdOutlineShoppingCart } from "react-icons/md";

export const CartBtn = ({cartClick}) => {
  return (
    <div className="relative">
      <IconButton className="dark:hover:bg-zinc-700" onClick={cartClick}>
        <MdOutlineShoppingCart size={20} className="dark:text-white" />
      </IconButton>
    </div>
  );
};

export const NotificationBtn = ({notiClick}) => {
  return (
    <div className="relative">
      <IconButton className="dark:hover:bg-zinc-700" onClick={notiClick}>
        <IoNotificationsSharp size={20} className="dark:text-white" />
      </IconButton>
    </div>
  );
};
