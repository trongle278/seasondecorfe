"use client";

import * as React from "react";

import { TfiMoreAlt } from "react-icons/tfi";
import ThemeSwitch from "../../../ThemeSwitch";
import Logo from "../../../Logo";
import RightWrapper from "../RightWrapper";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { UserMenu } from "../UserMenu";
import { CartBtn, NotificationBtn } from "../components/indexBtn";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/app/providers/userprovider";
import { useChangeStatus } from "@/app/queries/user/provider.query";
import { ColourfulText } from "@/app/components/ui/animated/ColorfulText";
import { scroller } from "react-scroll";
import { SearchBtn } from "../components/indexBtn";
import AnchorDrawer from "@/app/components/ui/drawer/Drawer";

export default function Header({ providerRef }) {
  const { user } = useUser();
  const { data: session } = useSession();
  const mutationChangeStatus = useChangeStatus();
  const pathname = usePathname();

  console.log(session);
  //console.log("isProvider:", session?.isProvider);

  //console.log(user);

  const router = useRouter();

  const onChangeStatus = React.useCallback(() => {
    mutationChangeStatus.mutate(true, {
      onSuccess: () => {
        router.push("/seller/dashboard");
      },
      onError: (error) => {
        if (pathname === "/authen/login") {
          return;
        }
        if (error) {
          router.push("/authen/login");
        }

        if (session && !user?.isProvider) {
          if (pathname !== "/") {
            router.push("/");
            setTimeout(() => {
              scroller.scrollTo("providerSection", {
                duration: 800,
                delay: 0,
                smooth: "easeInOutQuart",
                offset: -50,
              });
            }, 1000);
          } else {
            scroller.scrollTo("providerSection", {
              duration: 800,
              delay: 0,
              smooth: "easeInOutQuart",
              offset: -50,
            });
          }
        }
      },
    });
  }, [mutationChangeStatus, router, pathname, session, user]);

  const [isDrawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <header
      className="z-[50] sticky top-0 w-full border-b bg-white dark:bg-black  border-neutral-200 dark:border-white/[0.1]"
      tabIndex="-1"
    >
      <div className="hidden lg:block">
        <div className="header-container px-8 flex items-center max-w-[88rem] mx-auto">
          <div className="logo-wrapper flex justify-center ">
            <Logo />
          </div>
          <section className="left-wrapper desktop-only flex items-center space-x-6 text-sm font-medium xl:flex">
            <div className="flex items-center gap-4 transition-all ">
              <div>
                <ColourfulText
                  colors={[
                    "#40ffaa",
                    "#4079ff",
                    "#40ffaa",
                    "#4079ff",
                    "#40ffaa",
                  ]}
                  animationSpeed={3}
                  showBorder={true}
                  className="p-2 text-sm"
                  onClick={onChangeStatus}
                >
                  Provider centre
                </ColourfulText>
              </div>

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
            <SearchBtn />
            <CartBtn cartClick={() => router.push("/cart")} />
            <NotificationBtn toggleDrawer={toggleDrawer} />
            <AnchorDrawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
            {user && (
              <>
                <UserMenu />
              </>
            )}
            {!user && <RightWrapper />}
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
