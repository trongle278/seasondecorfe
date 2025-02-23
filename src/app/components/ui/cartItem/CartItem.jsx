"use client";

import * as React from "react";
import { BorderBox } from "../BorderBox";
import Image from "next/image";
import Link from "next/link";
import { LuBox } from "react-icons/lu";
import StatusChip from "../StatusChip/StatusChip";
import { FaTrashAlt } from "react-icons/fa";
import ExampleNumberField from "../Select/NumberField";
import { FaDongSign } from "react-icons/fa6";

const CartItem = () => {
  return (
    <BorderBox>
      <div className="rounded-lg border border-gray-300 p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-6">
          {/* Product Image */}
          <Link href="#" className="shrink-0 md:order-1">
            <Image
              src="https://images.unsplash.com/photo-1523865236457-3ae3358a4eaa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              width={150}
              height={150}
              priority
              alt="Product image"
              className="rounded-lg object-cover w-full"
            />
          </Link>

          {/* Product Details */}
          <div className="flex-1 space-y-4 text-center md:text-left md:order-2">
            <Link
              href="#"
              className="text-lg font-semibold text-gray-900 hover:underline dark:text-white block"
            >
              Apple Watch Series 8 (GPS) 41mm Midnight Aluminum Case
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Includes Midnight Sport Band and advanced health features.
            </p>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <LuBox size={20} /> Status:
                <StatusChip status={1} className="text-sm" />
              </span>
              <FaTrashAlt size={20} className="cursor-pointer" color="red" />
            </div>
          </div>

          {/* Quantity and Price */}
          <div className="flex flex-col gap-2 items-center justify-center md:flex-row md:gap-4 mt-3 md:order-3">
            <ExampleNumberField />

            <p className="text-xl font-bold text-gray-900 dark:text-white inline-flex items-center">
              100.000 <FaDongSign />
            </p>
          </div>
        </div>
      </div>
    </BorderBox>
  );
};

export default CartItem;
