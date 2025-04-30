"use client";

import * as React from "react";

import { useForm } from "react-hook-form";
import Modal from "../Modal";
import Heading from "./components/Heading";
import Input from "../inputs/Input";
import useAddressModal from "@/app/hooks/useAddressModal";
import ProvinceDistrictWardSelect from "@/app/(pages)/user/components/ProvinceDropdown";
import { RadioGroup } from "../Select/RadioGroup";
import {
  useCreateAddress,
  useUpdateAddress,
} from "@/app/queries/user/address.query";
import { Label } from "../inputs/Label";
import CustomCheckBox from "../Select/Checkbox";

const AdressModal = () => {
  const addressModal = useAddressModal();
  const typeOptions = ["Home", "Office"];
  const [isDefault, setIsDefault] = React.useState(false);
  const mutationCreate = useCreateAddress();
  const mutationUpdate = useUpdateAddress();

  // Convert between display values and API values for address type
  const displayToApiType = (displayType) => {
    return displayType === "Home" ? 0 : displayType === "Office" ? 1 : null;
  };


  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      phone: "",
      type: "",
      isDefault: false,
      province: "",
      district: "",
      ward: "",
      street: "",
      detail: "",
    },
  });

  React.useEffect(() => {
    if (
      addressModal.editAddress &&
      typeof addressModal.editAddress === "object"
    ) {
      console.log("Updating form with editAddress:", {
        ...addressModal.editAddress,
      });

      // Convert numeric type to display value

      // Reset the form with editAddress data (avoids looping issues)
      reset({
        fullName: addressModal.editAddress.fullName || "",
        phone: addressModal.editAddress.phone || "",
        type: addressModal.editAddress.addressType || "",
        isDefault: addressModal.editAddress.isDefault ?? false,
        province: addressModal.editAddress.province || "",
        district: addressModal.editAddress.district || "",
        ward: addressModal.editAddress.ward || "",
        street: addressModal.editAddress.street || "",
        detail: addressModal.editAddress.detail || "",
      });

      setValue("type", addressModal.editAddress.addressType || "");
      setIsDefault(addressModal.editAddress.isDefault ?? false);
    }
  }, [addressModal.editAddress, reset]);

  const onSubmit = async (data) => {
    // Convert display type to API value
    const apiType = displayToApiType(data.type);

    const payloadToCreate = {
      ...data,
      type: apiType, // Use numeric value for API
      isDefault: isDefault,
    };

    console.log("payloadToCreate:", payloadToCreate);

    const payloadToUpdate = {
      ...data,
      type: apiType, // Use numeric value for API
      id: addressModal.AddressId,
      isDefault: isDefault,
    };

    if (addressModal.AddressId) {
      mutationUpdate.mutate(payloadToUpdate, {
        onSuccess: () => {
          addressModal.onClose();
          reset();
        },
      });
    } else {
      mutationCreate.mutate(payloadToCreate, {
        onSuccess: () => {
          addressModal.onClose();
          reset();
        },
      });
    }
  };

  {
    /*----------------RENDER INSIDE MODAL COMPONENT WITH PROPS---------*/
  }

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="New address" />

      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
        <div className="flex flex-col space-y-2 w-full">
          <Label htmlFor="firstname">Full name</Label>
          <Input
            id="fullName"
            placeholder="Full name"
            type="text"
            required
            register={register}
            errors={errors}
            className="pl-3"
          />
          {errors.firstName && (
            <p className="text-red">{errors.firstName.message}</p>
          )}
        </div>
        <div className="flex flex-col space-y-2 w-full">
          <Label htmlFor="firstname">Phone number</Label>
          <Input
            id="phone"
            placeholder="Phone number"
            required
            register={register}
            errors={errors}
            type="text"
            className="pl-3"
          />
          {errors.lastName && (
            <p className="text-red">{errors.lastName.message}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
        <div className="flex flex-col space-y-2 w-full">
          <Label htmlFor="firstname">Street</Label>
          <Input
            id="street"
            placeholder="Street"
            type="text"
            required
            register={register}
            errors={errors}
            className="pl-3"
          />
          {errors.firstName && (
            <p className="text-red">{errors.firstName.message}</p>
          )}
        </div>
        <div className="flex flex-col space-y-2 w-full">
          <Label htmlFor="firstname">Ward</Label>
          <Input
            id="ward"
            placeholder="Ward"
            required
            register={register}
            errors={errors}
            type="text"
            className="pl-3"
          />
          {errors.lastName && (
            <p className="text-red">{errors.lastName.message}</p>
          )}
        </div>
      </div>
      <div className="mt-3">
        <ProvinceDistrictWardSelect
          defaultDistrict={addressModal.editAddress?.district}
          defaultProvince={addressModal.editAddress?.province}
          onChange={({ province, district }) => {
            setValue("province", province);
            setValue("district", district);
          }}
        />
      </div>
      <Label htmlFor="specific">Specific location</Label>
      <Input
        id="detail"
        placeholder="Specific location"
        required
        register={register}
        errors={errors}
        type="text"
        className="pl-3"
      />
      <RadioGroup
        label="Type"
        options={typeOptions}
        value={watch("type") || ""}
        onChange={(type) => {
          setValue("type", type);
          console.log("Address type set to:", type, "API value:", displayToApiType(type));
        }}
      />
      <CustomCheckBox
        value={isDefault}
        onChange={(checked) => {
          console.log("Checkbox changed to:", checked);
          setIsDefault(checked);
        }}
      />
    </div>
  );

  const footerContent = (
   <></>
  );

  const handleClose = () => {
    reset();
    addressModal.onClose();
  };

  return (
    <Modal
      disabled={mutationCreate.isPending}
      isOpen={addressModal.isOpen}
      title={addressModal.AddressId ? "Edit Address" : "Add Address"}
      actionLabel="Complete"
      secondaryAction={addressModal.onClose}
      secondaryActionLabel="Cancel"
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
      loading={mutationCreate.isPending || mutationUpdate.isPending}
    />
  );
};

export default AdressModal;
