"use client";

import { usePathname } from "next/navigation";
import Header from "./generalHeader/Header";
import SellerHeader from "./sellerHeader/SellerHeader";
import MinimalHeader from "./minimalHeader/MinimalHeader";

const HeaderWrapper = () => {
  const pathname = usePathname();


  if(pathname === ("/seller/registration")){
    return null;
  }

  if (pathname.startsWith("/admin/")) {
    return <SellerHeader />;
  }

  if (pathname.startsWith("/seller/")) {
    return <SellerHeader />;
  }

  if (pathname === "/authen/login" || pathname === "/authen/signup") {
    return <MinimalHeader />;
  }

  if (pathname === "/payment/success" || pathname === "/payment/failure") {
    return null;
  }

  if (pathname === "/user/account/topup") {
    return null;
  }

  return <Header />;
};

export default HeaderWrapper;
