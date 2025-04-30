"use client";

import React, { useCallback, useState, useRef, useEffect } from "react";
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
import {
  Skeleton,
  Box,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import RefreshButton from "@/app/components/ui/Buttons/RefreshButton";
import { IoSearch, IoFilterOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { formatCurrency } from "@/app/helpers";

const SellerProductManage = () => {
  const router = useRouter();
  const userSlug = useSelector((state) => state.users.userSlug);
  const searchInputRef = useRef(null);
  const minPriceRef = useRef(null);
  const maxPriceRef = useRef(null);

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    sortBy: "",
    descending: false,
    productName: "",
    minPrice: "",
    maxPrice: "",
  });

  // Price range options
  const priceRanges = [
    { label: "Under 500,000₫", min: 0, max: 500000 },
    { label: "500,000₫ - 1,000,000₫", min: 500000, max: 1000000 },
    { label: "1,000,000₫ - 2,000,000₫", min: 1000000, max: 2000000 },
    { label: "2,000,000₫ - 5,000,000₫", min: 2000000, max: 5000000 },
    { label: "Over 5,000,000₫", min: 5000000, max: "" },
  ];

  // State for selected price range
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);

  // Set a reasonable max price value (default 10M VND)
  const MAX_PRICE = 10000000;

  const { data, isLoading, error, refetch } = useGetProductByProvider(
    userSlug,
    pagination
  );

  const products = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pagination.pageSize) || 1;

  // Add a client-side-only flag to prevent SSR issues
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Wait a small amount of time to ensure the client-side hydration is complete
    const timer = setTimeout(() => {
      setIsClient(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Handle price range checkbox change
  const handlePriceRangeChange = (range) => {
    // If the same range is clicked again, unselect it
    if (
      selectedPriceRange &&
      selectedPriceRange.min === range.min &&
      selectedPriceRange.max === range.max
    ) {
      setSelectedPriceRange(null);

      // Clear the min/max price inputs
      if (minPriceRef.current) minPriceRef.current.value = "";
      if (maxPriceRef.current) maxPriceRef.current.value = "";
    } else {
      setSelectedPriceRange(range);

      // Update the min/max price inputs
      if (minPriceRef.current) minPriceRef.current.value = range.min;
      if (maxPriceRef.current)
        maxPriceRef.current.value = range.max || MAX_PRICE;
    }
  };

  // Function to handle price filter
  const handlePriceFilter = () => {
    const minPrice = minPriceRef.current?.value || "";
    const maxPrice = maxPriceRef.current?.value || "";

    setPagination((prev) => ({
      ...prev,
      minPrice: minPrice,
      maxPrice: maxPrice,
      pageIndex: 1, // Reset to first page when filtering
    }));
  };

  // Function to reset all filters
  const handleResetFilters = () => {
    if (searchInputRef.current) searchInputRef.current.value = "";

    // Reset price range
    setSelectedPriceRange(null);

    // Reset the input fields explicitly
    if (minPriceRef.current) minPriceRef.current.value = "";
    if (maxPriceRef.current) maxPriceRef.current.value = "";

    setPagination((prev) => ({
      ...prev,
      productName: "",
      minPrice: "",
      maxPrice: "",
      pageIndex: 1,
    }));
  };

  const columns = [
    {
      header: "Image",
      accessorKey: "imageUrls",
      cell: ({ row }) => (
        <div className="relative w-24 h-24">
          {row.original.imageUrls?.[0] ? (
            <Image
              src={row.original.imageUrls[0]}
              alt={row.original.productName}
              fill
              className="object-cover rounded-md"
              sizes="100px"
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
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <span
          className={`${
            row.original.status === "InStock"
              ? "text-white bg-green"
              : "text-white bg-red"
          } px-2 py-1 rounded-md`}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      header: "Price",
      accessorKey: "productPrice",
      cell: ({ row }) => (
        <span className="text-primary font-bold">
          {formatCurrency(row.original.productPrice)}
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
      cell: ({ row }) => (
        <span className="flex items-center gap-1">
          {row.original.rate ? row.original.rate : 0} <FaStar />
        </span>
      ),
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
            className="bg-action text-white"
            icon={<FaEdit size={20} />}
          />
          <Button
            label="Remove"
            onClick={() => handleDeleteProduct(row.original.id)}
            className="bg-red text-white"
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
    setPagination((prev) => ({
      ...prev,
      pageIndex: newPagination.pageIndex,
      pageSize: newPagination.pageSize,
    }));
  }, []);

  // Function to handle search by product name
  const handleSearch = (event) => {
    event?.preventDefault();
    const searchValue = searchInputRef.current?.value || "";
    setPagination((prev) => ({
      ...prev,
      productName: searchValue,
      pageIndex: 1, // Reset to first page when searching
    }));
  };

  const tablePageIndex =
    pagination.pageIndex > 1 ? pagination.pageIndex - 1 : 0;

  // Filter and search component
  const FilterSelectors = () => (
    <div className="mb-6 flex flex-col gap-3 p-2 w-full">
      <div className="flex items-center gap-2">
        <div className="font-medium mr-2 flex items-center gap-2">
          <IoFilterOutline size={18} />
          Filters
        </div>

        <Button
          label="Reset Filters"
          onClick={handleResetFilters}
          className="ml-auto"
        />
      </div>

      {/* Custom price range inputs */}
      <div>
        <Typography
          variant="subtitle2"
          className="mb-2 font-medium dark:text-white"
          gutterBottom
        >
          Price Range
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <Box sx={{ flex: 2 }}>
            <TextField
              label="Min Price"
              inputRef={minPriceRef}
              type="number"
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₫</InputAdornment>
                ),
                inputProps: { min: 0 },
              }}
              className="dark:text-white bg-white"
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "50px",
            }}
          >
            <Typography>to</Typography>
          </Box>
          <Box sx={{ flex: 2 }}>
            <TextField
              label="Max Price"
              inputRef={maxPriceRef}
              type="number"
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₫</InputAdornment>
                ),
                inputProps: { min: 0 },
              }}
              className="dark:text-white bg-white"
            />
          </Box>
        </Box>
      </div>

      <Button
        label="Apply Price Filter"
        onClick={handlePriceFilter}
        className="bg-primary text-white w-fit"
      />

      {/* Product Name Search */}
      <div className="flex items-center gap-2 max-w-sm w-full">
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
            placeholder="Search by product name"
            defaultValue={pagination.productName}
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
    </div>
  );

  return (
    <SellerWrapper>
      <>
        <div className="section-1 flex flex-row justify-between items-center mb-6">
          <div className="flex gap-3 items-center">
            <Button
              onClick={() => router.push("/seller/product/create")}
              label="Start selling"
              className="bg-primary"
              icon={<MdOutlineFileUpload size={20} />}
            />
          </div>

          <RefreshButton
            onRefresh={refetch}
            isLoading={isLoading}
            tooltip="Refresh product list"
          />
        </div>

        <FilterSelectors />

        {isLoading && products.length === 0 ? (
          <>
            <Skeleton
              animation="wave"
              variant="text"
              width="100%"
              height={20}
            />
            <Skeleton
              animation="wave"
              variant="text"
              width="100%"
              height={20}
            />
            <Skeleton
              animation="wave"
              variant="text"
              width="100%"
              height={20}
            />
          </>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded">
            Error loading products: {error.message}
          </div>
        ) : products.length === 0 && !isLoading ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">No Products Found</h2>
            <p>
              {pagination.productName ||
              pagination.minPrice ||
              pagination.maxPrice
                ? "No products match your search criteria. Try adjusting your filters."
                : "You don't have any products yet. Start selling by adding your first product."}
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

export default SellerProductManage;
