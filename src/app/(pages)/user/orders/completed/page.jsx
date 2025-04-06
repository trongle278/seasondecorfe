"use client";

import React, { useState } from "react";
import { useGetOrderList } from "@/app/queries/list/order.list.query";
import DataMapper from "@/app/components/DataMapper";
import OrderCard from "../components/OrderCard";
import EmptyState from "@/app/components/EmptyState";
import { useRouter } from "next/navigation";
import useInfoModal from "@/app/hooks/useInfoModal";
import useDeleteConfirmModal from "@/app/hooks/useDeleteConfirmModal";

const CompletedTab = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const status = 1;
  const router = useRouter();
  const { data: ordersList, isLoading } = useGetOrderList({
    pageIndex: currentPage,
    pageSize: pageSize,
    status: status,
  });
  const infoModal = useInfoModal();
  const deleteConfirmModal = useDeleteConfirmModal();

  const orders = ordersList?.data || [];
  return (
    <div className="rounded-xl bg-transparent p-3">
      <DataMapper
        data={orders}
        Component={OrderCard}
        isLoading={isLoading}
        emptyStateComponent={<EmptyState title="No completed orders found" />}
        getKey={(order) => order.id}
        pageSize={pageSize}
        currentPage={currentPage}
        enforcePagination={true}
        componentProps={(order) => ({
          name: order.name,
          code: order.orderCode,
          price: order.totalPrice,
          status: order.status,
          orderDate: order.orderDate,
          isPending: order.status === 0,
          cancelClick: () =>
            deleteConfirmModal.onOpen("order", order.id, "order"),
          procceedClick: () => router.push(`/payment/${order.id}`),
          detailClick: () =>
            infoModal.onOpen({
              title: "Order Details",
              isOrder: true,
              orderCode: order.orderCode,
              orderDate: order.orderDate,
              totalPrice: order.totalPrice, 
              phoneNumber: order.phone,
              status: order.status,
              email: order.email,
              address: order.address,
            }),
        })}
      />
    </div>
  );
};

export default CompletedTab;
