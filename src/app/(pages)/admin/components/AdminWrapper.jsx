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
  IconChartBarPopular,
  IconMessages,
  IconSettings
} from "@tabler/icons-react";
import { cn } from "@/app/utils/Utils";

export default function AdminWrapper({ children }) {
  const links = [
    {
      label: "Overeview System",
      href: "/admin/dashboard",
      icon: <IconBrandTabler className=" h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "User Management",
      href: "/admin/manage/account",
      icon: <IconReceipt className=" h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Transaction Management",
      href: "/admin/manage/transaction",
      icon: <IconChartBarPopular className=" h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Settings",
      href: "#",
      icon: <IconSettings className=" h-5 w-5 flex-shrink-0" />,
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
