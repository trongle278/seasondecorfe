"use client";

import { UserWrapper } from "../components/UserWrapper";
import { useState, useEffect } from "react";
import { Tab, TabGroup, TabList } from "@headlessui/react";
import { useRouter, usePathname } from "next/navigation";

const tabs = [
  { name: "All", path: "/user/orders" },
  { name: "Pending", path: "/user/orders/pending" },
  { name: "Completed", path: "/user/orders/completed" },
  { name: "Cancelled", path: "/user/orders/canceled" },
];

export default function OrdersLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Determine selected tab based on URL path
  useEffect(() => {
    const tabIndex = tabs.findIndex((tab) => {
      // Check if current path matches tab path, or if we're on the main page and it's the "All" tab
      return (
        pathname === tab.path ||
        (pathname === "/user/orders" && tab.name === "All")
      );
    });

    if (tabIndex !== -1) {
      setSelectedIndex(tabIndex);
    }
  }, [pathname]);

  // Handle tab change
  const handleTabChange = (index) => {
    setSelectedIndex(index);
    router.push(tabs[index].path);
  };

  return (
    <UserWrapper>
      <div className="flex w-full h-[80vh] flex-col overflow-hidden">
        <TabGroup
          className="flex flex-col w-full h-full"
          selectedIndex={selectedIndex}
          onChange={handleTabChange}
        >
          <TabList className="flex gap-base border-b-[1px] pb-6 justify-center sticky top-0 z-10">
            {tabs.map(({ name }, index) => (
              <Tab
                key={name}
                className={({ selected }) => `
                  rounded-full py-1 px-3 font-semibold text-lg focus:outline-none 
                  ${selected ? "border-b-[2px] border-red" : ""}
                  hover:bg-white/5 
                  focus:outline-1 focus:outline-white
                `}
              >
                {name}
              </Tab>
            ))}
          </TabList>
          <div className="flex-1 overflow-auto mt-3">
            {children}
          </div>
        </TabGroup>
      </div>
    </UserWrapper>
  );
} 