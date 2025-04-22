"use client";

import React, { useState } from "react";
import { useGetOrderList } from "@/app/queries/list/order.list.query";
import DataMapper from "@/app/components/DataMapper";
import OrderCard from "../components/OrderCard";
import EmptyState from "@/app/components/EmptyState";
import { useRouter } from "next/navigation";
import useInfoModal from "@/app/hooks/useInfoModal";
import useDeleteConfirmModal from "@/app/hooks/useDeleteConfirmModal";

const PendingTab = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  const status = 0;
  const router = useRouter();
  const { data: ordersList, isLoading } = useGetOrderList({
    pageIndex: currentPage,
    pageSize: pageSize,
    status: status,
  });
  const infoModal = useInfoModal();
  const deleteConfirmModal = useDeleteConfirmModal();

  const orders = ordersList?.data || [];

  console.log(orders);

  
  return (
    <div className="flex flex-col gap-4 pb-4">
      <DataMapper
        data={orders}
        Component={OrderCard}
        isLoading={isLoading}
        emptyStateComponent={<EmptyState title="No pending orders found" />}
        pageSize={pageSize}
        currentPage={currentPage}
        enforcePagination={true}
        getKey={(order) => order.id}
        componentProps={(order) => ({
          name: order.name,
          code: order.orderCode,
          price: order.totalPrice,
          status: order.status,
          orderDate: order.orderDate,
          isPending: order.status === 0,
          cancelClick: () =>
            deleteConfirmModal.onOpen("order", order.id, "order"),
          procceedClick: () => router.push(`/payment/${order.id}?type=order`),
          detailClick: () =>
            infoModal.onOpen({
              title: "Order Details",
              isOrder: true,
              orderCode: order.orderCode,
              orderDate: order.orderDate,
              totalPrice: order.totalPrice,
              phoneNumber: order.phone,
              email: order.email,
              address: order.address,
              buttonLabel: "Done",
            }),
        })}
      />
    </div>
  );
};

export default PendingTab;
