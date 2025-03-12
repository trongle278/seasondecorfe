"use client";

import Button from "../../ui/Buttons/Button";
import { MdOutlineLogin } from "react-icons/md";
import Link from "next/link";

const RightWrapper = () => {
  return (
    <Link href="/authen/login">
      <Button label="Login" icon={<MdOutlineLogin />} link="/Authen/login" className="bg-white dark:text-black" />
    </Link>
  );
};

export default RightWrapper;
