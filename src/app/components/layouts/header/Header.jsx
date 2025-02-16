"use client";

import { IoSearchSharp } from "react-icons/io5";
import { IconButton } from "@mui/material";
import { TfiMoreAlt } from "react-icons/tfi";
import ThemeSwitch from "../../ThemeSwitch";
import Logo from "../../Logo";
import RightWrapper from "./RightWrapper";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProviderHeader from "./components/ProviderHeader";
import { useSession } from "next-auth/react";
import { UserMenu } from "./UserMenu";
import { CartBtn, NotificationBtn } from "./components/indexBtn";
import { useRouter } from "next/navigation";

export default function Header() {
  const { data } = useSession();
  console.log(data);
  const router = useRouter();
  const pathname = usePathname();
  const isSellerRegistration = pathname === "/seller/registration";
  const isLoginPage = pathname === "/authen/login";
  const isRegisterPage = pathname === "/authen/signup";

  if (isSellerRegistration) {
    return null;
  }

  if (isLoginPage || isRegisterPage) {
    return (
      <div className="relative overflow-visible">
        <div className="absolute right-0">
          <ThemeSwitch />
        </div>
      </div>
    );
  }
  return (
    <header
      className="z-[50] sticky top-0 w-full border-b bg-white dark:bg-black border-neutral-200 dark:border-white/[0.1]"
      tabIndex="-1"
    >
      <div className="hidden lg:block">
        <div className="header-container px-8 flex items-center max-w-[88rem] mx-auto">
          <div className="logo-wrapper flex justify-center ">
            <Logo />
          </div>
          <section className="left-wrapper desktop-only flex items-center space-x-6 text-sm font-medium xl:flex">
            <div className="flex items-center gap-4 transition-all">
              <div className="relative">
                <p className="flex cursor-pointer items-center gap-2 hover:text-red">
                  <Link href="/provider">Providers</Link>
                </p>
              </div>
              <div className="relative">
                <p className="flex cursor-pointer items-center gap-2 hover:text-red">
                  <Link href="/features">Features</Link>
                </p>
              </div>
              <div className="relative">
                <p className="flex cursor-pointer items-center gap-2 hover:text-red">
                  <Link href="/pricing">Pricing</Link>
                </p>
              </div>
              <div className="relative">
                <p className="flex cursor-pointer items-center gap-2 hover:text-red">
                  <Link href="/blog">Blog</Link>
                </p>
              </div>
            </div>
          </section>

          <div className="right-wrapper flex flex-1 items-center justify-end gap-5 sm:gap-3 md:justify-end">
            <ThemeSwitch />/
            <IconButton className="dark:hover:bg-zinc-700">
              <IoSearchSharp size={20} className="dark:text-white" />
            </IconButton>
            <CartBtn cartClick={()=> router.push('/cart')}/>
            <NotificationBtn />
            {data?.user && (
              <>
                <UserMenu />
              </>
            )}
            {!data?.user && <RightWrapper />}
          </div>
        </div>
      </div>
      <div className="block lg:hidden">
        <div className="flex justify-between  items-center w-full rounded-md px-4 py-4">
          <div className="flex items-center gap-1.5">
            <Image
              src={"/logo/logo-black.png"}
              alt="Logo"
              loading="lazy"
              width={24}
              height={24}
              decoding="async"
              className="block dark:hidden"
              style={{ color: "transparent" }}
            />
            <Image
              src={"/logo/logo-white.png"}
              alt="Logo"
              loading="lazy"
              width={24}
              height={24}
              decoding="async"
              className="hidden dark:block"
              style={{ color: "transparent" }}
            />
          </div>
          <div className="flex items-center gap-4">
            <TfiMoreAlt />
          </div>
        </div>
      </div>
    </header>
  );
}
