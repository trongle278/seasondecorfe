"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/app/components/ui/Buttons/Button";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { TbArrowBack, TbArrowNarrowRight, TbCheck } from "react-icons/tb";
import { formatCurrency } from "@/app/helpers";
import Container from "@/app/components/layouts/Container";

const SuccessView = ({
  paymentType = "order",
  amount = 0,
  orderCode,
  bookingCode,
  customerName,
  redirectPath,
  actionLabel = "Go Home",
  handleRedirect
}) => {
  const router = useRouter();
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    
    // Stop confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 10000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);
  
  // Helper functions to dynamically generate content based on payment type
  const getTitle = () => {
    switch (paymentType) {
      case "deposit":
        return "Deposit Payment Successful!";
      case "final":
        return "Final Payment Successful!";
      case "order":
      default:
        return "Order Payment Successful!";
    }
  };
  
  const getMessage = () => {
    switch (paymentType) {
      case "deposit":
        return "Your deposit has been received. We've notified the property owner about your booking.";
      case "final":
        return "Your final payment has been completed. Your booking is now fully confirmed.";
      case "order":
      default:
        return "Your payment has been processed successfully. We've notified the seller about your order.";
    }
  };
  
  const getRedirectOptions = () => {
    switch (paymentType) {
      case "deposit":
        return {
          primary: {
            label: "View Booking",
            path: redirectPath || "/booking/request",
            action: () => router.push(redirectPath || "/booking/request")
          },
          secondary: {
            label: actionLabel || "Go Home",
            action: handleRedirect || (() => router.push("/"))
          }
        };
      case "final":
        return {
          primary: {
            label: "View Bookings",
            path: redirectPath || "/user/orders/completed",
            action: () => router.push(redirectPath || "/user/orders/completed")
          },
          secondary: {
            label: actionLabel || "Go Home",
            action: handleRedirect || (() => router.push("/"))
          }
        };
      case "order":
      default:
        return {
          primary: {
            label: "View Orders",
            path: redirectPath || "/user/orders/completed",
            action: () => router.push(redirectPath || "/user/orders/completed")
          },
          secondary: {
            label: actionLabel || "Go Home",
            action: handleRedirect || (() => router.push("/"))
          }
        };
    }
  };
  
  const redirectOptions = getRedirectOptions();

  return (
    <Container>
      {showConfetti && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          recycle={true}
          numberOfPieces={200}
        />
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="p-6 bg-green-50 dark:bg-green-900/30">
          <div className="flex justify-center">
            <div className="w-16 h-16 flex items-center justify-center bg-green dark:bg-green rounded-full">
              <TbCheck color="white" size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mt-4 text-green dark:text-green">
            {getTitle()}
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mt-2">
            {getMessage()}
          </p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {amount > 0 && (
              <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Amount Paid</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(amount)}
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              {customerName && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Customer</span>
                  <span className="font-medium text-gray-900 dark:text-white">{customerName}</span>
                </div>
              )}
              
              {orderCode && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Order Code</span>
                  <span className="font-medium text-gray-900 dark:text-white">{orderCode}</span>
                </div>
              )}
              
              {bookingCode && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Booking Code</span>
                  <span className="font-medium text-gray-900 dark:text-white">{bookingCode}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Date</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 space-y-3">
            <Button
              label={redirectOptions.primary.label}
              onClick={redirectOptions.primary.action}
              className="w-full"
              icon={<TbArrowNarrowRight size={20} />}
              iconPosition="right"
            />
            
            <Button
              label={redirectOptions.secondary.label}
              onClick={redirectOptions.secondary.action}
              className="w-full !bg-transparent !text-blue-600 hover:!bg-blue-50 dark:!text-blue-400 dark:hover:!bg-blue-900/20 border border-blue-200 dark:border-blue-800"
              icon={<TbArrowBack size={20} />}
            />
          </div>
        </div>
      </motion.div>
    </Container>
  );
};

export default SuccessView;
