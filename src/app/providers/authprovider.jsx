"use client";
import { SessionProvider } from "next-auth/react";

export const AuthProvider = ({ children }) => {
  return (
    <SessionProvider session={children.session} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
};
