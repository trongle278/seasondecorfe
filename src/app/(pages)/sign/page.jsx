"use client";

import React, { useEffect } from "react";
import Orb from "@/app/components/ui/animated/Orb";
import { useVerifySignature } from "@/app/queries/contract/contract.query";
import { BsClipboard2Check } from "react-icons/bs";
import { AiOutlineLoading } from "react-icons/ai";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { PiSealWarning } from "react-icons/pi";

const SignPage = () => {
  const {
    mutate: verifySignature,
    isPending,
    isSuccess,
    isError,
    error,
  } = useVerifySignature();
  const searchParams = useSearchParams();
  const router = useRouter();

  console.log("State", isPending, isSuccess, isError);

  useEffect(() => {
    // Extract token from URL
    const token = searchParams.get("token");
    console.log('i fire once')

    // Only call the API once
    if (token) {
      verifySignature(token, {
        onSuccess: (data) => {
          console.log("Contract signed successfully:", data);
        },
        onError: (error) => {
          console.error("Error signing contract:", error);
        },
      });
    } else {
      // No token provided, redirect to home page
      console.error("No token provided for contract signing");
      router.push("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div style={{ width: "100%", height: "600px", position: "relative" }}>
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        />
      </div>
      <div className="absolute font-semibold">
        <div className="flex flex-col items-center gap-5">
          <div className="flex items-center gap-2 text-lg">
            {isPending ? (
              <>
                <AiOutlineLoading size={20} className="animate-spin" />
                <p>Signing your contract...</p>
              </>
            ) : isError ? (
              <>
                <div className="text-red-600 flex flex-col items-center">
                  <PiSealWarning size={40} />

                  <p className="mt-2">Unable to sign the contract</p>
                  <p className="text-sm mt-1">
                    {error?.message || "Please try again later"}
                  </p>
                </div>
              </>
            ) : isSuccess ? (
              <>
                <BsClipboard2Check size={40} color="green" />
                <p>Your contract is successfully signed!</p>
              </>
            ) : null}
          </div>
          {(isSuccess || isError) && (
            <Link
              href="/quotation"
              className="text-primary underline text-center"
            >
              Back to my requests
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignPage;
