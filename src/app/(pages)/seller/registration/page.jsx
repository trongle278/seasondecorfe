"use client";

import * as React from "react";
import { Label } from "@/app/components/ui/inputs/Label";
import Input from "@/app/components/ui/inputs/Input";
import Avatar from "@/app/components/ui/avatar/Avatar";
import { useSession } from "next-auth/react";
import { MdEdit } from "react-icons/md";
import ShinyText from "@/app/components/ui/ShinyText";
import ThemeSwitch from "@/app/components/ThemeSwitch";
import Logo from "@/app/components/Logo";
import Link from "next/link";
import Button2 from "@/app/components/ui/buttons/Button2";
import { ClipLoader } from "react-spinners";
import InfiniteScroll from "@/app/components/ui/InfiniteScroll";
import { items } from "@/app/items";

export default function RegistrationPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { data } = useSession();

  return (
    <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">
      <main className="flex h-full min-h-screen w-full relative">
        <div className="absolute right-0 top-0">
          <ThemeSwitch />
        </div>
        <div className="flex items-center w-full justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto flex w-full flex-col justify-center gap-6 items-center">
            <div>
              <div className="logo-wrapper flex justify-center items-center relative">
                <Logo outsideStyle="!m-0" insideStyle="!m-0"/>
              </div>
            </div>
            <h2 className="text-2xl font-bold leading-9 tracking-tight text-black dark:text-white">
              Tell us more
            </h2>
            <div className="mt-10">
              <form className="space-y-6">
                <div className="relative flex justify-center">
                  <Avatar
                    userImg={data?.user?.image}
                    h={120}
                    w={120}
                    className={"cursor-pointer"}
                  />
                  <div className="absolute bottom-0 left-40 inline-flex items-center gap-1 rounded bg-black bg-opacity-50 p-1 text-sm text-white dark:bg-white dark:text-black">
                    <MdEdit />
                    Edit
                  </div>
                </div>

                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                  <div className="flex flex-col space-y-2 w-full">
                    <Label htmlFor="providerName">Provider's name</Label>
                    <Input
                      id="providerName"
                      placeholder="John Doe"
                      type="text"
                      required
                      className="pl-3"
                    />
                  </div>

                  <div className="flex flex-col space-y-2 w-full">
                    <Label htmlFor="providerBio">Bio</Label>
                    <Input
                      id="providerBio"
                      placeholder="John Doe"
                      type="text"
                      required
                      className="pl-3"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="providerPhone">Provider's phone</Label>
                  <Input
                    id="providerPhone"
                    placeholder="..."
                    type="text"
                    required
                    className="pl-3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="providerBio">Provider's address</Label>
                  <Input
                    id="providerBio"
                    placeholder="123 street"
                    type="text"
                    required
                    className="pl-3"
                  />
                </div>
                <div className="flex justify-between gap-16 items-center">
                  <p className="hover:text-red">
                    <Link href="/#">Do you need help ?</Link>
                  </p>
                </div>
                {/* Submit Button */}
                <Button2
                  onClick={() => {}}
                  disabled={isLoading}
                  label={
                    isLoading ? (
                      <ClipLoader size={20} color={"#fff"} />
                    ) : (
                      "Continue"
                    )
                  }
                  btnClass="w-full"
                  labelClass="justify-center p-3 z-0"
                />
              </form>
            </div>
          </div>
        </div>
      </main>

      <div className="relative w-full h-screen z-20 hidden md:flex border-l border-neutral-100 dark:border-neutral-800 overflow-hidden bg-gray-50 dark:bg-neutral-900 items-center justify-center">
        <InfiniteScroll
          items={items}
          isTilted={true}
          tiltDirection="left"
          autoplay={true}
          autoplaySpeed={0.2}
          autoplayDirection="down"
          pauseOnHover={true}
        />
      </div>
    </div>
  );
}
