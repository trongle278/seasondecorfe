"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useGetAccountDetails } from "../queries/user/user.query";
import { useRouter, usePathname } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const { data: session, status } = useSession();
  const accountId = session?.accountId;
  const router = useRouter();
  const pathname = usePathname();

  const { data: user, isLoading, isError } = useGetAccountDetails(accountId);

  useEffect(() => {
    if (session?.error) {
      toast.error(session.error, {
        id: "session-error",
      });
    }
  }, [session?.error]);

  useEffect(() => {
    if (isError) {
      toast.error("Session expired or server is unavailable. Logging out...", {
        id: "session-expired",
      });
      
      // Sign out and redirect
      signOut({ redirect: false }).then(() => {
        router.push("/authen/login");
      });
    }
  }, [isError, router]);

  useEffect(() => {
    if (!user) return;
  
    if (!user.isProvider && pathname.startsWith("/seller/dashboard")) {
      router.push("/");
    } else if (user.isProvider && pathname === "/") {
      router.push("/seller/dashboard");
    }
  }, [user, pathname, router]);

  if (status === "loading" || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <ClipLoader size={30} />
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, isError }}>
      {children}
    </UserContext.Provider>
  );
}

//Custom Hook to Access User Data
export function useUser() {
  return useContext(UserContext);
}
