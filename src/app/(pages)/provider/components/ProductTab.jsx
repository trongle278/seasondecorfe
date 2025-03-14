"use client";
import DataMapper from "@/app/components/DataMapper";
import { usePathname } from "next/navigation";
import { useGetProductByProvider } from "@/app/queries/list/product.list.query";
import ProductCard from "@/app/components/ui/card/ProductCard";
import EmptyState from "@/app/components/EmptyState";


const ProductsTab = () => {
  const pathname = usePathname();
  const slug = pathname.split('/').pop();
  const { data: productList, isLoading: productLoading } =
    useGetProductByProvider(slug);

  return (
    <DataMapper
      data={productList}
      Component={ProductCard}
      emptyStateComponent={<EmptyState title="No products found" />}
      loading={productLoading}
      getKey={(item) => item.id}
    />
  );
};

export default ProductsTab;
