"use client";

import React from "react";
import Container from "@/app/components/layouts/Container";
import { useParams } from "next/navigation";
import { useGetOrderDetail } from "@/app/queries/order/order.query";
import { FootTypo, BodyTypo } from "@/app/components/ui/Typography";
import { formatDateVN, formatCurrency } from "@/app/helpers";
import { Skeleton } from "@mui/material";
import { BorderBox } from "@/app/components/ui/BorderBox";
import { GiPayMoney } from "react-icons/gi";
import { useGetWallet } from "@/app/queries/wallet/wallet.query";
import { MdErrorOutline } from "react-icons/md";
import Button from "@/app/components/ui/Buttons/Button";
import { useRouter } from "next/navigation";
import { FaWallet } from "react-icons/fa";
import { TbCreditCardPay } from "react-icons/tb";
import { usePayOrder } from "@/app/queries/order/order.query";

const PaymentDetailPage = () => {
  const router = useRouter();
  const { id } = useParams();
  console.log(id);
  const { data: orderDetail, isLoading: orderDetailLoading } =
    useGetOrderDetail(id);
  const { data: wallet, isLoading: walletLoading } = useGetWallet();
  const { mutate: payOrder, isLoading: payOrderLoading } = usePayOrder();

  const hasInsufficientFunds = React.useMemo(() => {
    if (!wallet || !orderDetail) return false;
    return wallet.balance < orderDetail.totalPrice;
  }, [wallet, orderDetail]);

  if (orderDetailLoading) {
    return (
      <Container>
        <Skeleton animation="wave" />
        <Skeleton animation="wave" />
        <Skeleton animation="wave" />
      </Container>
    );
  }

  const handlePayment = () => {
    if (hasInsufficientFunds) {
      router.push("/user/account/wallet");
    } else {
      payOrder(id);
      router.push("/user/orders/completed");
    }
  };

  return (
    <Container>
      <BodyTypo bodylabel="Order Detail" />
      <div className="flex flex-col gap-5 font-semibold my-5 space-y-4">
        <div className="flex flex-row gap-3 items-center">
          <FootTypo footlabel="Order Code" className="!m-0 text-sm" />
          <FootTypo
            footlabel={orderDetail?.orderCode}
            className="!m-0 text-lg bg-primary p-1 rounded-md"
          />
        </div>
        <div className="flex flex-row gap-3 items-center">
          <FootTypo footlabel="Order Date" className="!m-0 text-sm" />
          <FootTypo
            footlabel={formatDateVN(orderDetail?.orderDate)}
            className="!m-0 text-lg"
          />
        </div>
        <div className="flex flex-row gap-3 items-center">
          <FootTypo footlabel="Phone Number" className="!m-0 text-sm" />
          <FootTypo footlabel={orderDetail?.phone} className="!m-0 text-lg" />
        </div>
        <div className="flex flex-row gap-3 items-center">
          <FootTypo footlabel="Total Amount" className="!m-0 text-sm" />
          <FootTypo
            footlabel={formatCurrency(orderDetail?.totalPrice)}
            className="!m-0 text-lg"
          />
        </div>

        <BorderBox className="flex flex-col gap-3 items-start shadow-xl max-w-md">
          <div className="flex flex-row gap-3 items-center">
            <GiPayMoney size={20} />
            <FootTypo footlabel="Payment Method" className="!m-0 text-sm" />
          </div>
          <div className="flex flex-col gap-2">
            <FootTypo
              footlabel={orderDetail?.paymentMethod}
              className="!m-0 text-lg"
            />
            {walletLoading ? (
              <Skeleton animation="wave" />
            ) : (
              <>
                <FootTypo
                  footlabel={formatCurrency(wallet?.balance)}
                  className={`!m-0 text-lg ${
                    hasInsufficientFunds ? "text-red" : ""
                  }`}
                />
                {hasInsufficientFunds && (
                  <div className="flex items-center gap-2 text-red-500 bg-red-100 p-2 rounded-md">
                    <MdErrorOutline size={20} />
                    <FootTypo
                      footlabel="Insufficient funds. Please top up your wallet."
                      className="!m-0 text-sm"
                    />
                  </div>
                )}
              </>
            )}
            <Button
              label={hasInsufficientFunds ? "Top Up" : "Pay"}
              icon={hasInsufficientFunds ? <FaWallet size={20} /> : <TbCreditCardPay size={20} />}
              onClick={handlePayment}
              className={hasInsufficientFunds ? "w-fit" : "w-fit bg-primary"}
            />
          </div>
        </BorderBox>
      </div>
    </Container>
  );
};

export default PaymentDetailPage;
