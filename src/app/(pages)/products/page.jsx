"use client";

import { ListWrapper } from "@/app/components/ui/ListWrapper";
import DataMapper from "@/app/components/DataMapper";
import ProductCard from "@/app/components/ui/card/ProductCard";
import EmptyState from "@/app/components/EmptyState";
import { useGetListProduct } from "@/app/queries/list/product.list.query";
import { Skeleton } from "@mui/material";

const filters = [
  {
    label: "Price",
    options: [
      { id: 0, name: "All" },
      { id: 1, name: "High to Low" },
      { id: 2, name: "Low to High" },
    ],
    onChange: (value) => console.log("Sort By:", value),
  },
  {
    label: "Popular",
    options: [
      { id: 0, name: "All" },
      { id: 1, name: "Most Liked" },
      { id: 2, name: "Less Liked" },
    ],
    onChange: (value) => console.log("Sort By:", value),
  },
  {
    label: "Popular",
    options: [
      { id: 0, name: "All" },
      { id: 1, name: "Most Liked" },
      { id: 2, name: "Less Liked" },
    ],
    onChange: (value) => console.log("Sort By:", value),
  },
  // {
  //   label: "Category",
  //   options: [
  //     { id: 0, name: "All" },
  //     { id: 0, name: "Most Liked" },
  //     { id: 1, name: "Less Liked" },
  //   ],
  //   onChange: (value) => console.log("Sort By:", value),
  // },
];
const ListProductPage = () => {
  const { data: productsData, isLoading, isError } = useGetListProduct();
  
  const products = productsData?.data || [];

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  return (
    <ListWrapper filters={filters}>
      <DataMapper
        data={products}
        Component={ProductCard}
        emptyStateComponent={<EmptyState title="No products found" />}
        loading={isLoading}
        getKey={(item) => item.id}
        componentProps={(product) => ({
          image: product.imageUrls?.[0] || <Skeleton animation="wave" />,
          productName: product.productName,
          rate: product.rate,
          price: product.productPrice,
          quantity: product.quantity,
          totalSold: product.totalSold,
          id: product.id,
          href: `/products/${generateSlug(product.productName)}`,
        })}
      />
    </ListWrapper>
  );
};

export default ListProductPage;
