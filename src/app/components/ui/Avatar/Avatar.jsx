"use client";

import Image from "next/image";
import clsx from "clsx";

const Avatar = ({ userImg, className, h ,w  }) => {
  const defaultAvatar = "/img/user-ava.jpg";

  return (
      <Image
        className={clsx("rounded-full", className)}
        height={h}
        width={w}
        alt="avatar"
        src={userImg || defaultAvatar}
      />
  );
};

export default Avatar;
