"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import SellerWrapper from "../components/SellerWrapper";
import DataTable from "@/app/components/ui/table/DataTable";
import { useGetPaginatedProviderTransactions } from "@/app/queries/dashboard/dashboard.provider.query";
import { useRouter } from "next/navigation";
import {
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Button from "@/app/components/ui/Buttons/Button";
import { FaMoneyBillWave } from "react-icons/fa";
import StatusChip from "@/app/components/ui/statusChip/StatusChip";
import { IoIosArrowForward } from "react-icons/io";
import { IoFilterOutline } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { formatCurrency, formatDateTime } from "@/app/helpers";
import { FootTypo } from "@/app/components/ui/Typography";
import Chip from "@mui/material/Chip";
import { BsClock } from "react-icons/bs";

const TransactionPage = () => {
  const router = useRouter();
  const searchInputRef = useRef(null);
  const [filters, setFilters] = useState({
    status: "",
    transactionCode: "",
    type: "",
  });

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    status: "",
    transactionCode: "",
    type: "",
    descending: true,
  });

  // Update pagination when filters change
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      status: filters.status,
      transactionCode: filters.transactionCode,
      type: filters.type,
    }));
  }, [filters]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleSearch = () => {
    const searchValue = searchInputRef.current?.value || "";
    handleFilterChange("transactionCode", searchValue);
  };

  // Status options for the filter
  const statusOptions = [
    { id: "", name: "All Status" },
    { id: "0", name: "Pending" },
    { id: "1", name: "Completed" },
    { id: "2", name: "Failed" },
    { id: "3", name: "Refunded" },
  ];

  // Transaction type options
  const typeOptions = [
    { id: "", name: "All Types" },
    { id: "2", name: "Deposite Money" },
    { id: "4", name: "Final Payment" },
    { id: "6", name: "Order Payment" },
  ];

  const {
    data: transactionsData,
    isLoading,
    error,
  } = useGetPaginatedProviderTransactions(pagination);

  const transactions = transactionsData?.data || [];
  const totalCount = transactionsData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pagination.pageSize) || 1;

  const tablePageIndex =
    pagination.pageIndex > 1 ? pagination.pageIndex - 1 : 0;

  const columns = [
    {
      header: "ID",
      accessorKey: "transactionId",
      cell: ({ row }) => (
        <span className="font-bold">{row.original.transactionId}</span>
      ),
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: ({ row }) => {
        const dateTime = formatDateTime(row.original.transactionDate);
        return (
          <div className="flex flex-col">
            <span className="font-medium">{dateTime.date}</span>
            <span className="text-xs text-gray-500 inline-flex items-center gap-1">
              <BsClock /> {dateTime.time}
            </span>
          </div>
        );
      },
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: ({ row }) => (
        <FootTypo
          footlabel={`+ ${formatCurrency(row.original.amount)}`}
          className="!m-0 font-semibold text-green"
        />
      ),
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: ({ row }) => {
        const type = row.original.transactionType;
        const typeColors = [
          "text-green-600",
          "text-red-600",
          "text-orange-500",
        ];

        return (
          <div className={`flex items-center gap-2 ${typeColors[type] || ""}`}>
            <FaMoneyBillWave size={16} />
            <span>{[type] || "Unknown"}</span>
          </div>
        );
      },
    },
    {
      header: "From",
      accessorKey: "senderEmail",
      cell: ({ row }) => (
        <div className="max-w-xs truncate">{row.original.senderEmail}</div>
      ),
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <button
          onClick={() => router.push(`/seller/transaction/${row.original.id}`)}
          className="flex items-center gap-2 py-2 rounded-md hover:translate-x-2 transition-all duration-300"
        >
          <IoIosArrowForward size={20} />
          Details
        </button>
      ),
    },
  ];

  const handlePaginationChange = useCallback((newPagination) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: newPagination.pageIndex,
      pageSize: newPagination.pageSize,
    }));
  }, []);

  // Filter and search component
  const FilterSelectors = () => (
    <div className="mb-6 flex flex-wrap items-center gap-5 p-2 w-full">
      <div className="font-medium mr-2 flex items-center gap-2">
        <IoFilterOutline size={18} />
        Filters
      </div>

      <FormControl
        variant="outlined"
        size="small"
        className="w-full max-w-[150px] dark:text-white"
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

      <FormControl
        variant="outlined"
        size="small"
        className="w-full max-w-[150px] dark:text-white"
      >
        <InputLabel id="type-label" className="dark:text-white">
          Type
        </InputLabel>
        <Select
          MenuProps={{
            disableScrollLock: true,
          }}
          labelId="type-label"
          value={filters.type}
          onChange={(e) => handleFilterChange("type", e.target.value)}
          label="Type"
          className="bg-white dark:bg-gray-700 dark:text-white"
        >
          {typeOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        label="Reset Filters"
        onClick={() => {
          setFilters({
            status: "",
            transactionCode: "",
            type: "",
          });
          if (searchInputRef.current) {
            searchInputRef.current.value = "";
          }
        }}
        className="ml-auto"
      />
    </div>
  );

  return (
    <SellerWrapper>
      <h1 className="text-2xl font-bold mb-6">Transaction History</h1>

      <FilterSelectors />

      {isLoading && transactions.length === 0 ? (
        <>
          <Skeleton animation="wave" variant="text" width="100%" height={20} />
          <Skeleton animation="wave" variant="text" width="100%" height={20} />
          <Skeleton animation="wave" variant="text" width="100%" height={20} />
        </>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">
          Error loading transactions: {error.message}
        </div>
      ) : transactions.length === 0 && !isLoading ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
          <FaMoneyBillWave size={40} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-4">No Transactions Found</h2>
          <p className="text-gray-600 dark:text-gray-300">
            {filters.status || filters.transactionCode || filters.type
              ? "No transactions match your filter criteria. Try adjusting your filters."
              : "You don't have any transactions at the moment."}
          </p>
        </div>
      ) : (
        <div className="mb-6 flex items-center gap-5 p-2 w-full">
          <DataTable
            data={transactions}
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
        </div>
      )}
    </SellerWrapper>
  );
};

export default TransactionPage;
