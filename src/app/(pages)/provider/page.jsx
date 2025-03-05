"use client";

import { ListWrapper } from "@/app/components/ui/ListWrapper";
import ProviderCard from "./components/ProviderCard";
import { useGetListProvider } from "@/app/queries/list/provider.list.query";
import DataMapper from "@/app/components/DataMapper";
import { useFollow } from "@/app/queries/user/user.query";
import { useGetFollowing } from "@/app/queries/list/follow.list.query";
import { useQueryClient } from "@tanstack/react-query";
import EmptyState from "@/app/components/EmptyState";

const filters = [
  {
    label: "Sort By",
    options: [
      { id: 0, name: "Near Me" },
      { id: 1, name: "Top Rated" },
      { id: 2, name: "Most Popular" },
    ],
    onChange: (value) => console.log("Sort By:", value),
  },
];

const ProviderPage = () => {
  const { data: listProvider, isLoading, isError } = useGetListProvider();

  const queryClient = useQueryClient();

  const followMutation = useFollow();

  const handleFollow = async (followingId) => {
    if (!followingId) {
      console.error("No followingId provided");
      return;
    }

    followMutation.mutate(
      { followingId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["following"]);
        },
        onError: (error) => {
          console.error("Error following provider:", error);
        },
      }
    );
  };

  return (
    <ListWrapper filters={filters}>
      <DataMapper
        data={listProvider}
        Component={ProviderCard}
        emptyStateComponent={<EmptyState title="No providers found" />}
        loading={isLoading}
        getKey={(item) => item.id}
        componentProps={(item) => ({
          onFollowClick: () => handleFollow(item.id),
        })}
      />  
    </ListWrapper>
  );
};

export default ProviderPage;
