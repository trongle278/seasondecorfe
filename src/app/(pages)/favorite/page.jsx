"use client";

import { ListWrapper } from "@/app/components/ui/ListWrapper";
import DataMapper from "@/app/components/DataMapper";
import { useGetListFavorite } from "@/app/queries/list/favorite.list.query";
import FavoriteCard from "@/app/components/ui/card/FavoriteCard";
import EmptyState from "@/app/components/EmptyState";

const filters = [
  {
    label: "Sort By",
    options: [
      { id: 0, name: "All" },
      { id: 1, name: "Newest" },
      { id: 2, name: "Oldest" },
    ],
    onChange: (value) => console.log("Sort By:", value),
  },
];

const FavoritePage = () => {
  const { data: listFavorite, isLoading } = useGetListFavorite();


  return (
    <ListWrapper filters={filters}>
      <DataMapper
        data={listFavorite}
        Component={FavoriteCard}
        emptyStateComponent={<EmptyState title="You have no favorite yet" />}
        loading={isLoading}
        getKey={(item) => item.id}
      />
    </ListWrapper>
  );
};

export default FavoritePage;
