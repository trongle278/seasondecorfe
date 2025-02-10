"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import Input from "@/app/components/ui/Inputs/Input";
import { useForm } from "react-hook-form";
import { IoMailOutline } from "react-icons/io5";
import { TbLockPassword } from "react-icons/tb";
import Button2 from "@/app/components/ui/Buttons/Button2";
import { FaGoogle } from "react-icons/fa";

export default function Login() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    //resolver: yupResolver(schema),
  });
  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const response = await signIn("credentials", {
      redirect: false, // Quan trọng: Không redirect khi có lỗi
      email,
      password,
    });

    if (response?.error) {
      setError(response.error); // Hiển thị lỗi trên form
      toast.error(response.error);
    } else {
      toast.success("Login successful!");
      router.push("/"); // Chuyển hướng nếu thành công
    }
  };
  return (
    <div className="min-h-screen">
      <div className="container mx-auto flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center">
            Welcome Back!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Login to your account and start exploring seasonal decorations.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-8"

          >
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="Your email"
                errors={errors}
                register={register}
                required
                icon={<IoMailOutline />}
              />
            </div>

            <div className="relative">
              <Input
                id="password"
                type="password"
                placeholder="Password"
                errors={errors}
                register={register}
                required
                icon={<TbLockPassword />}
              />
            </div>

            <Button2
              type="submit"
              label="Continue with email"
              btnClass="w-full mt-3 mb-1"
              labelClass="justify-center p-3"
            />
          </form>

          <div className="relative">
            <div className="w-full h-px dark:bg-neutral-900 bg-white"></div>
            <div className="w-full h-px bg-neutral-200 dark:bg-neutral-800"></div>
            <div className="absolute inset-0 h-5 w-5 m-auto rounded-xl dark:bg-neutral-800 bg-white shadow-input dark:shadow-[0px_-1px_0px_0px_var(--neutral-700)] flex items-center justify-center">
              <span className="h-3 w-3 text-[10px] font-bold text-neutral-400 dark:text-neutral-300 !m-0 !p-0 leading-[10px] ml-[4px] inline-block">
                or
              </span>
            </div>
          </div>

          <Button2
            type="button"
            onClick={handleGoogleLogin}
            label="Continue with"
            btnClass="w-full m-0"
            labelClass="justify-center p-3"
            icon={<FaGoogle />}
          />

          <p className="text-gray-600 dark:text-gray-300 text-center">
            Don't have an account ?
            <Link
              href="/authen/signup"
              className="text-orange-500 hover:underline ml-2"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
