"use client";

import React, { useState } from "react";
import Container from "@/app/components/layouts/Container";
import { useParams, useSearchParams } from "next/navigation";
import { useGetOrderDetail } from "@/app/queries/order/order.query";
import { FootTypo, BodyTypo } from "@/app/components/ui/Typography";
import { formatDateVN, formatCurrency } from "@/app/helpers";
import { Skeleton, Paper, Divider } from "@mui/material";
import Button from "@/app/components/ui/Buttons/Button";
import { useRouter } from "next/navigation";
import { TbArrowLeft, TbCreditCardPay, TbReceipt } from "react-icons/tb";
import { usePayOrder } from "@/app/queries/order/order.query";
import { useGetWallet } from "@/app/queries/wallet/wallet.query";
import { FaWallet, FaRegCalendarAlt } from "react-icons/fa";
import {
  MdErrorOutline,
  MdOutlinePayment,
  MdOutlineReceiptLong,
  MdOutlineShoppingCart,
  MdLocationOn,
} from "react-icons/md";
import { LuBanknote, LuUser } from "react-icons/lu";
import {
  useGetDepositPayment,
  useGetFinalPayment,
} from "@/app/queries/payment/payment.query";
import { LuBuilding } from "react-icons/lu";
import {
  useDepositBooking,
  usePaymentBooking,
} from "@/app/queries/book/book.query";
import ResultModal from "@/app/components/ui/Modals/ResultModal";
import SuccessView from "../components/SuccessView";

const PaymentDetailPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const paymentType = searchParams.get("type");
  const bookingCode = searchParams.get("bookingCode");
  
  // State to control success view display
  const [showSuccessView, setShowSuccessView] = useState(false);
  const [successData, setSuccessData] = useState(null);
  
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [resultModalData, setResultModalData] = useState({
    title: "",
    message: "",
    type: "success",
  });
  const { mutate: depositBooking, isPending: depositBookingLoading } =
    useDepositBooking();
  const { mutate: paymentBooking, isPending: paymentBookingLoading } =
    usePaymentBooking();

  // Conditionally fetch data based on payment type
  const { data: depositPayment, isLoading: depositPaymentLoading } =
    paymentType === "deposit" || paymentType === "final"
      ? useGetDepositPayment(id)
      : { data: null, isLoading: false };

  const { data: finalPayment, isLoading: finalPaymentLoading } =
    paymentType === "final"
      ? useGetFinalPayment(id)
      : { data: null, isLoading: false };

  const { data: orderDetail, isLoading: orderDetailLoading } =
    paymentType === "order"
      ? useGetOrderDetail(id)
      : { data: null, isLoading: false };

  // Get the appropriate data based on payment type
  const paymentData = React.useMemo(() => {
    switch (paymentType) {
      case "deposit":
        return depositPayment;
      case "final":
        return finalPayment;
      case "order":
      default:
        return orderDetail;
    }
  }, [paymentType, depositPayment, finalPayment, orderDetail]);

  const isLoading =
    depositPaymentLoading || finalPaymentLoading || orderDetailLoading;

  const { data: wallet, isPending: walletLoading } = useGetWallet();
  const { mutate: payOrder, isPending: payOrderLoading } = usePayOrder();

  const hasInsufficientFunds = React.useMemo(() => {
    if (!wallet || !paymentData) return false;
    return (
      wallet.balance <
      (paymentData.totalPrice || paymentData.depositAmount || 0)
    );
  }, [wallet, paymentData]);

  // Format the full address from components
  const formatFullAddress = (data) => {
    if (!data || !data.address) return "No address provided";

    const { street, ward, district, province, detail, addressType } =
      data.address || {};

    const addressParts = [];
    if (detail) addressParts.push(detail);
    if (street) addressParts.push(street);
    if (ward) addressParts.push(ward);
    if (district) addressParts.push(district);
    if (province) addressParts.push(province);

    const fullAddress = addressParts.join(", ");
    return fullAddress || "No address provided";
  };

  // Helper function to get payment type title
  const getPaymentTitle = () => {
    switch (paymentType) {
      case "deposit":
        return "Deposit Payment";
      case "final":
        return "Final Payment";
      case "order":
      default:
        return "Order Payment";
    }
  };

  const handleSuccess = (result, type) => {
    const data = {
      paymentType: type,
      amount: result?.amount || 0,
      orderCode: result?.order?.code,
      bookingCode: result?.booking?.code,
      customerName: result?.customerName || "Customer",
      redirectPath: "/user/orders/completed",
      actionLabel: "Return to Home",
      handleRedirect: () => router.push("/")
    };
    
    setSuccessData(data);
    setResultModalData({
      title: "Payment successful",
      message: "Your payment has been processed successfully!",
      type: "success",
    });
    setResultModalOpen(true);
    
    // Show success view after a brief delay
    setTimeout(() => {
      setResultModalOpen(false);
      setShowSuccessView(true);
    }, 1500);
  };

  const handlePayment = () => {
    if (hasInsufficientFunds) {
      router.push("/user/account/wallet");
      return;
    }

    if (paymentType === "order") {
      payOrder(id, {
        onSuccess: (result) => {
          handleSuccess(result, "order");
        },
        onError: (error) => {
          alert(`Payment failed: ${error.message || "Unknown error"}`);
        },
      });
    }
    if (paymentType === "deposit") {
      depositBooking(bookingCode, {
        onSuccess: (result) => {
          handleSuccess(result, "deposit");
        },
        onError: (error) => {
          setResultModalData({
            title: "Deposit failed",
            message: `Deposit failed: ${error.message || "Unknown error"}`,
            type: "error",
          });
          setResultModalOpen(true);
        },
      });
    }
    if (paymentType === "final") {
      paymentBooking(bookingCode, {
        onSuccess: (result) => {
          handleSuccess(result, "final");
        },
        onError: (error) => {
          setResultModalData({
            title: "Payment failed",
            message: `Final payment failed: ${error.message || "Unknown error"}`,
            type: "error",
          });
          setResultModalOpen(true);
        },
      });
    }
  };

  // If showing success view, render it instead of payment page
  if (showSuccessView && successData) {
    return <SuccessView {...successData} />;
  }

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center gap-1 mb-6">
          <TbArrowLeft size={20} />
          <FootTypo footlabel="Go Back" className="!m-0" />
        </div>
        
        <BodyTypo bodylabel={getPaymentTitle()} />
        
        <Paper
          elevation={0}
          className="p-6 rounded-lg my-6 bg-white dark:bg-slate-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex-1">
                  <Skeleton variant="text" width="40%" height={20} />
                  <Skeleton variant="text" width="60%" height={24} />
                </div>
              </div>
            ))}
          </div>
        </Paper>
      </Container>
    );
  }

  // Handle case where no data is available
  if (!paymentData) {
    return (
      <Container>
        <button
          className="flex items-center gap-1 mb-6"
          onClick={() => router.back()}
        >
          <TbArrowLeft size={20} />
          <FootTypo footlabel="Go Back" className="!m-0" />
        </button>
        
        <div className="p-8 text-center">
          <FootTypo 
            footlabel="Payment information not found. Please try again."
            className="text-red-500"
          />
          <Button
            label="Return to Home"
            onClick={() => router.push("/")}
            className="mt-4"
          />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <button
        className="flex items-center gap-1 mb-6"
        onClick={() => router.back()}
      >
        <TbArrowLeft size={20} />
        <FootTypo footlabel="Go Back" className="!m-0" />
      </button>

      <section className="flex flex-row justify-between items-center mb-6">
        <BodyTypo bodylabel={getPaymentTitle()} />
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-400`}
        >
          <TbReceipt size={18} />
          <span className="text-sm font-medium">
            {paymentData?.orderCode || paymentData?.bookingCode || id}
          </span>
        </div>
      </section>

      {/* Payment Summary */}
      <Paper
        elevation={0}
        className="rounded-lg mb-8 bg-white dark:bg-transparent overflow-hidden dark:text-white"
      >
        <div className="p-4 bg-blue-50 dark:bg-slate-800 border-b border-blue-100 dark:border-blue-800">
          <div className="flex items-center gap-2">
            <MdOutlineReceiptLong
              className="text-blue-600 dark:text-blue-400"
              size={20}
            />
            <h3 className="font-medium">Payment Summary</h3>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
            <div className="flex items-start gap-4">
              <div
                className={`p-2 rounded-lg ${
                  paymentType === "deposit" || paymentType === "final"
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : "bg-blue-50 dark:bg-blue-900/20"
                }`}
              >
                <MdOutlineShoppingCart
                  className="text-blue-600 dark:text-blue-400"
                  size={24}
                />
              </div>
              <div>
                <FootTypo
                  footlabel={
                    paymentType === "deposit" || paymentType === "final"
                      ? "Contract Code"
                      : "Order Code"
                  }
                  className="text-slate-500 dark:text-slate-400"
                />
                <FootTypo
                  footlabel={
                    paymentData?.orderCode || paymentData?.bookingCode || id
                  }
                  className="font-medium text-slate-900 dark:text-white"
                />
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg">
                <FaRegCalendarAlt
                  className="text-purple-600 dark:text-purple-400"
                  size={24}
                />
              </div>
              <div>
                <FootTypo
                  footlabel={
                    paymentType === "deposit" || paymentType === "final"
                      ? "Booking Date"
                      : "Order Date"
                  }
                  className="text-slate-500 dark:text-slate-400"
                />
                <FootTypo
                  footlabel={formatDateVN(
                    paymentData?.orderDate ||
                      paymentData?.bookingDate ||
                      new Date()
                  )}
                  className="text-slate-900 dark:text-white"
                />
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">
                <LuBanknote
                  className="text-amber-600 dark:text-amber-400"
                  size={24}
                />
              </div>
              <div>
                <FootTypo
                  footlabel={
                    paymentType === "deposit"
                      ? "Deposit Amount"
                      : paymentType === "final"
                      ? "Final Payment"
                      : "Total Amount"
                  }
                  className="text-slate-500 dark:text-slate-400"
                />
              <FootTypo
                  footlabel={formatCurrency(
                    paymentData?.totalPrice || paymentData?.depositAmount || 0
                  )}
                  className="text-slate-900 dark:text-white text-lg"
                />
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-rose-50 dark:bg-rose-900/20 p-2 rounded-lg">
                <LuUser
                  className="text-rose-600 dark:text-rose-400"
                  size={24}
                />
              </div>
              <div>
                <FootTypo
                  footlabel={paymentType === "deposit" ? "You" : "You"}
                  className="text-slate-500 dark:text-slate-400"
                />
                {paymentType === "order" ? (
                  <FootTypo
                    footlabel={
                      paymentData?.customerName || paymentData?.address?.phone
                    }
                    className="text-slate-900 dark:text-white"
                  />
                ) : (
                  <>
                     <FootTypo
                      footlabel={
                        paymentData?.customerName || paymentData?.address?.phone
                      }
                      className="text-slate-900 dark:text-white"
                    />
                    <FootTypo
                      footlabel={
                        paymentData?.customerEmail ||
                        paymentData?.address?.phone
                      }
                      className="text-slate-900 dark:text-white text-sm"
                    />
                  </>
                )}
              </div>
            </div>

            {paymentType === "deposit" && (
              <>
                <div className="flex items-start gap-4">
                  <div className="bg-teal-50 dark:bg-teal-900/20 p-2 rounded-lg">
                    <MdLocationOn
                      className="text-teal-600 dark:text-teal-400"
                      size={24}
                    />
                  </div>
                  <div>
                    <FootTypo
                      footlabel={
                        paymentType === "deposit" ? "Address" : "Final Payment"
                      }
                      className="text-slate-500 dark:text-slate-400"
                    />
                    <FootTypo
                      footlabel={paymentData?.customerAddress || "Not updated"}
                      className="text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-lg">
                    <LuBuilding
                      className="text-indigo-600 dark:text-indigo-400"
                      size={24}
                    />
                  </div>
                  <div>
                    <FootTypo
                      footlabel={
                        paymentType === "deposit" ? "Provider" : "Final Payment"
                      }
                      className="text-slate-500 dark:text-slate-400"
                    />
                    <FootTypo
                      footlabel={paymentData?.providerName || "Not updated"}
                      className="text-slate-900 dark:text-white"
                    />
                    <FootTypo
                      footlabel={paymentData?.providerEmail || "Not updated"}
                      className="text-slate-900 dark:text-white text-sm"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Payment Status - For final payments */}
            {paymentType === "final" && depositPayment && (
              <div className="flex items-start gap-4 col-span-1 md:col-span-2">
                <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                  <FaWallet
                    className="text-green-600 dark:text-green-400"
                    size={24}
                  />
                </div>
                <div className="flex-1">
                  <FootTypo
                    footlabel="Previous Payment"
                    className="text-slate-500 dark:text-slate-400"
                  />
                  <div className="flex gap-4 mt-2">
                    <div>
                      <FootTypo
                        footlabel="Deposit Paid"
                        className="text-sm text-slate-500 dark:text-slate-400"
                      />
                      <FootTypo
                        footlabel={formatCurrency(depositPayment?.amount || 0)}
                        className="font-medium text-green-600 dark:text-green-400"
                      />
                    </div>
                    <div>
                      <FootTypo
                        footlabel="Remaining Balance"
                        className="text-sm text-slate-500 dark:text-slate-400"
                      />
                      <FootTypo
                        footlabel={formatCurrency(finalPayment?.amount || 0)}
                        className="font-medium text-amber-600 dark:text-amber-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Address */}
            {paymentData?.address && (
              <div className="flex items-start gap-4 col-span-1 md:col-span-2">
                <div className="bg-teal-50 dark:bg-teal-900/20 p-2 rounded-lg">
                  <MdLocationOn
                    className="text-teal-600 dark:text-teal-400"
                    size={24}
                  />
                </div>
                <div className="flex-1">
                  <FootTypo
                    footlabel={`Address ${
                      paymentData?.address?.addressType &&
                      `(${paymentData.address.addressType})`
                    }`}
                    className="text-slate-500 dark:text-slate-400"
                  />
                  <p className="font-medium text-slate-900 dark:text-white mt-1">
                    {paymentData?.address?.fullName || ""}
                  </p>
                  <FootTypo
                    footlabel={formatFullAddress(paymentData)}
                    className="text-slate-700 dark:text-slate-300 text-sm mt-1"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Paper>

      {/* Payment Methods */}
      <Paper
        elevation={0}
        className="rounded-lg mb-8 bg-white dark:bg-transparent overflow-hidden dark:text-white"
      >
        <div className="p-4 bg-green-50 dark:bg-green-900/10 border-b border-green-100 dark:border-green-800">
          <div className="flex items-center gap-2">
            <MdOutlinePayment
              className="text-green-600 dark:text-green-400"
              size={20}
            />
            <h3 className="font-medium m-0">Payment Method</h3>
          </div>
        </div>
        
        <div className="p-6">
          {/* Wallet Payment Option */}
          <div className={`flex items-start p-4 mb-4 rounded-lg border-2`}>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg mr-4">
              <FaWallet
                className="text-blue-600 dark:text-blue-400"
                size={20}
              />
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <FootTypo
                    footlabel="Wallet Balance"
                    className="font-medium text-slate-900 dark:text-white"
                  />
                  <FootTypo
                    footlabel="Pay using your wallet balance"
                    className="text-sm text-slate-500 dark:text-slate-400"
                  />
                </div>
              </div>

              {walletLoading ? (
                <Skeleton animation="wave" width={100} height={24} />
              ) : (
                <div className="mt-2">
                  <p
                    className={`font-bold text-lg ${
                      hasInsufficientFunds
                        ? "text-red-500"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    {formatCurrency(wallet?.balance)}
                  </p>
                  
                  {hasInsufficientFunds && (
                    <div className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/10 py-2 rounded-md mt-2 underline text-rose-500">
                      <MdErrorOutline size={20} />
                      <FootTypo
                        footlabel="Insufficient funds. Please top up your wallet."
                        className="!m-0 text-sm"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <Divider />
        
        <div className="p-6 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4 text-gray-500">
            <FootTypo footlabel="Total to pay:" className="m-0 text-sm" />
            <FootTypo
              footlabel={formatCurrency(
                paymentData?.totalPrice || paymentData?.depositAmount || 0
              )}
              className="m-0 font-bold text-lg text-slate-900 dark:text-white"
            />
          </div>
          
          <Button
            label={
              hasInsufficientFunds ? "Top Up Wallet" : "Proceed to Payment"
            }
            icon={
              hasInsufficientFunds ? (
                <FaWallet size={20} />
              ) : (
                <TbCreditCardPay size={20} />
              )
            }
            onClick={handlePayment}
            className="text-base"
            isLoading={payOrderLoading || depositBookingLoading || paymentBookingLoading}
            disabled={payOrderLoading || depositBookingLoading || paymentBookingLoading}
          />
          
          <FootTypo
            footlabel="By completing this payment, you agree to the terms and conditions of our service."
            className="text-xs text-gray-500 mt-4 text-center max-w-sm"
          />
        </div>
      </Paper>

      {/* Add ResultModal component */}
      <ResultModal
        open={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
        title={resultModalData.title}
        message={resultModalData.message}
        type={resultModalData.type}
      />
    </Container>
  );
};

export default PaymentDetailPage;
