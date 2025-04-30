"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Logo from "@/app/components/Logo";
import Input from "@/app/components/ui/inputs/Input";
import { FootTypo } from "@/app/components/ui/Typography";
import { useForm } from "react-hook-form";
import { TbCurrencyDong } from "react-icons/tb";
import { BorderBox } from "@/app/components/ui/BorderBox";
import { useUser } from "@/app/providers/userprovider";
import { IoArrowBack, IoChevronDown, IoChevronUp } from "react-icons/io5";
import { Divider } from "@mui/material";
import { VnPayIcon, MomoIcon } from "@/app/components/icons";
import Button from "@/app/components/ui/Buttons/Button";
import { MdNavigateNext } from "react-icons/md";
import { useCreateTopup } from "@/app/queries/payment/payment.query";

const PayPage = () => {
  const [isHover, setIsHover] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useUser();
  const { mutate: mutateTopup } = useCreateTopup();

  const paymentMethods = [
    { id: "vnpay", name: "VNPay", icon: <VnPayIcon /> },
    { id: "momo", name: "Momo", icon: <MomoIcon /> },
  ];

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const handlePaymentSelect = (method) => {
    setSelectedPayment(method);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      ammount: "",
      transactionType: 0,
      transactionStatus: 1,
      customerId: user?.id,
    },
  });

  const onSubmit = async (data) => {
    setIsProcessing(true);
    
    const topupData = {
      amount: data.ammount,
      transactionType: 0,
      transactionStatus: 1,
      customerId: user?.id,
      paymentMethod: selectedPayment
    };
    
    mutateTopup(topupData, {
      onSuccess: (response) => {
        console.log("success", response);
        
        if (selectedPayment === "vnpay") {
          if (response?.data) {
            window.location.href = response.data;
          } else {
            setIsProcessing(false);
            alert("Payment URL not found. Please try again or contact support.");
          }
        } else if (selectedPayment === "momo") {
          if (response?.data?.momoUrl) {
            window.location.href = response.data.momoUrl;
          } else {
            setIsProcessing(false);
            alert("Momo payment link not found. Please try again or contact support.");
          }
        } else {
          setIsProcessing(false);
        }
      },
      onError: (error) => {
        console.log(error);
        setIsProcessing(false);
        alert("An error occurred while processing your payment. Please try again.");
      },
    });
  };

  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <main className="flex h-full min-h-[50vh] lg:min-h-screen w-full relative z-10 p-4 sm:p-8 md:p-12 lg:p-20">
        <div className="mx-auto flex w-full max-w-md flex-col justify-center gap-4 md:gap-6 items-center">
          <div
            className="logo-wrapper flex relative cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={`transition-opacity duration-200 ${
                isHover ? "opacity-0" : "opacity-100"
              }`}
            >
              <Logo outsideStyle="!m-0" insideStyle="!m-0" />
            </div>
            <Link
              href="/user/account/wallet"
              className={`absolute top-0 left-0 w-full h-full flex items-center justify-center transition-opacity duration-200  ${
                isHover ? "opacity-100" : "opacity-0"
              }`}
            >
              <IoArrowBack size={20} className="mr-1" /> Back
            </Link>
          </div>

          <FootTypo
            footlabel="Enter the ammount"
            className="!m-0 text-xl font-semibold leading-9 tracking-tight text-black dark:text-white"
          />

          <div className="mt-3 w-full max-w-sm">
            <div className="space-y-6">
              <div className="flex flex-col space-y-2 w-full">
                <Input
                  id="ammount"
                  placeholder="Ammount"
                  formatPrice
                  icon={<TbCurrencyDong size={20} />}
                  control={control}
                  type="text"
                  required
                  className="pl-10"
                  register={register}
                />
              </div>
              <div className="flex justify-between items-center">
                <p className="hover:text-red text-sm">
                  <Link href="/#">Do you need help?</Link>
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Payment Options (visible only on small screens) */}
          <div className="w-full mt-8 lg:hidden">
            <Divider className="mb-4" />
            <div className="flex flex-col space-y-4">
              <FootTypo
                footlabel="Payment Details"
                className="!m-0 text-lg font-semibold"
              />

              <div className="relative w-full" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between w-full p-2 border border-gray-300 rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {selectedPayment ? (
                      <>
                        <div className="text-primary">
                          {
                            paymentMethods.find((m) => m.id === selectedPayment)
                              ?.icon
                          }
                        </div>
                        <span className="text-sm font-medium">
                          {
                            paymentMethods.find((m) => m.id === selectedPayment)
                              ?.name
                          }
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500 p-2">
                        Select payment method
                      </span>
                    )}
                  </div>
                  {isDropdownOpen ? <IoChevronUp /> : <IoChevronDown />}
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 dark:bg-neutral-800 dark:border-neutral-700 overflow-hidden">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => handlePaymentSelect(method.id)}
                        className={`flex items-center gap-3 p-3 w-full hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors ${
                          selectedPayment === method.id ? "bg-primary/5" : ""
                        }`}
                      >
                        <div
                          className={
                            selectedPayment === method.id
                              ? "text-primary"
                              : "text-gray-600"
                          }
                        >
                          {method.icon}
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            selectedPayment === method.id
                              ? "text-primary"
                              : "text-gray-700 dark:text-gray-200"
                          }`}
                        >
                          {method.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-start mt-2">
                <input
                  type="checkbox"
                  {...register("agreePolicy", { required: true })}
                  className="mr-2 mt-1 w-4 h-4 cursor-pointer"
                />
                <label className="text-sm">
                  You'll be charged the amount and at the frequency listed above
                  until you cancel. We may change our prices as described in our
                  <Link href="/#" className="underline ml-1">
                    Terms & Conditions
                  </Link>
                </label>
              </div>
              {errors.agreePolicy && (
                <p className="text-red text-sm mt-2">
                  You must agree to proceed.
                </p>
              )}

              <Button
                label={isProcessing ? "Processing..." : "Proceed"}
                disabled={!selectedPayment || isProcessing}
                className="w-full mt-4"
                icon={isProcessing ? 
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> : 
                  <MdNavigateNext size={20} />
                }
                onClick={handleSubmit(onSubmit)}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Desktop payment section - hidden on mobile */}
      <div className="relative w-full z-20 h-full hidden lg:flex border-l border-gray-50 shadow-xl dark:border-neutral-800 overflow-hidden bg-transparent dark:bg-neutral-900 rounded-2xl">
        <BorderBox className="w-full h-full flex flex-col items-center justify-center gap-2">
          <div className="flex flex-col items-center justify-center gap-4 border border-1 p-5 rounded-xl shadow-xl w-4/5 space-y-2 max-w-xl">
            <div className="inline-flex gap-5 self-start flex-wrap">
              <FootTypo
                footlabel="Email"
                className="!m-0 text-lg font-primary leading-9 tracking-tight text-black dark:text-white"
              />
              <FootTypo
                footlabel={user?.email}
                className="!m-0 text-sm leading-9 tracking-tight text-black dark:text-white"
              />
            </div>
            <Divider variant="fullWidth" flexItem />
            <div className="w-full flex flex-col sm:flex-row justify-start gap-4 items-start sm:items-center">
              <FootTypo
                footlabel="Pay with"
                className="!m-0 text-lg font-primary leading-9 tracking-tight text-black dark:text-white"
              />

              <div className="relative w-full sm:w-[300px]" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between w-full p-2 border border-gray-300 rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex items-center gap-2 ">
                    {selectedPayment ? (
                      <>
                        <div className="text-primary">
                          {
                            paymentMethods.find((m) => m.id === selectedPayment)
                              ?.icon
                          }
                        </div>
                        <span className="text-sm font-medium">
                          {
                            paymentMethods.find((m) => m.id === selectedPayment)
                              ?.name
                          }
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500 p-2">
                        Select payment method
                      </span>
                    )}
                  </div>
                  {isDropdownOpen ? <IoChevronUp /> : <IoChevronDown />}
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 dark:bg-neutral-800 dark:border-neutral-700 overflow-hidden">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => handlePaymentSelect(method.id)}
                        className={`flex items-center gap-3 p-1 w-full hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors ${
                          selectedPayment === method.id ? "bg-primary/5" : ""
                        }`}
                      >
                        <div
                          className={
                            selectedPayment === method.id
                              ? "text-primary"
                              : "text-gray-600"
                          }
                        >
                          {method.icon}
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            selectedPayment === method.id
                              ? "text-primary"
                              : "text-gray-700 dark:text-gray-200"
                          }`}
                        >
                          {method.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex self-start mt-6">
              <input
                type="checkbox"
                {...register("agreePolicy", { required: true })}
                className="mr-2 mt-1 w-4 h-4 cursor-pointer"
              />
              <label className="text-sm">
                You'll be charged the amount and at the frequency listed above
                until you cancel. We may change our prices as described in our
                <Link href="/#" className="underline ml-1">
                  Terms & Conditions
                </Link>
              </label>
            </div>

            {errors.agreePolicy && (
              <p className="text-red text-sm mt-2">
                You must agree to proceed.
              </p>
            )}
            <Button
              label={isProcessing ? "Processing..." : "Proceed"}
              disabled={!selectedPayment || isProcessing}
              className="self-start mt-2"
              icon={isProcessing ? 
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> : 
                <MdNavigateNext size={20} />
              }
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </BorderBox>
      </div>
    </div>
  );
};

export default PayPage;
