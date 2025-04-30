"use client";

import React, { useState } from "react";
import DataMapper from "@/app/components/DataMapper";
import { useGetListFavorite } from "@/app/queries/list/favorite.list.query";
import { useRemoveFavoriteDecorService } from "@/app/queries/favorite/favorit.query";
import { useGetListFavoriteProduct } from "@/app/queries/list/favorite.list.query";
import { useRemoveFavoriteDecorProduct } from "@/app/queries/favorite/favorit.query";
import FavoriteCard from "@/app/components/ui/card/FavoriteCard";
import EmptyState from "@/app/components/EmptyState";
import { generateSlug } from "@/app/helpers";
import { useRouter } from "next/navigation";
import Container from "@/app/components/layouts/Container";

const FavoritePage = () => {
  const [activeTab, setActiveTab] = useState("service"); // "service" or "product"
  const { data: listFavorite, isLoading } = useGetListFavorite();
  const { mutate: removeFavorite } = useRemoveFavoriteDecorService();
  const { data: listFavoriteProduct, isLoading: isLoadingProduct } =
    useGetListFavoriteProduct();
  const { mutate: removeFavoriteProduct } = useRemoveFavoriteDecorProduct();
  const router = useRouter();

  const tabClasses =
    "px-4 py-2 font-medium text-sm rounded-lg cursor-pointer";
  const activeTabClasses = `${tabClasses} bg-primary text-white`;
  const inactiveTabClasses = `${tabClasses} bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700`;

  return (
    <div className="pb-20">
      <Container>
        {/* Tab Navigation */}
        <div className="flex items-center justify-center mb-4 gap-3">
          <div
            className={
              activeTab === "service" ? activeTabClasses : inactiveTabClasses
            }
            onClick={() => setActiveTab("service")}
          >
            Services
          </div>
          <div
            className={
              activeTab === "product" ? activeTabClasses : inactiveTabClasses
            }
            onClick={() => setActiveTab("product")}
          >
            Products
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6 animate-tab-fade-in">
          {/* Tab Content */}
          {activeTab === "service" ? (
            <DataMapper
              data={listFavorite}
              Component={FavoriteCard}
              emptyStateComponent={
                <EmptyState title="You have no favorite services yet" />
              }
              loading={isLoading}
              getKey={(item) => item.favoriteId}
              componentProps={(item) => ({
                image: item.decorServiceDetails.images,
                name: item.decorServiceDetails.style,
                //description: item.decorServiceDetails.description,
                location: item.decorServiceDetails.sublocation,
                price: item.decorServiceDetails.price,
                rating: item.decorServiceDetails.rating,
                id: item.decorServiceDetails.id,
                slug: item.decorServiceDetails.slug,
                season: item.decorServiceDetails.seasons,
                isService: true,
                onRemoveFavorite: () =>
                  removeFavorite(item.decorServiceDetails.id),
                onClick: () =>
                  router.push(
                    `/booking/${generateSlug(item.decorServiceDetails.style)}`
                  ),
              })}
            />
          ) : (
            <DataMapper
              data={listFavoriteProduct}
              Component={FavoriteCard}
              emptyStateComponent={
                <EmptyState title="You have no favorite products yet" />
              }
              loading={isLoadingProduct}
              getKey={(item) => item.id}
              componentProps={(item) => ({
                image: item.productDetail.imageUrls,
                name: item.productDetail.productName,
                description: item.productDetail.description,
                price: item.productDetail.productPrice,
                madeIn: item.productDetail.madeIn,
                rating: item.productDetail.totalRate,
                shipForm: item.productDetail.shipForm,
                totalSold: item.productDetail.totalSold,
                id: item.productDetail.id,
                slug: item.productDetail.slug,
                isService: false,
                onRemoveFavorite: () =>
                  removeFavoriteProduct(item.productDetail.id),
                onClick: () =>
                  router.push(
                    `/products/${generateSlug(item.productDetail.productName)}`
                  ),
              })}
            />
          )}
        </div>
      </Container>
    </div>
  );
};

export default FavoritePage;
