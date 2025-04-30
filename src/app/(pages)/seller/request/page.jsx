"use client";

import React, { useCallback, useState, useEffect } from "react";
import SellerWrapper from "../components/SellerWrapper";
import { useGetPaginatedBookingsForProvider } from "@/app/queries/list/booking.list.query";
import DataTable from "@/app/components/ui/table/DataTable";
import {
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import StatusChip from "@/app/components/ui/statusChip/StatusChip";
import { FaCheck } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import Button from "@/app/components/ui/Buttons/Button";
import { IoEyeOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useRejectBooking } from "@/app/queries/book/book.query";
import Avatar from "@/app/components/ui/Avatar/Avatar";
import { useApproveBooking } from "@/app/queries/book/book.query";
import { TbReportAnalytics } from "react-icons/tb";
import { useChangeBookingStatus } from "@/app/queries/book/book.query";
import { MdOutlineEditNote } from "react-icons/md";
import { FootTypo } from "@/app/components/ui/Typography";
import { IoFilterOutline } from "react-icons/io5";
import { GoQuestion } from "react-icons/go";
import { LuClipboardList } from "react-icons/lu";
import { FaTruck } from "react-icons/fa";
import { IoBuild } from "react-icons/io5";
import { MdOutlineFileUpload } from "react-icons/md";
import RefreshButton from "@/app/components/ui/Buttons/RefreshButton";

const SellerOrderManage = () => {
  const router = useRouter();
  const { mutate: rejectBooking, isPending: isRejecting } = useRejectBooking();
  const { mutate: approveBooking, isPending: isApproving } =
    useApproveBooking();

  const { mutate: changeBookingStatus, isPending: isChangingStatus } =
    useChangeBookingStatus();

  const [filters, setFilters] = useState({
    status: "",
  });

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    status: "",
    descending: true,
  });

  // Update pagination when filters change
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      status: filters.status,
    }));
  }, [filters]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const { data: bookingsData, isLoading, refetch } =
    useGetPaginatedBookingsForProvider(pagination);

  const bookings = bookingsData?.data || [];
  const totalCount = bookingsData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pagination.pageSize) || 1;

  // Status options for the filter
  const statusOptions = [
    { id: "", name: "All" },
    { id: "0", name: "Pending" },
    { id: "1", name: "Planning" },
    { id: "2", name: "Quoting" },
    { id: "3", name: "Contracting" },
    { id: "4", name: "Confirmed" },
    { id: "5", name: "Deposite Paid" },
    { id: "6", name: "Preparing" },
    { id: "7", name: "In Transit" },
    { id: "8", name: "Progressing" },
    { id: "9", name: "All Done" },
    { id: "10", name: "Final Paid" },
    { id: "11", name: "Completed" },
    { id: "12", name: "Pending Cancel" },
    { id: "13", name: "Cancelled" },
    { id: "14", name: "Rejected" },
  ];

  // Create a dedicated component for action buttons with clear status-based logic
  const ActionButtons = ({ booking }) => {
    const status = booking.status;
    const { bookingCode, customer, isQuoteExisted, isTracked, address } = booking;

    // Helper function for routing to quotation creation
    const navigateToQuotation = () => {
      router.push(
        `/seller/quotation/create/${bookingCode}?fullName=${encodeURIComponent(
          customer.fullName || customer.businessName
        )}&email=${encodeURIComponent(customer.email)}&address=${encodeURIComponent(address)}`
      );
    };
    if (status === 11) {
      return (
        <FootTypo footlabel="Completed" className="text-green font-medium" />
      );
    }

    // Pending Cancel status
    if (status === 12) {
      return (
        <Button
          label="Preview request"
          onClick={() => router.push(`/seller/request/${bookingCode}`)}
          className="bg-primary"
          icon={<GoQuestion size={20} />}
          isLoading={isChangingStatus}
        />
      );
    }

    // Pending Approval status (new booking)
    if (status === 0) {
      return (
        <div className="flex gap-2">
          <Button
            label="Approved"
            onClick={() => approveBooking(bookingCode)}
            className="bg-green text-white"
            icon={<FaCheck size={20} />}
            isLoading={isApproving}
          />
          <Button
            label="Reject"
            onClick={() => rejectBooking(bookingCode)}
            className="bg-red text-white"
            icon={<MdCancel size={20} />}
            isLoading={isRejecting}
          />
        </div>
      );
    }

    // Planning status - Create quotation
    if (status === 1) {
      return (
        <Button
          label="Create Quotation"
          onClick={() => {
            changeBookingStatus(bookingCode, {
              onSuccess: navigateToQuotation,
            });
          }}
          className="bg-yellow"
          icon={<TbReportAnalytics size={20} />}
          isLoading={isChangingStatus}
        />
      );
    }

    // Quoting status - Edit quotation
    if (status === 2 && !isQuoteExisted) {
      return (
        <Button
          label="Edit Quotation"
          onClick={navigateToQuotation}
          className="bg-yellow"
          icon={<MdOutlineEditNote size={20} />}
          isLoading={isChangingStatus}
        />
      );
    }

    // Contracting status with quote
    if (status === 3 && isQuoteExisted) {
      return (
        <FootTypo
          footlabel="Preparing Contract"
          className="!m-0 text-green font-medium"
        />
      );
    }

    if (status === 4) {
      return (
        <FootTypo
          footlabel="Confirmed"
          className="!m-0 text-green font-medium"
        />
      );
    }

    // Deposit paid status
    if (status === 5) {
      return (
        <Button
          label="Preparing"
          className="bg-primary"
          onClick={() => changeBookingStatus(bookingCode, {})}
          icon={<LuClipboardList size={20} />}
        />
      );
    }

    if (status === 6) {
      return (
        <Button
          label="In transit"
          className="bg-primary"
          onClick={() => changeBookingStatus(bookingCode, {})}
          icon={<FaTruck size={20} />}
        />
      );
    }
    if (status === 7) {
      return (
        <Button
          label="Progress Start"
          className="bg-primary"
          onClick={() => changeBookingStatus(bookingCode, {})}
          icon={<IoBuild size={20} />}
        />
      );
    }

    if (status === 9) {
      return (
        <FootTypo
          footlabel="Waiting for final payment"
          className="text-yellow font-medium"
        />
      );
    }

    if (status === 10) {
      return (
        <Button
          label="Finish service"
          onClick={() => changeBookingStatus(bookingCode, {})}
          s
          className="bg-action text-white"
          icon={<FaCheck size={20} />}
        />
      );
    }

    if (isTracked) {
      return (
        <Button
          label="Update Progress"
          className="bg-primary"
          onClick={() => router.push(`/seller/tracking/${bookingCode}`)}
          icon={<MdOutlineFileUpload size={20} />}
        />
      );
    }

    if (status === 8) {
      return (
        <Button
          label="Progress Tracking"
          className=""
          onClick={() => router.push(`/seller/tracking/${bookingCode}`)}
          icon={<MdOutlineFileUpload size={20} />}
        />
      );
    }
    

    // Cancelled status
    if (status === 12) {
      return (
        <FootTypo footlabel="Cancelled" className="!m-0 text-red font-medium" />
      );
    }

    // Quote exists but not yet confirmed
    if (isQuoteExisted) {
      return (
        <FootTypo
          footlabel="Confirmation pending"
          className="!m-0 text-yellow font-medium"
        />
      );
    }

    // Default - No specific action
    return (
      <FootTypo footlabel="No action required" className="!m-0 text-gray-500" />
    );
  };

  // Update the columns definition to use the ActionButtons component
  const columns = [
    {
      header: "ID",
      accessorKey: "id",
      cell: ({ row }) => (
        <span className="font-bold">{row.original.bookingId}</span>
      ),
    },
    {
      header: "Code",
      accessorKey: "Code",
      cell: ({ row }) => (
        <span className="font-bold">{row.original.bookingCode}</span>
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
      cell: ({ row }) => (
        <StatusChip status={row.original.status} isBooking={true} />
      ),
    },
    {
      header: "From",
      accessorKey: "from",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar
            userImg={row.original.customer.avatar}
            alt={row.original.customer.businessName}
            w={40}
            h={40}
          />
          <span>{row.original.customer.email}</span>
        </div>
      ),
    },

    {
      header: "Actions",
      cell: ({ row }) => <ActionButtons booking={row.original} />,
    },
    {
      header: "Detail",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() =>
              router.push(`/seller/request/${row.original.bookingCode}`)
            }
            className="inline-flex items-center gap-2 underline"
          >
            <IoEyeOutline size={20} />
            View
          </button>
        </div>
      ),
    },
  ];

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

  // Filter selection component
  const FilterSelectors = () => (
    <div className="mb-6 flex items-center gap-5 p-2 w-full">
      <div className="font-medium mr-2 flex items-center gap-2">
        <IoFilterOutline size={18} />
        Filters
      </div>

      <FormControl
        variant="outlined"
        size="small"
        className="w-full max-w-[250px] dark:text-white"
      >
        <InputLabel id="status-label" className="dark:text-white">
          Status
        </InputLabel>
        <Select
          MenuProps={{
            disableScrollLock: true,
          }}
          labelId="status-label"
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          label="Status"
          className="bg-white dark:bg-gray-700 dark:text-white"
        >
          {statusOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        label="Reset Filter"
        onClick={() =>
          setFilters({
            status: "",
          })
        }
        className="ml-auto"
      />
    </div>
  );

  return (
    <SellerWrapper>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Request Management</h1>
        <RefreshButton 
          onRefresh={refetch} 
          isLoading={isLoading}
          tooltip="Refresh request list"
        />
      </div>

      <FilterSelectors />

      {isLoading && bookings.length === 0 ? (
        <>
          <Skeleton animation="wave" width="100%" />
          <Skeleton animation="wave" variant="text" width="100%" />
          <Skeleton animation="wave" variant="text" width="100%" />
        </>
      ) : bookings.length === 0 && !isLoading ? (
        <div className="">
          <h2 className="text-xl font-semibold mb-4">No Orders Found</h2>
          <p>
            {filters.status
              ? "No requests match your filter criteria. Try adjusting your filters."
              : "You don't have any requests at the moment."}
          </p>
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
