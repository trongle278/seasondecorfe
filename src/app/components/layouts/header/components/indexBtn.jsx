"use client";

import { IoNotificationsSharp } from "react-icons/io5";
import { IconButton, Badge } from "@mui/material";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useGetListCart } from "@/app/queries/list/cart.query";
import { useUser } from "@/app/providers/userprovider";
import { ClipLoader } from "react-spinners";

export const CartBtn = ({ cartClick }) => {
  const { user } = useUser();
  const { data: cartData, isLoading } = useGetListCart(user?.id, {
    enabled: !!user?.id,
  });

  const cartItemCount = cartData?.totalItem || 0;

  if (!user) {
    return (
      <div className="relative">
        <IconButton className="dark:hover:bg-zinc-700" onClick={cartClick}>
          <MdOutlineShoppingCart size={20} className="dark:text-white" />
        </IconButton>
      </div>
    );
  }

  return (
    <div className="relative">
      <IconButton className="dark:hover:bg-zinc-700" onClick={cartClick}>
        <Badge
          badgeContent={isLoading ? <ClipLoader size={10} /> : cartItemCount}
          color="error"
          overlap="circular"
        >
          <MdOutlineShoppingCart size={20} className="dark:text-white" />
        </Badge>
      </IconButton>
    </div>
  );
};

export const NotificationBtn = ({ notiClick }) => {
  return (
    <div className="relative">
      <IconButton className="dark:hover:bg-zinc-700" onClick={notiClick}>
        <IoNotificationsSharp size={20} className="dark:text-white" />
      </IconButton>
    </div>
  );
};
