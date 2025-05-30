"use client";

import React, { useCallback, useState, useRef } from "react";
import { Label } from "@/app/components/ui/inputs/Label";
import Input from "@/app/components/ui/inputs/Input";
import ThemeSwitch from "@/app/components/ThemeSwitch";
import Logo from "@/app/components/Logo";
import Link from "next/link";
import Button2 from "@/app/components/ui/Buttons/Button2";
import InfiniteScroll from "@/app/components/ui/animated/InfiniteScroll";
import { items } from "@/app/constant/items";
import { EditAvatar } from "@/app/components/logic/EditAvatar";
import { useUser } from "@/app/providers/userprovider";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCreateProviderProfile } from "@/app/queries/user/provider.query";
import { useRouter } from "next/navigation";
import { FaAngleRight } from "react-icons/fa6";
import { Field } from "@headlessui/react";
import TipTapEditor from "@/app/components/ui/editors/TipTapEditor";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  bio: yup.string().required("Bio is required"),
  phone: yup.string().required("Phone is required"),
  address: yup.string().required("Address is required"),
});

export default function RegistrationPage() {
  const { user } = useUser();
  const mutationCreate = useCreateProviderProfile();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      avatar: user?.avatar || null,
      name: "",
      bio: "",
      phone: "",
      address: "",
    },
  });

  const onSubmit = useCallback(
    async (data) => {
      const payload = {
        avatar: data.avatar,
        name: data.name,
        bio: data.bio,
        phone: data.phone,
        address: data.address,
      };

      console.log("payload", payload);

      mutationCreate.mutate(payload, {
        onSuccess: () => {
          reset();
          router.push("/seller/dashboard");
        },
        onError: (error) => {
          console.error("Error sending invitation:", error.message);
        },
      });
    },
    [mutationCreate, reset, router]
  );

  return (
    <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">
      <main className="flex h-full min-h-screen w-full relative z-10">
        <div className="absolute right-0 top-0">
          <ThemeSwitch />
        </div>
        <div className="flex items-start w-full justify-start px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto flex w-full flex-col justify-center gap-6 items-center">
            <div>
              <div className="logo-wrapper flex justify-center items-center relative">
                <Logo outsideStyle="!m-0" insideStyle="!m-0" />
              </div>
            </div>
            <h2 className="text-2xl font-bold leading-9 tracking-tight text-black dark:text-white">
              Provide more information
            </h2>
            <div className="mt-10 w-[80%]">
              <div className="space-y-6">
                <EditAvatar
                  userImg={user?.avatar}
                  className="justify-center"
                  childStyle="left-60"
                />

                <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2 ">
                  <div className="flex w-full flex-col space-y-2">
                    <Label htmlFor="providerName">Provider's name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      type="text"
                      required
                      className="pl-3"
                      register={register}
                    />
                    {errors.name && (
                      <p className="text-red">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="flex w-full flex-col space-y-2">
                    <Label htmlFor="providerPhone"> Phone number</Label>
                    <Input
                      id="phone"
                      placeholder="..."
                      type="text"
                      required
                      className="pl-3"
                      register={register}
                    />
                    {errors.phone && (
                      <p className="text-red">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="providerBio">Bio</Label>
                  <div className="w-full">
                    <Field>
                      <TipTapEditor
                        value={watch("bio") || ""}
                        onChange={(html) => setValue("bio", html)}
                        placeholder="Introduce yourself..."
                      />
                      {/* Hidden input for form submission */}
                      <input type="hidden" {...register("bio")} />
                    </Field>
                    {errors.bio && (
                      <p className="text-red">{errors.bio.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="providerAddress">Address</Label>
                  <Input
                    id="address"
                    placeholder="ward, district, city"
                    type="text"
                    required
                    className="pl-3"
                    register={register}
                  />
                  {errors.address && (
                    <p className="text-red">{errors.address.message}</p>
                  )}
                </div>
                <div className="flex justify-between gap-16 items-center">
                  <p className="hover:text-red">
                    <Link href="/#">Do you need help ?</Link>
                  </p>
                </div>
                {/* Submit Button */}
                <Button2
                  onClick={handleSubmit(onSubmit)}
                  loading={mutationCreate.isPending}
                  label="Continue"
                  btnClass="w-full"
                  labelClass="justify-center p-3 z-0"
                  disabled={mutationCreate.isPending}
                  icon={<FaAngleRight size={15} />}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="relative w-full z-20 h-full max-h-[150vh] hidden md:flex border-l border-neutral-100 dark:border-neutral-800 overflow-hidden bg-transparent dark:bg-neutral-900 items-center justify-center">
        <InfiniteScroll
          items={items}
          isTilted={true}
          tiltDirection="left"
          autoplay={true}
          autoplaySpeed={0.5}
          autoplayDirection="down"
          pauseOnHover={true}
        />
      </div>
    </div>
  );
}
