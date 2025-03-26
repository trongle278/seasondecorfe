"use client";

import React from "react";
import Button from "@/app/components/ui/Buttons/Button";
import { FootTypo } from "@/app/components/ui/Typography";
import { UserWrapper } from "../../components/UserWrapper";
import { FaPlus } from "react-icons/fa6";
import useAddressModal from "@/app/hooks/useAddressModal";
import AddressBox from "../../components/AddressBox";
import { useGetAllAddress } from "@/app/queries/user/address.query";
import DataMapper from "@/app/components/DataMapper";
import EmptyState from "@/app/components/EmptyState";

const UserAddress = () => {
  const addressModal = useAddressModal();

  const { data: addresses, isFetching, isError } = useGetAllAddress();
  console.log("Addresses Data:", addresses);

  if (isError) return <p>Error loading addresses.</p>;

  const sortedAddresses = Array.isArray(addresses)
    ? [...addresses].sort((a, b) => (b.isDefault ? 1 : -1))
    : [];

  return (
    <UserWrapper>
      <div className="flex-grow ml-6 relative ">
        <div className="flex flex-col relative ">
          <div className="pb-9 border-b-[1px]">
            <div className="flex flex-row justify-between items-center ">
              <span>
                <FootTypo
                  footlabel="My Addresses"
                  className="!m-0 text-lg font-semibold"
                />
              </span>

              <Button
                label="Add address"
                icon={<FaPlus size={20} />}
                onClick={addressModal.onOpen}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <DataMapper
          data={sortedAddresses}
          Component={AddressBox}
          emptyStateComponent={<EmptyState title="You saved no addresses" />}
          loading={isFetching}
          getKey={(address) => address.id}
        />
      </div>
    </UserWrapper>
  );
};

export default UserAddress;
