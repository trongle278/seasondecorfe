"use client";

import React, { useState, useCallback } from "react";
import SellerWrapper from "../components/SellerWrapper";
import Button from "@/app/components/ui/Buttons/Button";
import { useRouter } from "next/navigation";
import { MdOutlineFileUpload } from "react-icons/md";
import { useGetDecorServiceListByProvider } from "@/app/queries/list/service.list.query";
import { Skeleton } from "@mui/material";
import Image from "next/image";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import DataTable from "@/app/components/ui/table/DataTable";
import { formatDate } from "@/app/helpers";
import StatusChip from "@/app/components/ui/statusChip/StatusChip";


const SellerServiceManage = () => {
  const router = useRouter();
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    subLocation: "",
    decorCategory: "",
    sortBy: "",
    descending: false,
    productName: "",
    minPrice: "",
    maxPrice: "",
  });

  const { data, isLoading, error, refetch } = useGetDecorServiceListByProvider(
    pagination
  );

  const services = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pagination.pageSize) || 1;


  const columns = [
    {
      header: "Image",
      accessorKey: "imageUrls",
      cell: ({ row }) => (
        <div className="relative w-16 h-16">
          {row.original.images && row.original.images.length > 0 ? (
            <Image
              src={row.original.images[0].imageURL}
              alt={row.original.style || "Service image"}
              fill
              className="object-cover rounded-md"
              sizes="64px"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
              <span className="text-gray-400 text-xs">No image</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Service Name",
      accessorKey: "style",

    },
    {
      header: "Created At",
      accessorKey: "createAt",
      cell: ({ row }) => formatDate(row.original.createAt),
    },
    {
      header: "Start Date",
      accessorKey: "startDate",
      cell: ({ row }) => formatDate(row.original.startDate),
    },
    {
      header: "Favorite Count",
      accessorKey: "favoriteCount",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => <StatusChip status={row.original.status} isService={true} />,
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            label="Modify"
            onClick={() =>
              router.push(`/seller/product/update?id=${row.original.id}`)
            }
            className="p-2 bg-primary"
            icon={<FaEdit size={20} />}
          />
          <Button
            label="Delete"
            onClick={() => handleDeleteProduct(row.original.id)}
            className="p-2 bg-red"
            icon={<MdDelete size={20} />}
          />
        </div>
      ),
    },
  ];

  const handleDeleteProduct = useCallback((productId) => {
    // Implement delete functionality here
    console.log("Delete product:", productId);
  }, []);

  const handlePaginationChange = useCallback((newPagination) => {
    console.log("Pagination changed from DataTable:", newPagination);

    setPagination((prev) => {
      const updated = {
        ...prev,
        pageIndex: newPagination.pageIndex,
        pageSize: newPagination.pageSize,
      };
      console.log("Updated pagination state:", updated);
      return updated;
    });
  }, []);

  // Function to handle search by product name
  const handleSearch = useCallback((productName) => {
    setPagination((prev) => ({
      ...prev,
      productName,
      pageIndex: 1, // Reset to first page when searching
    }));
  }, []);

  // Function to handle price filter
  const handlePriceFilter = useCallback((minPrice, maxPrice) => {
    setPagination((prev) => ({
      ...prev,
      minPrice,
      maxPrice,
      pageIndex: 1, // Reset to first page when filtering
    }));
  }, []);

  const tablePageIndex =
    pagination.pageIndex > 1 ? pagination.pageIndex - 1 : 0;

  // Manual page navigation for testing
  const manualPageChange = (newPageIndex) => {
    console.log("Manual page change to:", newPageIndex);
    setPagination((prev) => ({
      ...prev,
      pageIndex: newPageIndex,
    }));
  };

  return (
    <SellerWrapper>
      <>
        <div className="section-1 flex flex-row gap-3 items-center">
          <Button
            onClick={() => router.push("/seller/service/create")}
            label="Create new service"
            className="bg-primary"
            icon={<MdOutlineFileUpload size={20} />}
          />
        </div>
        {isLoading && services.length === 0 ? (
          <Skeleton animation="wave" variant="text" width="100%" height={40} />
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded">
            Error loading products: {error.message}
          </div>
        ) : services.length === 0 && !isLoading ? (
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">No Products Found</h2>
            <p>
              You don't have any products yet. Start selling by adding your
              first product.
            </p>
          </div>
        ) : (
          <DataTable
            data={services}
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
      </>
    </SellerWrapper>
  );
};

export default SellerServiceManage;
