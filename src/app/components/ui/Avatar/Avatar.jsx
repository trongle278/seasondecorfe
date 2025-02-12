"use client";

import Image from "next/image";

const Avatar = ({userImg}) => {
  return (
    <Image
      className="rounded-full"
      height="30"
      width="30"
      alt="avatar"
      src={userImg}
    />
  );
};

export default Avatar;