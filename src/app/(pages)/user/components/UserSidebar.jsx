"use client";

import Link from "next/link";
import { FaRegUser } from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import { GoPackage } from "react-icons/go";
import { PiShoppingBag } from "react-icons/pi";
import { GiShadowFollower } from "react-icons/gi";
import { RiUserFollowLine } from "react-icons/ri";
import { GoLocation } from "react-icons/go";
import { FaShieldAlt } from "react-icons/fa";

const Sidebar = ({ selectedPath}) => {
  // Helper function to check if current path starts with the given path
  const isPathActive = (path) => {
    return selectedPath === path || selectedPath.startsWith(`${path}/`);
  };

  return (
    <div className="w-full md:w-1/4 mb-6 md:mb-0 dark:text-white">
      <ul className="space-y-6">
        <li>
          <Link
            //href={`/accounts/settings/account/${userId}`}
            href={`/user/account/profile`}
            className={`${
              isPathActive(`/user/account/profile`)
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
              isPathActive(`/user/account/address`)
                ? "text-red font-semibold inline-flex gap-2 items-center"
                : "inline-flex gap-2 items-start"
            }`}
          >
            <GoLocation size={20} /> Address
          </Link>
        </li>

        <li>
          <Link
            href={`/user/account/wallet`}
            className={`${
              isPathActive(`/user/account/wallet`)
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
              isPathActive(`/user/notifications`)
                ? "text-red font-semibold inline-flex gap-2 items-center"
                : "inline-flex gap-2 items-center"
            }`}
          >
            <IoNotificationsOutline size={20} />
            Notifications
          </Link>
        </li>
        <li>
          <Link
            href={`/user/orders`}
            className={`${
              isPathActive(`/user/orders`)
                ? "text-red font-semibold inline-flex gap-2 items-center"
                : "inline-flex gap-2 items-center"
            }`}
          >
            <PiShoppingBag size={20} /> Orders
          </Link>
        </li>
        <li>
          <Link
            href={`/user/membership`}
            className={`${
              isPathActive(`/user/membership`)
                ? "text-red font-semibold inline-flex gap-2 items-center"
                : "inline-flex gap-2 items-center"
            }`}
          >
            <GoPackage size={20} /> Membership
          </Link>
        </li>
        <li>
          <Link
            href={`/user/followers`}
            className={`${
              isPathActive(`/user/followers`)
                ? "text-red font-semibold inline-flex gap-2 items-center"
                : "inline-flex gap-2 items-center"
            }`}
          >
            <GiShadowFollower size={20} />
            Followers
          </Link>
        </li>
        <li>
          <Link
            href={`/user/following`}
            className={`${
              isPathActive(`/user/following`)
                ? "text-red font-semibold inline-flex gap-2 items-center"
                : "inline-flex gap-2 items-center"
            }`}
          >
            <RiUserFollowLine size={20} /> Following
          </Link>
        </li>
        <li>
          <Link
            href={`/user/account/reputation`}
            className={`${
              isPathActive(`/user/account/reputation`)
                ? "text-red font-semibold inline-flex gap-2 items-center"
                : "inline-flex gap-2 items-center"
            }`}
          >
            <FaShieldAlt size={20} /> Reputation
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
