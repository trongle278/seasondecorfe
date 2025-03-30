"use client";

import * as React from "react";
import { MdError } from "react-icons/md";
import { FootTypo } from "@/app/components/ui/Typography";
import { ButtonInvert2 } from "@/app/components/ui/Buttons/ButtonInvert";
import { FaAngleLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";

const PaymentFailurePage = () => {
  const router = useRouter();


  return (
    <div className="flex min-h-screen items-center justify-center">
      <div>
        <div className="flex flex-col items-center space-y-10">
          <MdError size={80} color="red" />
          <FootTypo
            footlabel="Top up failed ! Please try again later."
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

export default PaymentFailurePage;
