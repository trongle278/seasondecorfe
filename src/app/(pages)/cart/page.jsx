"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import Container from "@/app/components/layouts/Container";
import { HeadTypo, BodyTypo, FootTypo } from "@/app/components/ui/Typography";
import Button2 from "@/app/components/ui/Buttons/Button2";
import { BorderBox } from "@/app/components/ui/BorderBox";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import CartItem from "@/app/components/ui/cartItem/CartItem";

const Cart = () => {
  return (
    <Container>
      <section className="w-full min-h-screen mx-auto 2xl:px-0">
        <BodyTypo bodylabel="Cart item" />
        <main className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          {/* left Cart */}

          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div className="space-y-6">
              <CartItem />
              <CartItem />
            </div>
          </div>

          {/* right Cart */}

          <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
            <BorderBox>
              <FootTypo footlabel="Order Summary" />
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <HeadTypo label="Original price" />
                    <HeadTypo label="$1,000.00" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <HeadTypo label="Original price" />
                    <HeadTypo label="$1,000.00" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <HeadTypo label="Original price" />
                    <HeadTypo label="$1,000.00" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <HeadTypo label="Original price" />
                    <HeadTypo label="$1,000.00" />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                  <HeadTypo label="Total" />
                  <HeadTypo label="$1,000.00" />
                </div>
              </div>
              <Button2
                label="Checkout"
                onClick={() => {}}
                btnClass="w-full"
                labelClass="justify-center p-3 z-0"
              />
              <div className="flex items-center justify-center gap-2">
                <span className="">or</span>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm font-medium text-red underline hover:no-underline dark:text-primary-500"
                >
                  Continue Shopping <MdKeyboardArrowRight size={20}/>
                </Link>
              </div>
            </BorderBox>
            <BorderBox>
              <form className="space-y-4">
                <FootTypo footlabel="Do you have vouchers or gift cards ?" />
                <Button2
                  label="Apply"
                  onClick={() => {}}
                  btnClass="w-full"
                  labelClass="justify-center p-3 z-0"
                />
              </form>
            </BorderBox>
          </div>
        </main>
      </section>
    </Container>
  );
};

export default Cart;
