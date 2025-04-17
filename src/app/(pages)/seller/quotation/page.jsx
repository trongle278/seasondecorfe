"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import SellerWrapper from "../components/SellerWrapper";
import DataTable from "@/app/components/ui/table/DataTable";
import { useGetListQuotationForProvider } from "@/app/queries/list/quotation";
import { useRouter } from "next/navigation";
import {
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Button from "@/app/components/ui/Buttons/Button";
import { FaFilePdf } from "react-icons/fa6";
import StatusChip from "@/app/components/ui/statusChip/StatusChip";
import { IoIosArrowForward } from "react-icons/io";
import { IoFilterOutline } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";

const QuotationPage = () => {
  const router = useRouter();
  const searchInputRef = useRef(null);
  const [filters, setFilters] = useState({
    status: "",
    quotationCode: "",
  });

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    status: "",
    quotationCode: "",
  });

  // Update pagination when filters change
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      status: filters.status,
      quotationCode: filters.quotationCode,
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
    handleFilterChange("quotationCode", searchValue);
  };

  // Status options for the filter
  const statusOptions = [
    { id: "", name: "All" },
    { id: "0", name: "Pending" },
    { id: "1", name: "Confirmed" },
    { id: "2", name: "Rejected" },
  ];

  const {
    data: quotationsData,
    isLoading,
    error,
  } = useGetListQuotationForProvider(pagination);

  const quotations = quotationsData?.data || [];
  const totalCount = quotationsData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pagination.pageSize) || 1;

  const tablePageIndex =
    pagination.pageIndex > 1 ? pagination.pageIndex - 1 : 0;

  const columns = [
    {
      header: "ID",
      accessorKey: "id",
      cell: ({ row }) => <span className="font-bold">{row.original.id}</span>,
    },
    {
      header: "Quotation Code",
      accessorKey: "quotationCode",
      cell: ({ row }) => (
        <span className="font-bold">{row.original.quotationCode}</span>
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
      header: "File",
      accessorKey: "filePath",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <FaFilePdf size={20} />
          <span
            className="text-primary cursor-pointer hover:underline"
            onClick={() => window.open(row.original.filePath, "_blank")}
          >
            {row.original.filePath}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      cell: ({ row }) => (
        <StatusChip status={row.original.status} isQuotation={true} />
      ),
    },
    {
      header: "Action",
      cell: ({ row }) =>
        row.original.status === 3 ? (
          <Button
            label="Remove"
            onClick={() => removeQuotation(row.original.id)}
            className="bg-red"
          />
        ) : row.original.status === 0 ? (
          <div>No action</div>
        ) : row.original.isContractExisted ? (
          <button
            onClick={() =>
              router.push(
                `/seller/contract/create/contract?quotationCode=${row.original.quotationCode}`
              )
            }
            className="flex items-center gap-2 py-2 rounded-md hover:translate-x-2 transition-all duration-300"
          >
            <IoIosArrowForward size={20} />
            View Contract
          </button>
        ) : (
          <button
            onClick={() =>
              router.push(
                `/seller/contract/create/contract?quotationCode=${row.original.quotationCode}`
              )
            }
            className="flex items-center gap-2 py-2 rounded-md hover:translate-x-2 transition-all duration-300"
          >
            <IoIosArrowForward size={20} />
            Create Contract
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
    <div className="mb-6 flex items-center gap-5 p-2 w-full">
      <div className="font-medium mr-2 flex items-center gap-2">
        <IoFilterOutline size={18} />
        Filters
      </div>

      <FormControl
        variant="outlined"
        size="small"
        className="w-full max-w-[200px] dark:text-white"
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

      <div className="flex items-center gap-2 max-w-[350px] w-full">
        <form
          className="flex items-center w-full"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <input
            ref={searchInputRef}
            type="text"
            className="w-full px-3 py-2 border rounded-l-md focus:outline-none bg-white dark:bg-gray-700 dark:text-white"
            placeholder="Enter quotation code"
            defaultValue={filters.quotationCode}
            autoComplete="off"
          />
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-r-md shrink-0 border border-primary"
          >
            <IoSearch size={20} />
            Search
          </button>
        </form>
      </div>

      <Button
        label="Reset Filters"
        onClick={() => {
          setFilters({
            status: "",
            quotationCode: "",
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
      <h1 className="text-2xl font-bold mb-6">Quotation Management</h1>

      <FilterSelectors />

      {isLoading && quotations.length === 0 ? (
        <Skeleton animation="wave" variant="text" width="100%" height={40} />
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">
          Error loading quotations: {error.message}
        </div>
      ) : quotations.length === 0 && !isLoading ? (
        <div className="">
          <h2 className="text-xl font-semibold mb-4">No Quotations Found</h2>
          <p>
            {filters.status || filters.quotationCode
              ? "No quotations match your filter criteria. Try adjusting your filters."
              : "You don't have any quotations at the moment."}
          </p>
        </div>
      ) : (
        <DataTable
          data={quotations}
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

export default QuotationPage;
