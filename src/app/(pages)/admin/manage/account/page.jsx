"use client";

import React, { useState, useCallback, useEffect } from "react";
import AdminWrapper from "../../components/AdminWrapper";
import { useGetListAccount } from "@/app/queries/list/account.list.query";
import DataTable from "@/app/components/ui/table/DataTable";
import Button from "@/app/components/ui/Buttons/Button";
import { IoPersonRemoveSharp } from "react-icons/io5";
import { Skeleton } from "@mui/material";
import RoleChip from "../../components/RoleChip";
import Avatar from "@/app/components/ui/Avatar/Avatar";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { IoFilterOutline } from "react-icons/io5";

const ManageAccount = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    sortBy: "",
    descending: false,
    status: "",
    gender: "",
    isVerified: "",
    isDisabled: "",
  });

  const [filters, setFilters] = useState({
    status: 0,
    gender: "",
    isVerified: "",
    isDisabled: "",
  });

  const { data: accountList, isLoading, error } = useGetListAccount(pagination);

  // Update pagination when filters change
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      gender: filters.gender,
      isVerified: filters.isVerified,
      isDisabled: filters.isDisabled,
      status: filters.status,
    }));
  }, [filters]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const filterOptions = [
    {
      label: "Gender",
      type: "boolean",
      options: [
        { id: "", name: "All" },
        { id: "true", name: "Male" },
        { id: "false", name: "Female" },
      ],
      onChange: (value) => handleFilterChange("gender", value),
      value: filters.gender,
    },
    {
      label: "Is Disabled",
      type: "boolean",
      options: [
        { id: "true", name: "Disabled" },
        { id: "false", name: "Active" },
      ],
      onChange: (value) => handleFilterChange("isDisabled", value),
      value: filters.isDisabled,
    },
  ];

  const data = accountList?.data || [];
  const totalCount = accountList?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pagination.pageSize) || 1;

  const columns = [
    {
      header: "Image",
      accessorKey: "imageUrls",
      cell: ({ row }) => (
        <div className="relative w-16 h-16">
          {row.original.avatar ? (
            <Avatar
              userImg={row.original.avatar}
              alt={row.original.email}
              w={64}
              h={64}
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
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "First Name",
      accessorKey: "firstName",
    },
    {
      header: "Last Name",
      accessorKey: "lastName",
    },
    {
      header: "Status",
      accessorKey: "isDisable",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-full text-white text-sm text-center font-bold ${
              row.original.isDisable ? "bg-red" : "bg-green"
            }`}
          >
            {row.original.isDisable ? "Disabled" : "Active"}
          </span>
        </div>
      ),
    },
    {
      header: "Role",
      accessorKey: "roleId",
      cell: ({ row }) => <RoleChip status={row.original.roleId} />,
    },
    {
      header: "Verified",
      accessorKey: "isVerified",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-full text-white text-sm text-center font-bold ${
              row.original.isVerified ? "bg-green" : "bg-yellow"
            }`}
          >
            {row.original.isVerified ? "Verified" : "Unverified"}
          </span>
        </div>
      ),
    },
    {
      header: "Location",
      accessorKey: "location",
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            label="Ban"
            onClick={() => handleBanAccount(row.original.id)}
            className="p-2 bg-red"
            icon={<IoPersonRemoveSharp size={20} />}
          />
        </div>
      ),
    },
  ];

  const tablePageIndex =
    pagination.pageIndex > 1 ? pagination.pageIndex - 1 : 0;

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

  // Filter selection component
  const FilterSelectors = () => (
    <div className="mb-6 flex items-center gap-5 p-4 w-full">
      <div className="font-medium mr-2 flex items-center gap-2">
        <IoFilterOutline size={18} />
        Filters
      </div>

      {filterOptions.map((filter) => (
        <FormControl
          key={filter.label}
          variant="outlined"
          size="small"
          className="w-full max-w-[200px] dark:text-white"
        >
          <InputLabel id={`${filter.label}-label`} className="dark:text-white">
            {filter.label}
          </InputLabel>
          <Select
            MenuProps={{
              disableScrollLock: true,
            }}
            labelId={`${filter.label}-label`}
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            label={filter.label}
            className="bg-white dark:bg-gray-700 dark:text-white"
          >
            {filter.options.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}

      <Button
        label="Reset Filters"
        onClick={() =>
          setFilters({
            status: 0,
            gender: "",
            isVerified: "",
            isDisabled: "",
          })
        }
        className="ml-auto"
      />
    </div>
  );

  return (
    <AdminWrapper>
      <div className="w-full">
        <FilterSelectors />

        <div className="w-full">
          {isLoading && data.length === 0 ? (
            <Skeleton
              animation="wave"
              variant="text"
              width="100%"
              height={40}
            />
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded">
              Error loading accounts: {error.message}
            </div>
          ) : data.length === 0 && !isLoading ? (
            <div className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">No Accounts Found</h2>
              <p>
                No accounts match your filter criteria. Try adjusting your
                filters.
              </p>
            </div>
          ) : (
            <DataTable
              data={data}
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
        </div>
      </div>
    </AdminWrapper>
  );
};

export default ManageAccount;
