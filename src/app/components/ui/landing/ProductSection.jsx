"use client";

import { BlackBgButton } from "../Buttons/Button2colors";
import Categories from "./components/Categories";
import ProductCard from "../card/ProductCard";
import Container from "../../layouts/Container";
import DataMapper from "../../DataMapper";
import { useGetListProduct } from "@/app/queries/list/product.list.query";
import { useGetProductByCategoryId } from "@/app/queries/list/product.list.query";
import EmptyState from "../../EmptyState";
import { Skeleton } from "@mui/material";
import { useSearchParams } from "next/navigation";

const ProductSection = () => {
  const params = useSearchParams();

  const selectedCategoryId = params?.get("categoryId"); 


  const { data: productList, isLoading, isError } = selectedCategoryId
    ? useGetProductByCategoryId(selectedCategoryId) 
    : useGetListProduct(); 
  

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  };

  return (
    <Container>
      <Categories />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 gap-12 mt-10  relative">
        <DataMapper
          data={productList}
          Component={ProductCard}
          loading={isLoading}
          emptyStateComponent={<EmptyState title="No products found"/>}
          getKey={(product) => product.id}
          componentProps={(product) => ({
            image: product.imageUrls?.[0] || <Skeleton animation="wave" />,
            productName: product.productName,
            rate: product.rate,
            price: product.productPrice,
            totalSold: product.totalSold,
            id: product.id,
            href: `/products/${generateSlug(product.productName)}`,
          })}
        />
        <div className="absolute inset-x-0 bottom-0 z-30 h-80 bg-gradient-to-t from-white to-transparent dark:from-black opacity-90 rounded-2xl"></div>
      </div>
      <div className="flex justify-center w-full">
        <BlackBgButton blackBtnlable="Browse products" href={"/products"}  />
      </div>
    </Container>
  );
};

export default ProductSection;
