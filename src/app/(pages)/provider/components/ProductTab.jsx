"use client";

import * as React from "react";
import DataMapper from "@/app/components/DataMapper";
import { usePathname } from "next/navigation";
import { useGetProductByProvider } from "@/app/queries/list/product.list.query";
import ProductCard from "@/app/components/ui/card/ProductCard";
import EmptyState from "@/app/components/EmptyState";
import { generateSlug } from "@/app/helpers";

const ProductsTab = () => {
  const [pagination, setPagination] = React.useState({
    pageIndex: 1,
    pageSize: 10,
    sortBy: "",
    descending: false,
    productName: "",
    minPrice: "",
    maxPrice: "",
  });

  const pathname = usePathname();
  const slug = pathname.split("/").pop();
  const { data: productList, isLoading: productLoading } =
    useGetProductByProvider(slug, pagination);

  const products = productList?.data || [];
  const totalCount = productList?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pagination.pageSize) || 1;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 gap-12 mt-10  relative">
      <DataMapper
        data={products}
        Component={ProductCard}
        emptyStateComponent={<EmptyState title="No products found" />}
        loading={productLoading}
        getKey={(item) => item.id}
        componentProps={(product) => ({
          image: product.imageUrls?.[0] || <Skeleton animation="wave" />,
          productName: product.productName,
          rate: product.rate,
          price: product.productPrice,
          href: `/products/${generateSlug(product.productName)}`,
        })}
      />
    </div>
  );
};

export default ProductsTab;
