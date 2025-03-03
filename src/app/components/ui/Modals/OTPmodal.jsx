"use client";

import * as React from "react";
import Modal from "../Modal";
import Heading from "./components/Heading";
import { useForm } from "react-hook-form";
import useOTPModal from "@/app/hooks/useOTPModel";
import { useRouter } from "next/navigation";
import { useVerifyEmail } from "@/app/queries/user/authen.query";

const OTPConfirmModal = () => {
  const [otp, setOtp] = React.useState({
    first: "",
    second: "",
    third: "",
    fourth: "",
    fifth: "",
    sixth: "",
  });
  const OTPModal = useOTPModal();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    //resolver: yupResolver(schema),
  });

  const isOTPComplete = Object.values(otp).every((digit) => digit !== "");

  const { mutate: verifyEmail, isLoading } = useVerifyEmail();

  const onSubmit = async () => {
    if (!isOTPComplete) return;

    const userOTP = {
      otp: `${otp.first}${otp.second}${otp.third}${otp.fourth}${otp.fifth}${otp.sixth}`,
      email: OTPModal.email,
    };

    verifyEmail(userOTP, {
      onSuccess: () => {
        OTPModal.onClose();
        setOtp({ first: "", second: "", third: "", fourth: "", fifth: "", sixth: "" }); 
        router.push("/authen/login");
      },
      onError: () => {
        setOtp({ first: "", second: "", third: "", fourth: "", fifth: "", sixth: "" });
      },
    });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (value.length <= 1) {
      setOtp({ ...otp, [id]: value });

      // Move focus to the next input field if current field is filled
      if (value.length === 1) {
        const nextInput = document.getElementById(getNextInputId(id));
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const getNextInputId = (currentId) => {
    const ids = ["first", "second", "third", "fourth", "fifth", "sixth"];
    const currentIndex = ids.indexOf(currentId);
    return ids[currentIndex + 1];
  };
  const getPrevInputId = (currentId) => {
    const ids = ["first", "second", "third", "fourth", "fifth", "sixth"];
    const currentIndex = ids.indexOf(currentId);
    return ids[currentIndex - 1];
  };
  const handleKeyDown = (e) => {
    const { id, value } = e.target;
    if (e.key === "Backspace" && value === "") {
      const prevInput = document.getElementById(getPrevInputId(id));
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Please confirm code has been sent to your email"
        center={true}
      />
      <div className="container mx-auto">
        <div className="max-w-sm mx-auto md:max-w-lg">
          <div className="w-full">
            <div className="bg-white h-64 py-3 rounded text-center">
              <h1 className="text-2xl font-bold">OTP Verification</h1>
              <div className="flex flex-col mt-4">
                <span>Enter the OTP you received at</span>
                <span className="font-bold">{OTPModal.email}</span>
              </div>
              <div
                id="otp"
                className="flex flex-row justify-center text-center px-2 mt-5"
              >
                <input
                  className="m-2 border h-10 w-10 text-center form-control rounded dark:text-white"
                  type="text"
                  id="first"
                  maxLength="1"
                  value={otp.first}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  required
                />
                <input
                  className="m-2 border h-10 w-10 text-center form-control rounded dark:text-white"
                  type="text"
                  id="second"
                  maxLength="1"
                  value={otp.second}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  required
                />
                <input
                  className="m-2 border h-10 w-10 text-center form-control rounded dark:text-white"
                  type="text"
                  id="third"
                  maxLength="1"
                  value={otp.third}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  required
                />
                <input
                  className="m-2 border h-10 w-10 text-center form-control rounded dark:text-white"
                  type="text"
                  id="fourth"
                  maxLength="1"
                  value={otp.fourth}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  required
                />
                <input
                  className="m-2 border h-10 w-10 text-center form-control rounded dark:text-white"
                  type="text"
                  id="fifth"
                  maxLength="1"
                  value={otp.fifth}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  required
                />
                <input
                  className="m-2 border h-10 w-10 text-center form-control rounded dark:text-white"
                  type="text"
                  id="sixth"
                  maxLength="1"
                  value={otp.sixth}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  required
                />
              </div>
              <div className="flex justify-center text-center mt-5">
                <a
                  className="flex items-center text-blue-700 hover:text-blue-900 cursor-pointer"
                  //onClick={""}
                >
                  <span className="font-bold">Resend OTP</span>
                  <i className="bx bx-caret-right ml-1"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={OTPModal.isOpen}
      title="Verify"
      actionLabel="Complete"
      onClose={OTPModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      loading={isLoading}
    />
  );
};

export default OTPConfirmModal;
