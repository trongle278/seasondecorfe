"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useGetAccountDetails } from "../queries/user/user.query";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUserSlug, setUserLocationCode, setUserLocationProvince } from "../lib/redux/reducers/userSlice";
import { useLocationModal } from "../hooks/useLocationModal";
import Image from "next/image";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const accountId = session?.accountId;
  const roleId = session?.roleId;
  const router = useRouter();
  const pathname = usePathname();
  const locationModal = useLocationModal();

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

    const isUserSelf = Number(user.id) === Number(accountId);

    if (isUserSelf) {
      dispatch(setUserSlug(user.slug));
    }

    if (user.location === "") {
      locationModal.onOpen();
    }

    if (user.location && user.provinceCode) {
      dispatch(setUserLocationProvince(user.location));
      dispatch(setUserLocationCode(user.provinceCode));
    }

    if (!user.isProvider && pathname.startsWith("/seller/dashboard")) {
      router.replace("/");
    } else if (user.isProvider && pathname === "/") {
      router.replace("/seller/dashboard");
    }

    if (!roleId === 1 && pathname.startsWith("/admin/dashboard")) {
      router.replace("/authen/login");
    } else if (roleId === 1 && pathname === "/") {
      router.push("/admin/dashboard");
    }
  }, [user, pathname, router]);

  if (status === "loading" || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Image src="/gif/loading.gif" alt="loading" width={150} height={150} priority unoptimized/>
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
