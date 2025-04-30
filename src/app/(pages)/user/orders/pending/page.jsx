"use client";

import React, { useState, useEffect } from "react";
import { useGetOrderList } from "@/app/queries/list/order.list.query";
import DataMapper from "@/app/components/DataMapper";
import OrderCard from "@/app/components/ui/card/OrderCard";
import EmptyState from "@/app/components/EmptyState";
import { useRouter } from "next/navigation";
import useInfoModal from "@/app/hooks/useInfoModal";
import useDeleteConfirmModal from "@/app/hooks/useDeleteConfirmModal";

const PendingTab = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [accumulatedOrders, setAccumulatedOrders] = useState([]);
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
  const totalCount = ordersList?.totalCount || 0;

  // Calculate if there are more orders to load
  const hasMoreData = accumulatedOrders.length < totalCount;

  // Update accumulated orders when new data is loaded
  useEffect(() => {
    if (orders && orders.length > 0) {
      if (currentPage === 1) {
        setAccumulatedOrders(orders);
      } else {
        setAccumulatedOrders(prev => {
          const existingIds = new Set(prev.map(item => item.id));
          const newItems = orders.filter(item => !existingIds.has(item.id));
          return [...prev, ...newItems];
        });
      }
    }
  }, [orders, currentPage]);

  // Load more function
  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  // Function to format address object to string
  const formatAddress = (addressObj) => {
    if (!addressObj) return "N/A";
    if (typeof addressObj === "string") return addressObj;

    const { detail, street, ward, district, province } = addressObj;
    const addressParts = [detail, street, ward, district, province].filter(
      Boolean
    );
    return addressParts.join(", ");
  };

  return (
    <div className="flex flex-col gap-4 pb-4">
      <DataMapper
        data={accumulatedOrders}
        Component={OrderCard}
        isLoading={isLoading}
        emptyStateComponent={<EmptyState title="No pending orders found" />}
        pageSize={pageSize}
        currentPage={currentPage}
        enforcePagination={true}
        onLoadMore={handleLoadMore}
        hasMoreData={hasMoreData}
        accumulativeMode={true}
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
              status: order.status,
              email: order.email,
              address: formatAddress(order.address),
              buttonLabel: "Close",
              items:
                order.orderDetails?.map((item) => ({
                  id: item.id,
                  productName: item.productName,
                  image: item.image,
                  quantity: item.quantity,
                  unitPrice: item.unitPrice,
                  productId: item.productId,
                })) || [],
            }),
        })}
      />
    </div>
  );
};

export default PendingTab;
