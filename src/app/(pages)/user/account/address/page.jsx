"use client";

import * as React from "react";
import Button from "@/app/components/ui/buttons/Button";
import { FootTypo } from "@/app/components/ui/typography";
import { UserWrapper } from "../../components/UserWrapper";
import { useSession } from "next-auth/react";
import { FaRegSave } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import useAddressModal from "@/app/hooks/useAddressModal";

const UserAddress = () => {
  const { data } = useSession();
  const [isLoading, setIsLoading] = React.useState(false);
  const addressModal = useAddressModal();
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

              <Button label="Add address" icon={<FaPlus size={20} />} onClick={addressModal.onOpen} />
            </div>
          </div>
          <div className="pt-7">
            <div className="flex-1 pr-12">
              <form className="flex flex-col gap-7 mb-10"></form>
            </div>
          </div>
        </div>
      </div>
    </UserWrapper>
  );
};

export default UserAddress;
