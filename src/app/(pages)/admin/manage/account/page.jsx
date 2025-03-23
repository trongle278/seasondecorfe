"use client";

import * as React from "react";
import AdminWrapper from "../../components/AdminWrapper";
import { useGetListAccount } from "@/app/queries/list/account.list.query";
import DataTable from "@/app/components/ui/table/DataTable";

const ManageAccount = () => {
  const { data: accountList, isLoading, error } = useGetListAccount();

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
      header: "IsDisabled",
      accessorKey: "isDisabled",
    },
    {
      header: "RoleId",
      accessorKey: "roleId",
    },
    {
      header: "IsVerified",
      accessorKey: "isVerified",
    },
    {
      header: "Joined Date",
      accessorKey: "joinedDate",
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

  return (
    <AdminWrapper>
      <div>ManageAccount</div>
    </AdminWrapper>
  );
};

export default ManageAccount;
