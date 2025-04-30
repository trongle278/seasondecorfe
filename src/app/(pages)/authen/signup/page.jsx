"use client";
import React from "react";
import Link from "next/link";
import Input from "@/app/components/ui/inputs/Input";
import { useForm } from "react-hook-form";
import { Label } from "@/app/components/ui/inputs/Label";
import DropdownSelect from "@/app/components/ui/Select/DropdownSelect";
import Button2 from "@/app/components/ui/Buttons/Button2";
import BasicDatePicker from "@/app/components/ui/Select/DatePicker";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useOTPModal from "@/app/hooks/useOTPModel";
import Logo from "@/app/components/Logo";
import { useRegisterCustomer } from "@/app/queries/user/authen.query";

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),

  email: yup
    .string()
    .email("Email is invalid. Please enter a valid email address.")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function SignUp() {
  const OTPModal = useOTPModal();
  const mutateRegister = useRegisterCustomer();

  const genderOptions = [
    { id: 0, name: "Female" },
    { id: 1, name: "Male" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      gender: "",
      phone: "",
      address: "",
      dob: "",
    },
    //resolver: yupResolver(schema),
  });


  const handleGenderChange = (selectedGender) => {
    setValue("gender", selectedGender); // Update form value
  };

  const onSubmit = async (data) => {
    const userData = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dob,
      gender: data.gender === "true",
      phone: data.phone,
      address: data.address,
    };
    mutateRegister.mutate(userData, {
      onSuccess: () => {
        OTPModal.onOpen(data.email);
      },
    });
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <div className="container mx-auto flex w-screen flex-col items-center justify-center">
        {/* Right Side: Sign Up Form */}
        <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px] items-center">
          <Logo outsideStyle="justify-center !m-0" insideStyle="!m-0" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center">
            Create Your Account
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Start exploring seasonal decorations for your home.
          </p>

          {/* Form */}
          <form className="flex flex-col gap-5">
            {/* Full Name Input */}
            <div className="relative">
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                <div className="flex flex-col space-y-2 w-full">
                  <Label htmlFor="firstname">First name</Label>
                  <Input
                    id="firstName"
                    placeholder="Tyler"
                    type="text"
                    required
                    register={register}
                    errors={errors}
                    className="pl-3"
                  />
                  {errors.firstName && (
                    <p className="text-red">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="flex flex-col space-y-2 w-full">
                  <Label htmlFor="lastname">Last name</Label>
                  <Input
                    id="lastName"
                    placeholder="Duren"
                    required
                    register={register}
                    errors={errors}
                    type="text"
                    className="pl-3"
                  />
                  {errors.lastName && (
                    <p className="text-red">{errors.lastName.message}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col space-y-2 w-full mb-4">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  placeholder="example@mail.com"
                  required
                  register={register}
                  errors={errors}
                  type="text"
                  className="pl-3"
                />
                {errors.email && (
                  <p className="text-red">{errors.email.message}</p>
                )}
              </div>
              <div className="flex flex-col space-y-2 w-full mb-4">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  required
                  register={register}
                  errors={errors}
                  type="password"
                  className="pl-3"
                />
                {errors.password && (
                  <p className="text-red">{errors.password.message}</p>
                )}
              </div>
              <div className="flex flex-col space-y-2 w-full mb-4">
                <Label htmlFor="confirmpassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  placeholder="••••••••"
                  required
                  register={register}
                  errors={errors}
                  type="password"
                  className="pl-3"
                />
                {errors.confirmPassword && (
                  <p className="text-red">{errors.confirmPassword.message}</p>
                )}
              </div>
              <div className="flex flex-row md:flex-row space-y-2 md:space-y-0 md:space-x-2 my-5 items-center justify-between">
                <div className="flex flex-col">
                  <DropdownSelect
                    label="Select Gender"
                    options={genderOptions}
                    value="Male"
                    onChange={handleGenderChange}
                  />
                </div>

                <div className="flex flex-col">
                  <BasicDatePicker
                    label="Day of birth"
                    selectedDate={watch("dob")}
                    onChange={(date) => setValue("dob", date)}
                    required={true}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button2
              onClick={handleSubmit(onSubmit)}
              loading={mutateRegister.isPending}
              label="Continue"
              btnClass="w-full"
              labelClass="justify-center p-3 z-0"
            />
          </form>

          <p className="text-center text-gray-600 dark:text-gray-300">
            Already have an account ?
            <Link
              href="/authen/login"
              className="text-red hover:underline ml-2"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
