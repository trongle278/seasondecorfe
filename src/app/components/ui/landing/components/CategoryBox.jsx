"use client";
import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import qs from "query-string";

const CategoryBox = ({ icon, label, selected }) => {
  const router = useRouter();
  const params = useSearchParams();

  const handleClick = React.useCallback(() => {
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery = {
      ...currentQuery,
      category: label,
    };

    if (params?.get("category") === label) {
      delete updatedQuery.category;
    }

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    router.replace(url, { scroll: false });
  }, [label, params, router]);

  return (
    <div
      onClick={handleClick}
      className={`flex flex-col items-center justify-center gap-2 p-3 border-b-2 hover:text-neutral-800 dark:hover:text-neutral-300 transition cursor-pointer
    ${
      selected
        ? "border-b-neutral-800 dark:border-b-white"
        : "border-transparent"
    } 
    ${
      selected
        ? "text-neutral-800 dark:text-white"
        : "text-neutral-500 dark:text-neutral-400"
    }
  `}
    >
      {icon}
      <div className="font-medium text-sm">{label}</div>
    </div>
  );
};

export default CategoryBox;
