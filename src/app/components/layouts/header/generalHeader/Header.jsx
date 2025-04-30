"use client";

import * as React from "react";

import { TfiMoreAlt } from "react-icons/tfi";
import ThemeSwitch from "../../../ThemeSwitch";
import Logo from "../../../Logo";
import RightWrapper from "../RightWrapper";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { UserMenu } from "../UserMenu";
import { CartBtn, NotificationBtn } from "../components/indexBtn";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/app/providers/userprovider";
import { useChangeStatus } from "@/app/queries/user/provider.query";
import { ColourfulText } from "@/app/components/ui/animated/ColorfulText";
import { scroller } from "react-scroll";
import Notifcation from "@/app/components/ui/notification/Notifcation";
import { notificationService } from "@/app/services/notificationService";
import { toast } from "sonner";
import { createMarkup } from "@/app/helpers";

export default function Header() {
  const { user } = useUser();
  const { data: session } = useSession();
  const mutationChangeStatus = useChangeStatus();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);
  const router = useRouter();

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

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


  // Initialize notification service connection
  React.useEffect(() => {
    if (user?.id) {
      const connectNotificationService = async () => {
        try {
          if (!notificationService.isConnected()) {
            await notificationService.startConnection(user.id);
          }
        } catch (error) {
          // Add a retry mechanism with increasing delay
          setTimeout(() => {
            if (user?.id && !notificationService.isConnected()) {
              connectNotificationService();
            }
          }, 3000); // Wait 3 seconds before retrying
        }
      };

      // Initialize connection with a small delay to ensure all dependencies are properly loaded
      const initTimeout = setTimeout(() => {
        connectNotificationService();
      }, 500);

      return () => {
        clearTimeout(initTimeout);
      };
    }
  }, [user?.id]);

  // Set up notification event listener
  React.useEffect(() => {
    if (!user?.id) return;

    // Listen for new notifications and show toast
    const handleNewNotification = (notification) => {
      // Show toast notification only if the drawer is not open
      if (!isDrawerOpen) {
        toast.info(
          <div className="flex items-start cursor-pointer">
            <div>
              <div className="font-semibold">{notification.title}</div>
              <div 
                className="text-sm text-gray-600"
                dangerouslySetInnerHTML={createMarkup(
                  notification.message || notification.content || ""
                )}
              />
            </div>
          </div>,
          {
            duration: 5000,
            onDismiss: () => {},
            onAutoClose: () => {},
            onClick: () => {
              // Handle click on toast notification
              if (notification.url) {
                router.push(notification.url);
              } else {
                toggleDrawer(true)();
              }
            },
          }
        );
      }
    };
    
    // Register listener
    notificationService.onNotificationReceived(handleNewNotification);

    // Cleanup listener
    return () => {
      notificationService.offNotificationReceived(handleNewNotification);
    };
  }, [user?.id, isDrawerOpen, router, toggleDrawer]);

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

  return (
    <header
      className={`z-[50] fixed top-0 w-full transition-all ${
        isScrolled ? "bg-white dark:bg-black shadow-md dark:shadow-white" : ""
      }`}
      tabIndex="-1"
    >
      <div className="hidden lg:block">
        <div className="header container mx-auto max-w-[88rem]">
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
                  className="p-2 text-sm font-semibold"
                  onClick={onChangeStatus}
                >
                  PROVIDER CENTRE
                </ColourfulText>
              </div>
              <Link
                href="/provider"
                className="text-sm font-semibold text-white/70 hover:text-primary "
              >
                PROVIDERS
              </Link>

              <Link
                href="/products"
                className="text-sm font-semibold text-white/70 hover:text-primary"
              >
                SHOP
              </Link>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <ThemeSwitch />
              <span>/</span>
              <CartBtn cartClick={() => router.push("/cart")} />
              <NotificationBtn
                toggleDrawer={toggleDrawer}
                isDrawerOpen={isDrawerOpen}
              />
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

      {/* Notification Drawer */}
      <Notifcation isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
    </header>
  );
}
