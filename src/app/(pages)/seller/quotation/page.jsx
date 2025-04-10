"use client";

import React, { useState, useCallback } from "react";
import SellerWrapper from "../components/SellerWrapper";
import DataTable from "@/app/components/ui/table/DataTable";
import { useGetListQuotationForProvider } from "@/app/queries/list/quotation";
import { useRouter } from "next/navigation";
import { Skeleton } from "@mui/material";
import Button from "@/app/components/ui/Buttons/Button";
import { FaFilePdf } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import StatusChip from "@/app/components/ui/statusChip/StatusChip";
import { IoIosArrowForward } from "react-icons/io";

const QuotationPage = () => {
  const router = useRouter();
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
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
        ) : (
          <button
            onClick={() =>
              router.push(`/seller/contract/create/contract?quotationCode=${row.original.quotationCode}`)
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

  return (
    <SellerWrapper>
      <h1 className="text-2xl font-bold mb-6">Quotation Management</h1>
      {isLoading && quotations.length === 0 ? (
        <Skeleton animation="wave" variant="text" width="100%" height={40} />
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">
          Error loading quotations: {error.message}
        </div>
      ) : quotations.length === 0 && !isLoading ? (
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">No Quotations Found</h2>
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
