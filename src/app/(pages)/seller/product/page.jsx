"use client";

import * as React from "react";
import SellerWrapper from "../components/SellerWrapper";
import Button from "@/app/components/ui/Buttons/Button";
import { useRouter } from "next/navigation";
import { useGetProductByProvider } from "@/app/queries/list/product.list.query";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import DataTable from "@/app/components/ui/table/DataTable";
import { MdOutlineFileUpload } from "react-icons/md";
import Image from "next/image";
import { Skeleton } from "@mui/material";

const SellerProductManage = () => {
  const router = useRouter();
  const userSlug = useSelector((state) => state.users.userSlug);

  const [pagination, setPagination] = React.useState({
    pageIndex: 1,
    pageSize: 10,
    sortBy: "",
    descending: false,
    productName: "",
    minPrice: "",
    maxPrice: "",
  });

  const { data, isLoading, error, refetch } = useGetProductByProvider(
    userSlug,
    pagination
  );

  const products = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pagination.pageSize) || 1;


  const columns = [
    {
      header: "Image",
      accessorKey: "imageUrls",
      cell: ({ row }) => (
        <div className="relative w-16 h-16">
          {row.original.imageUrls?.[0] ? (
            <Image
              src={row.original.imageUrls[0]}
              alt={row.original.productName}
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
      header: "Product Name",
      accessorKey: "productName",
    },
    {
      header: "Price",
      accessorKey: "productPrice",
      cell: ({ row }) => (
        <span>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(row.original.productPrice)}
        </span>
      ),
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
    },
    {
      header: "Total Sold",
      accessorKey: "totalSold",
    },
    {
      header: "Rating",
      accessorKey: "rating",
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            label="Modify"
            onClick={() =>
              router.push(`/seller/product/edit/${row.original.id}`)
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

  const handleDeleteProduct = React.useCallback((productId) => {
    // Implement delete functionality here
    console.log("Delete product:", productId);
  }, []);

  const handlePaginationChange = React.useCallback((newPagination) => {
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

  const handleSortingChange = React.useCallback((sorting) => {
    console.log("Sorting changed:", sorting);
    if (sorting.length > 0) {
      setPagination((prev) => ({
        ...prev,
        sortBy: sorting[0].id,
        descending: sorting[0].desc,
      }));
    } else {
      setPagination((prev) => ({
        ...prev,
        sortBy: "",
        descending: false,
      }));
    }
  }, []);

  // Function to handle search by product name
  const handleSearch = React.useCallback((productName) => {
    setPagination((prev) => ({
      ...prev,
      productName,
      pageIndex: 1, // Reset to first page when searching
    }));
  }, []);

  // Function to handle price filter
  const handlePriceFilter = React.useCallback((minPrice, maxPrice) => {
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
        <div className="section-1 flex flex-row gap-3 items-center mb-6">
          <Button
            onClick={() => router.push("/seller/product/create")}
            label="Start selling"
            className="bg-primary"
            icon={<MdOutlineFileUpload size={20} />}
          />
        </div>

        {isLoading && products.length === 0 ? (
          <Skeleton animation="wave" variant="text" width="100%" height={40} />
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded">
            Error loading products: {error.message}
          </div>
        ) : products.length === 0 && !isLoading ? (
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">No Products Found</h2>
            <p>
              You don't have any products yet. Start selling by adding your
              first product.
            </p>
          </div>
        ) : (
          <DataTable
            data={products}
            columns={columns}
            isLoading={isLoading}
            showPagination={true}
            pageSize={pagination.pageSize}
            initialPageIndex={tablePageIndex}
            manualPagination={true}
            pageCount={totalPages}
            onPaginationChange={handlePaginationChange}
            onSortingChange={handleSortingChange}
            totalCount={totalCount}
          />
        )}
      </>
    </SellerWrapper>
  );
};

export default SellerProductManage;
