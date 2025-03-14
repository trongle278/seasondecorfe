"use client";

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

const SellerProductManage = () => {
  const router = useRouter();
  const userSlug = useSelector((state) => state.users.userSlug);

  const { data: products = [], isLoading } = useGetProductByProvider(userSlug);

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

  const handleDeleteProduct = (productId) => {
    // Implement delete functionality here
    console.log("Delete product:", productId);
  };

  return (
    <SellerWrapper>
      <>
        <div className="section-1 flex flex-row gap-3 items-center mb-6">
          <Button
            onClick={() => router.push("/seller/product/create")}
            label="Sell Product"
            className="bg-primary"
            icon={<MdOutlineFileUpload size={20} />}
          />
        </div>
        <DataTable
          data={products}
          columns={columns}
          isLoading={isLoading}
          showPagination={true}
          pageSize={10}
        />
      </>
    </SellerWrapper>
  );
};

export default SellerProductManage;
