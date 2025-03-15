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
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Add scroll event listener
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial scroll position

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
      className={`z-[50] fixed top-0 w-full transition-all ${
        isScrolled ? "border-b border-white/[0.1] bg-white dark:bg-black" : ""
      }`}
      tabIndex="-1"
    >
      <div className="hidden lg:block">
        <div className="header container mx-auto px-4 py-3">
          <nav className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center">
              <Logo />
            </div>

            {/* Center Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center gap-4 transition-all ">
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
                  PROVIDER CENTRE
                </ColourfulText>
              </div>
              <Link
                href="/pricing"
                className="text-sm font-medium text-white/70 hover:text-primary"
              >
                PRICING
              </Link>
              <Link
                href="/provider"
                className="text-sm font-medium text-white/70 hover:text-primary "
              >
                PROVIDERS
              </Link>
              <Link
                href="/enterprise"
                className="text-sm font-medium text-white/70 hover:text-primary "
              >
                ENTERPRISE
              </Link>
              <Link
                href="/blog"
                className="text-sm font-medium text-white/70 hover:text-primary "
              >
                BLOG
              </Link>
              <Link
                href="/forum"
                className="text-sm font-medium text-white/70 hover:text-primary "
              >
                FORUM
              </Link>
              <Link
                href="/careers"
                className="text-sm font-medium text-white/70 hover:text-primary"
              >
                CAREERS
              </Link>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
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
          </nav>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="block lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Logo />
          <button className="text-white">
            <TfiMoreAlt size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
