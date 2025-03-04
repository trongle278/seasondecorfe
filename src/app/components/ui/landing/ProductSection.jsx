"use client";

import { BlackBgButton } from "../Buttons/Button2colors";
import Categories from "./components/Categories";
import Card from "../card/Card";
import Container from "../../layouts/Container";
import DataMapper from "../../DataMapper";
import { useGetListProduct } from "@/app/queries/list/product.list.query";
import EmptyState from "../../EmptyState";
import { Skeleton } from "@mui/material";

const ProductSection = () => {
  const { data: productList, isLoading, isError } = useGetListProduct();

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  };

  return (
    <Container>
      <Categories />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 gap-12 mt-10  relative">
        <DataMapper
          data={productList}
          Component={Card}
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
        <BlackBgButton blackBtnlable="Browse products" />
      </div>
    </Container>
  );
};

export default ProductSection;
