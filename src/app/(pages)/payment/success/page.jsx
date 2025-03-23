"use client";

import * as React from "react";
import Link from "next/link";
import { FcOk } from "react-icons/fc";
import { FootTypo } from "@/app/components/ui/Typography";
import { ButtonInvert2 } from "@/app/components/ui/Buttons/ButtonInvert";
import { FaAngleLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";

const PaymentSuccessPage = () => {
  const router = useRouter();
  const [isPaymentSuccess, setIsPaymentSuccess] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  function convert(text) {
    return encodeURIComponent(text.trim());
  }

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
            label="Back to home"
            icon={<FaAngleLeft size={20} />}
            onClick={() => router.push("/")}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
