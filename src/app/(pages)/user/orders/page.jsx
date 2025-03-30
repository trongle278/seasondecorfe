"use client";

import { useEffect } from "react";
import AllTabs from "./all/page";
import PendingTab from "./pending/page";

export default function UserOrder() {
  return (
    <div className="rounded-xl bg-transparent p-3">
      <AllTabs />
    </div>
  );
}
