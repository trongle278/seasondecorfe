"use client";

import React, { useState, useEffect } from "react";
import { UserWrapper } from "../../components/UserWrapper";
import { formatDate } from "@/app/helpers";
import { useUser } from "@/app/providers/userprovider";
import Image from "next/image";
import { BorderBox } from "@/app/components/ui/BorderBox";
import { FootTypo } from "@/app/components/ui/Typography";

const Reputation = () => {
  const { user } = useUser();
  const maxReputation = 100; // Maximum possible reputation points

  // Calculate progress percentage for the reputation bar
  const calculateProgress = (current) => {
    // For a 100 point scale
    return Math.min(Math.max(current, 0), maxReputation);
  };

  return (
    <UserWrapper>
      <BorderBox className="border-2 border-gray-200 shadow-xl p-6">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-primary">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name || "User"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary/20 flex items-center justify-center text-4xl font-bold text-primary">
                {user?.firstName?.charAt(0) || "U"}
              </div>
            )}
          </div>

          <div className="flex-1">
            <FootTypo
              footlabel={user?.firstName + " " + user?.lastName || "User Name"}
              className="!mb-0 text-2xl font-bold"
            />

            {/* Reputation Progress Bar */}
            <div className="mt-4 mb-2 flex items-center gap-2">
              <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 relative">
                <div
                  className="bg-primary h-4 rounded-full transition-all duration-500 ease-in-out"
                  style={{
                    width: `${calculateProgress(user?.reputation || 0)}%`,
                  }}
                ></div>
              </div>
              <span className="text-sm font-medium">{maxReputation}</span>
            </div>

            <div className="text-sm text-gray-500 mt-1">
              Your reputation score: {user?.reputation || 0}/{maxReputation}
            </div>
          </div>
        </div>

        {/* Reputation Explanation */}
        <div className="mt-6 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">What is Reputation?</h3>
          <p className="text-sm text-gray-700 mb-3">
            Your reputation score reflects your standing in our community. It's
            based on your activity, purchases, and contributions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-3  rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛒</span>
                <span className="font-medium">Purchases</span>
              </div>
              <p className="text-xs mt-2 ">
                Each purchase adds to your reputation
              </p>
            </div>
            <div className="p-3  rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl">⭐</span>
                <span className="font-medium">Reviews</span>
              </div>
              <p className="text-xs mt-2">
                Writing reviews increases your reputation
              </p>
            </div>
            <div className="p-3 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl">👥</span>
                <span className="font-medium">Referrals</span>
              </div>
              <p className="text-xs mt-2">
                Refer friends to earn reputation points
              </p>
            </div>
          </div>
        </div>
      </BorderBox>
    </UserWrapper>
  );
};

export default Reputation;
