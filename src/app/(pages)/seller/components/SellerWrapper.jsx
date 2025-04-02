"use client";
import React, { useState } from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/app/components/ui/sidebar/Sidebar";
import {
  IconReceipt,
  IconBrandTabler,
  IconBuildingStore,
  IconChartBarPopular,
  IconMessages,
  IconDatabase,
  IconWorldDollar,
  IconPackage,
} from "@tabler/icons-react";
import { cn } from "@/app/utils/Utils";
import ScrollToTop from "@/app/components/ScrollToTop";
import { RiFolderSettingsLine } from "react-icons/ri";

export default function SellerWrapper({ children }) {
  const links = [
    {
      label: "Overeview",
      href: "/seller/dashboard",
      icon: <IconBrandTabler className=" h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Request Management",
      href: "/seller/request",
      icon: <IconReceipt className=" h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Quotation Management",
      href: "/seller/quotation",
      icon: <IconChartBarPopular className=" h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Chat Management",
      href: "#",
      icon: <IconMessages className=" h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Product Management",
      href: "/seller/product",
      icon: <IconPackage className=" h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Service Management",
      href: "/seller/service",
      icon: <RiFolderSettingsLine className=" h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Data Management",
      href: "#",
      icon: <IconDatabase className=" h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Finance Management",
      href: "#",
      icon: <IconWorldDollar className=" h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Shop Management",
      href: "/seller/shop/",
      icon: <IconBuildingStore className=" h-5 w-5 flex-shrink-0" />,
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "mx-auto flex min-h-screen w-full flex-col rounded-md md:flex-row"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mt-8 flex flex-col gap-4">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <ScrollToTop />
      <Dashboard props={children} />
    </div>
  );
}

// Dummy dashboard component with content
const Dashboard = ({ props }) => {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-col gap-2 rounded-tl-2xl border border-neutral-200 p-2 md:p-10">
        <div className="flex flex-grow flex-col items-start justify-start">
          {props}
        </div>
      </div>
    </div>
  );
};
