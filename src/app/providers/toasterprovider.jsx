"use client";

import { Toaster } from "sonner";

// ...

export const Toasterprovider = ({ children }) => {
  return (
    <>
      <Toaster richColors position="top-right">{children}</Toaster>
    </>
  );
};
