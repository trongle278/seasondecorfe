"use client";

import Image from "next/image";
import clsx from "clsx";

const Avatar = ({ userImg, className, h = 120, w = 120}) => {
  const defaultAvatar = "/img/user-ava.jpg";

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-full",
        `w-[${w}px] h-[${h}px]`, 
        className
      )}
      style={{ width: `${w}px`, height: `${h}px` }}
    >
      <Image
        className="object-cover w-full h-full"
        height={h}
        width={w}
        alt="User Avatar"
        src={userImg || defaultAvatar}
        priority 
      />
    </div>
  );
};

export default Avatar;
