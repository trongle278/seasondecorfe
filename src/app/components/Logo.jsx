"use client";

import Link from "next/link";
import Image from "next/image";
import { clsx } from "clsx";
import ShinyText from "./ui/ShinyText";
import { usePathname } from "next/navigation";

const Logo = ({ outsideStyle, insideStyle }) => {
  const pathname = usePathname();
  const isSellerRegistration = pathname === "/seller/registration";

  return (
    <div className={clsx("center-wrapper hidden md:flex mr-4", outsideStyle)}>
      <Link
        className={clsx(
          "flex items-center justify-center space-x-2 text-2xl font-bold py-6 text-center text-neutral-600 dark:text-gray-100 selection:bg-emerald-500 mr-10",
          insideStyle
        )}
        href="/"
      >
        {isSellerRegistration && (
          <span className="absolute right-[-10px] top-[5px] ">
            <ShinyText
              text="Provider"
              disabled={false}
              speed={3}
              className="text-sm font-semibold font-tertiary"
            />
          </span>
        )}

        <div className="relative h-8 w-8 md:h-6 md:w-6 bg-black border border-slate-800  text-white   flex items-center justify-center rounded-md text-sm antialiased">
          <div className="absolute h-10 w-full bg-white/[0.2] -top-10 inset-x-0 rounded-full blur-xl"></div>
          <div className="text-sm  text-emerald-500 relative z-20">
            <Image
              src={"/logo/logo-black.png"}
              alt="Logo"
              loading="lazy"
              width={50}
              height={50}
              decoding="async"
              className="block dark:hidden"
              style={{ color: "transparent" }}
            />
            <Image
              src={"/logo/logo-white.png"}
              alt="Logo"
              loading="lazy"
              width={50}
              height={50}
              decoding="async"
              className="hidden dark:block"
              style={{ color: "transparent" }}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-black dark:text-white font-tertiary">
            SeasonDecor
          </h1>
        </div>
      </Link>
    </div>
  );
};

export default Logo;
