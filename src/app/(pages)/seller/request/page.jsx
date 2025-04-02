"use client";

import React, { useCallback, useState } from "react";
import SellerWrapper from "../components/SellerWrapper";
import { useGetPaginatedBookingsForProvider } from "@/app/queries/list/booking.list.query";
import DataTable from "@/app/components/ui/table/DataTable";
import { Skeleton } from "@mui/material";
import StatusChip from "@/app/components/ui/statusChip/StatusChip";
import { FaCheck } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import Button from "@/app/components/ui/Buttons/Button";
import { IoEyeOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useRejectBooking } from "@/app/queries/book/book.query";
import Avatar from "@/app/components/ui/Avatar/Avatar";

const SellerOrderManage = () => {
  const router = useRouter();
  const { mutate: rejectBooking } = useRejectBooking();
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    sortBy: "",
    descending: false,
    productName: "",
    minPrice: "",
    maxPrice: "",
  });

  const { data: bookingsData, isLoading } =
    useGetPaginatedBookingsForProvider(pagination);

  const bookings = bookingsData?.data || [];
  const totalCount = bookingsData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pagination.pageSize) || 1;

  const columns = [
    {
      header: "ID",
      accessorKey: "id",
      cell: ({ row }) => (
        <span className="font-bold">
          {row.original.bookingId}
        </span>
      ),
    },
    {
      header: "Code",
      accessorKey: "Code",
      cell: ({ row }) => (
        <span className="font-bold">
          {row.original.bookingCode}
        </span>
      ),
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ row }) => (
        <span>
          {new Date(row.original.createdAt).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => <StatusChip status={row.original.status} />,
    },
    {header: "From",
      accessorKey: "from",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar userImg={row.original.customer.avatar} alt={row.original.customer.businessName} w={40} h={40} />
          <span>{row.original.customer.email}</span>
        </div>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            label="Approved"
            onClick={() => handleAcceptOrder(row.original.id)}
            className="bg-green"
            icon={<FaCheck size={20} />}
          />
          <Button
            label="Reject"
            onClick={() => rejectBooking(row.original.bookingId)}
            className="bg-red"
            icon={<MdCancel size={20} />}
          />
        </div>
      ),  
    },
    {
      header: "Detail",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/seller/request/${row.original.bookingId}`)}
            className="inline-flex items-center gap-2 underline"
          >
            <IoEyeOutline size={20} />
            View
          </button>
        </div>
      ),
    },
  ];

  const handleAcceptOrder = useCallback((orderId) => {
    // Implement accept order functionality here
    console.log("Accept order:", orderId);
  }, []);

  const handleCancelOrder = useCallback((orderId) => {
    // Implement cancel order functionality here
    console.log("Cancel order:", orderId);
  }, []);

  const handlePaginationChange = useCallback((newPagination) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: newPagination.pageIndex,
      pageSize: newPagination.pageSize,
    }));
  }, []);

  const tablePageIndex =
    pagination.pageIndex > 1 ? pagination.pageIndex - 1 : 0;

  return (
    <SellerWrapper>
      <h1 className="text-2xl font-bold mb-6">Request Management</h1>

      {isLoading && bookings.length === 0 ? (
        <Skeleton animation="wave" variant="text" width="100%" height={40} />
      ) : bookings.length === 0 && !isLoading ? (
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">No Orders Found</h2>
          <p>You don't have any orders at the moment.</p>
        </div>
      ) : (
        <DataTable
          data={bookings}
          columns={columns}
          isLoading={isLoading}
          showPagination={true}
          pageSize={pagination.pageSize}
          initialPageIndex={tablePageIndex}
          manualPagination={true}
          manualSorting={false}
          pageCount={totalPages}
          onPaginationChange={handlePaginationChange}
          totalCount={totalCount}
        />
      )}
    </SellerWrapper>
  );
};

export default SellerOrderManage;
