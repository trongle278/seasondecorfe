"use client";

import Link from "next/link";
import { FaRegUser } from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";
import { IoNotificationsSharp } from "react-icons/io5";
import { GoPackage } from "react-icons/go";
import { FaLocationDot } from "react-icons/fa6";
import { PiShoppingBag } from "react-icons/pi";

const Sidebar = ({ selectedPath, userId, userRole }) => {
  return (
    <div className="w-full md:w-1/4 mb-6 md:mb-0 dark:text-white">
      <ul className="space-y-4">
        <li>
          <Link
            //href={`/accounts/settings/account/${userId}`}
            href={`/user/account/profile`}
            className={`${
              selectedPath === `/user/account/profile`
                ? "text-red font-semibold inline-flex gap-2 items-center"
                : "inline-flex gap-2 items-start"
            }`}
          >
            <FaRegUser size={20} /> Account
          </Link>
        </li>
        <li>
          <Link
            //href={`/accounts/settings/account/${userId}`}
            href={`/user/account/address`}
            className={`${
              selectedPath === `/user/account/address`
                ? "text-red font-semibold inline-flex gap-2 items-center"
                : "inline-flex gap-2 items-start"
            }`}
          >
            <FaLocationDot size={20} /> Address
          </Link>
        </li>

        <li>
          <Link
            href={`/user/account/wallet`}
            className={`${
              selectedPath === `/user/account/wallet`
                ? "text-red font-semibold inline-flex gap-2 items-center "
                : "inline-flex gap-2 items-center"
            }`}
          >
            <IoWalletOutline size={20} /> Wallet
          </Link>
        </li>
        <li>
          <Link
            href={`/user/notifications`}
            className={`${
              selectedPath === `/user/notifications`
                ? "text-red font-semibold inline-flex gap-2 items-center"
                : "inline-flex gap-2 items-center"
            }`}
          >
            <IoNotificationsSharp size={20} />
            Notifications
          </Link>
        </li>
        <li>
          <Link
            href={`/user/orders`}
            className={`${
              selectedPath === `/user/orders`
                ? "text-red font-semibold inline-flex gap-2 items-center"
                : "inline-flex gap-2 items-center"
            }`}
          >
            <PiShoppingBag  size={20} /> Orders
          </Link>
        </li>
        <li>
          <Link
            href={`/user/membership`}
            className={`${
              selectedPath === `/user/membership`
                ? "text-red font-semibold inline-flex gap-2 items-center"
                : "inline-flex gap-2 items-center"
            }`}
          >
            <GoPackage size={20} /> Membership
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
