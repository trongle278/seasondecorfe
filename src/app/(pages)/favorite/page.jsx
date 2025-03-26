"use client";

import React from "react";
import { ListWrapper } from "@/app/components/ui/ListWrapper";
import DataMapper from "@/app/components/DataMapper";
import { useGetListFavorite } from "@/app/queries/list/favorite.list.query";
import { useRemoveFavoriteDecorService } from "@/app/queries/favorite/favorit.query";
import FavoriteCard from "@/app/components/ui/card/FavoriteCard";
import EmptyState from "@/app/components/EmptyState";
import { generateSlug } from "@/app/helpers";
import { useRouter } from "next/navigation";

const filters = [
  {
    label: "Sort By",
    options: [
      { id: 0, name: "All" },
      { id: 1, name: "Service" },
      { id: 2, name: "Product" },
    ],
    onChange: (value) => console.log("Sort By:", value),
  },
];

const FavoritePage = () => {
  const { data: listFavorite, isLoading } = useGetListFavorite();
  const { mutate: removeFavorite } = useRemoveFavoriteDecorService();
  const router = useRouter();

  return (
    <ListWrapper filters={filters}>
      <DataMapper
        data={listFavorite}
        Component={FavoriteCard}
        emptyStateComponent={<EmptyState title="You have no favorite yet" />}
        loading={isLoading}
        getKey={(item) => item.favoriteId}
        componentProps={(item) => ({
          image: item.decorServiceDetails.images,
          name: item.decorServiceDetails.style,
          description: item.decorServiceDetails.description,
          location: item.decorServiceDetails.province,
          price: item.decorServiceDetails.price,
          rating: item.decorServiceDetails.rating,
          id: item.decorServiceDetails.id,
          slug: item.decorServiceDetails.slug,
          seasons: item.decorServiceDetails.seasons,
          isService: true,
          onRemoveFavorite: () => removeFavorite(item.favoriteId),
          onClick: () =>
            router.push(
              `/booking/${generateSlug(item.decorServiceDetails.style)}`
            ),
        })}
      />
    </ListWrapper>
  );
};

export default FavoritePage;
