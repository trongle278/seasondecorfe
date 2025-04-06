"use client";

import React from "react";
import { ListWrapper } from "@/app/components/ui/ListWrapper";
import ProviderCard from "@/app/components/ui/card/ProviderCard";
import { useGetListProvider } from "@/app/queries/list/provider.list.query";
import DataMapper from "@/app/components/DataMapper";
import { useFollow, useUnfollow } from "@/app/queries/user/user.query";
import { useGetFollowing } from "@/app/queries/list/follow.list.query";
import { useQueryClient } from "@tanstack/react-query";
import EmptyState from "@/app/components/EmptyState";
import useChatBox from "@/app/hooks/useChatBox";
import useChat from "@/app/hooks/useChat";
import { useAddContact } from "@/app/queries/contact/contact.query";

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

const ListProviderPage = () => {
  const { onOpen } = useChatBox();
  const { setSelectedProvider } = useChat();
  const { data: listProvider, isLoading, isError } = useGetListProvider();
  const queryClient = useQueryClient();
  const followMutation = useFollow();
  const { data: followingData, isLoading: followingLoading } = useGetFollowing();
  const unfollowMutation = useUnfollow();
  const addContactMutation = useAddContact();

  const handleFollowToggle = async (providerId) => {
    if (!providerId) {
      console.error("No providerId provided");
      return;
    }

    if (isProviderFollowed(providerId)) {
      unfollowMutation.mutate(
        { followingId: providerId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(["following"]);
          },
          onError: (error) => {
            //console.error("Error unfollowing provider:", error);
          },
        }
      );
    } else {
      followMutation.mutate(
        { followingId: providerId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(["following"]);
          },
          onError: (error) => {
            //console.error("Error following provider:", error);
          },
        }
      );
    }
  };

  const isProviderFollowed = (providerId) => {
    return followingData?.some((following) => following.accountId === providerId);
  };

  const handleChatClick = (provider) => {
    const providerData = {
      contactId: provider.id,
      contactName: provider.businessName,
      avatar: provider.avatar
    };
    addContactMutation.mutate(provider.id, {
      onSuccess: () => {
        setSelectedProvider(providerData);
        onOpen();
        queryClient.invalidateQueries(["get_list_contact"]);
      },
      onError: (error) => {
        console.error("Error adding contact:", error);
      },
    });
  };

  return (
    <ListWrapper filters={filters}>
      <DataMapper
        data={listProvider}
        Component={ProviderCard}
        emptyStateComponent={<EmptyState title="No providers found" />}
        loading={isLoading}
        getKey={(item) => item.id}
        componentProps={(provider) => ({
          id: provider.id,
          slug: provider.slug,
          status: provider.providerStatus,
          name: provider.businessName,
          onFollowClick: () => handleFollowToggle(provider.id),
          href: `provider/${provider.slug}`,
          isFollowed: isProviderFollowed(provider.id),
          isLoading: followMutation.isLoading || unfollowMutation.isLoading || followingLoading,
          onChatClick: () => handleChatClick(provider),
        })}
      />
    </ListWrapper>
  );
};

export default ListProviderPage;
