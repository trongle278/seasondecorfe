"use client";

import { useGetOrderList } from "@/app/queries/list/order.list.query";
import EmptyState from "@/app/components/EmptyState";
import OrderCard from "../components/OrderCard";
import DataMapper from "@/app/components/DataMapper";
import useInfoModal from "@/app/hooks/useInfoModal";
import useDeleteConfirmModal from "@/app/hooks/useDeleteConfirmModal";
import { useRouter } from "next/navigation";

const AllTabs = () => {
  const router = useRouter();
  const { data: ordersList, isLoading } = useGetOrderList();
  const infoModal = useInfoModal();
  const deleteConfirmModal = useDeleteConfirmModal();
  return (
    <div className="flex flex-col gap-4 pb-4">
      <DataMapper
        data={ordersList}
        Component={OrderCard}
        isLoading={isLoading}
        emptyStateComponent={<EmptyState title="No orders found" />}
        getKey={(order) => order.id}
        componentProps={(order) => ({
          name: order.name,
          code: order.orderCode,
          price: order.totalPrice,
          status: order.status,
          orderDate: order.orderDate,
          isPending: order.status === 0,
          cancelClick: () => deleteConfirmModal.onOpen('order', order.id, 'order'),
          procceedClick: () => router.push(`/payment/${order.id}`),
          detailClick: () =>
            infoModal.onOpen({
              title: "Order Details",
              isOrder: true,
              orderCode: order.orderCode,
              phoneNumber: order.phone,
              address: order.address,
              orderDate: order.orderDate,
              totalPrice: order.totalPrice,
              status: order.status,
            }),
        })}
      />
    </div>
  );
};

export default AllTabs;
