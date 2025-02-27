"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useGetAccountDetails } from "../queries/user/user.query";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const { data: session } = useSession();
  const accountId = session?.accountId;

  const { data: user, isLoading, isError } = useGetAccountDetails(accountId);

  useEffect(() => {
    if (session?.error) {
      toast.error(session.error, {
        id: "session-error", 
      });
    }
  }, [session?.error]);
  

  if (isLoading) {
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
