"use client";

import React from "react";
import { UserWrapper } from "../components/UserWrapper";
import {
  useGetFollower,
  useGetFollowCount,
} from "@/app/queries/list/follow.list.query";
import { FootTypo } from "@/app/components/ui/Typography";
import ProviderCard from "@/app/components/ui/card/ProviderCard";
import DataMapper from "@/app/components/DataMapper";
import EmptyState from "@/app/components/EmptyState";
import { useFollow, useUnfollow } from "@/app/queries/user/user.query";
import { useQueryClient } from "@tanstack/react-query";
import { useGetFollowing } from "@/app/queries/list/follow.list.query";
import useChatBox from "@/app/hooks/useChatBox";

const UserFollowers = () => {
  const { onOpen } = useChatBox(); 
  const { data: followers, isLoading } = useGetFollower();
  const { data: followCount } = useGetFollowCount();

  const queryClient = useQueryClient();
  const followMutation = useFollow();
  const { data: followingData, isLoading: followingLoading } =
    useGetFollowing();
  const unfollowMutation = useUnfollow();

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
            console.error("Error unfollowing provider:", error);
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
            console.error("Error following provider:", error);
          },
        }
      );
    }
  };

  const isProviderFollowed = (providerId) => {
    return followingData?.some(
      (following) => following.accountId === providerId
    );
  };

  return (
    <UserWrapper>
      <div className="flex-grow ml-6 relative ">
        <div className="flex flex-col relative w-full ">
          <div className="pb-11 border-b-[1px]">
            <div className="flex flex-row justify-between items-center ">
              <span>
                <FootTypo
                  footlabel={`${followCount?.followersCount} followers`}
                  className="!m-0 text-lg font-semibold"
                />
              </span>
            </div>
          </div>
          <div className="mt-3 space-y-4">
            <DataMapper
              data={followers}
              Component={ProviderCard}
              emptyStateComponent={<EmptyState title="No followers found" />}
              loading={isLoading}
              getKey={(item) => item.accountId}
              componentProps={(follower) => ({
                id: follower.accountId,
                slug: follower.slug,
                name: follower.businessName,
                avatar: follower.avatar,
                onFollowClick: () => handleFollowToggle(follower.accountId),
                //href: `provider/${follower.slug}`,
                isFollowed: isProviderFollowed(follower.accountId),
                isLoading:
                  followMutation.isLoading ||
                  unfollowMutation.isLoading ||
                  followingLoading,
                onChatClick: () => onOpen(follower),
              })}
            />
          </div>
        </div>
      </div>
    </UserWrapper>
  );
};

export default UserFollowers;
