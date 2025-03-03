"use client";

import { BorderBox } from "@/app/components/ui/BorderBox";
import { FootTypo } from "@/app/components/ui/Typography";
import Status from "./Status";
import Button from "@/app/components/ui/Buttons/Button";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import useDeleteConfirmModal from "@/app/hooks/useDeleteConfirmModal";
import useAddressModal from "@/app/hooks/useAddressModal";
import { useSetDefaultAddress } from "@/app/queries/user/address.query";

const AddressBox = ({
  id,
  fullName,
  isDefault,
  province,
  district,
  ward,
  street,
  detail,
  phone,
  addressType
}) => {
  const deleteConfirmModal = useDeleteConfirmModal();
  const addressModal = useAddressModal();
  const setDefaultAddress = useSetDefaultAddress();

  const handleSetDefault = () => {
    setDefaultAddress.mutate(id, {
      onSuccess: () => {
        console.log(`Address ${id} set as default successfully!`);
      },
      onError: (error) => {
        console.error("Error setting default address:", error.message);
      },
    });
  };

  const handleDeleteClick = () => {
    deleteConfirmModal.onOpen(id, fullName);
  };

  const handleEditClick = () => {
    addressModal.onOpen({
      id,
      fullName,
      isDefault,
      province,
      district,
      ward,
      street,
      detail,
      phone,
      addressType
    });
  };

  return (
    <BorderBox className="dark:bg-zinc-900 my-3">
      <div className="w-full">
        <div className="flex flex-row justify-between items-center">
          <span className="flex flex-row items-center gap-2">
            <FootTypo
              footlabel={fullName}
              className="!m-0 text-lg font-semibold"
            />
            <div className="border-l-[2px] pl-3">{phone}</div>
          </span>
          <span className="flex flex-row items-center gap-2">
            <Button
              onClick={handleEditClick}
              label="Edit"
              icon={<CiEdit size={20} />}
            />
            <Button
              onClick={handleDeleteClick}
              label="Delete"
              icon={<MdDeleteOutline size={20} />}
              className="bg-red"
            />
          </span>
        </div>
        <div className="flex flex-row justify-between mt-3">
          <span className="flex flex-row gap-1">
            <FootTypo
              footlabel={street}
              className="!m-0 text-sm font-secondary "
            />
            <div>,</div>
            <FootTypo
              footlabel={ward}
              className="!m-0 text-sm font-secondary "
            />
            <div>,</div>
            <FootTypo
              footlabel={district}
              className="!m-0 text-sm font-secondary "
            />
            <div>,</div>
            <FootTypo
              footlabel={province}
              className="!m-0 text-sm font-secondary "
            />
          </span>

          {!isDefault && (
            <Button
              onClick={handleSetDefault}
              label="Set as default"
              className="border-t-0 border-l-0 border-r-0"
            />
          )}
        </div>
        <FootTypo footlabel={detail} className="!m-0 text-sm font-secondary " />

        <Status isDefault={isDefault} />
      </div>
    </BorderBox>
  );
};

export default AddressBox;
