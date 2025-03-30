"use client";

import * as React from "react";
import { FcOk } from "react-icons/fc";
import { FootTypo } from "@/app/components/ui/Typography";
import { ButtonInvert2 } from "@/app/components/ui/Buttons/ButtonInvert";
import { FaAngleLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";

const PaymentSuccessPage = () => {
  const router = useRouter();


  return (
    <div className="flex min-h-screen items-center justify-center">
      <div>
        <div className="flex flex-col items-center space-y-10">
          <FcOk size={80} />
          <FootTypo
            footlabel="Your payment has been successfully processed!"
            className="text-3xl font-semibold"
          />
          <ButtonInvert2
            label="Go Back"
            icon={<FaAngleLeft size={20} />}
            onClick={() => router.push("/user/account/wallet")}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
