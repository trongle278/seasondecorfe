"use client";

import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import Typography from "@mui/material/Typography";

const MuiBreadcrumbs = () => {
  const pathname = usePathname() || ""; // ✅ Get current path
  const pathSegments = pathname.split("/").filter((segment) => segment);

  return (
    <Breadcrumbs aria-label="breadcrumb" className="text-black dark:text-white" separator="›">
      <Link
        href="/"
        className="hover:underline flex items-center"
      >
        <HomeIcon fontSize="small" className="mr-1" /> Home
      </Link>

      {pathSegments.map((segment, index) => {
        const href = "/" + pathSegments.slice(0, index + 1).join("/");

        const isLast = index === pathSegments.length - 1;

        return isLast ? (
          <Typography key={href} color="red" className="font-semibold">
            {decodeURIComponent(segment)}
          </Typography>
        ) : (
          <Link key={href} href={href} className="hover:underline">
            {decodeURIComponent(segment)}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default MuiBreadcrumbs;
