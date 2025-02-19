"use client";

import * as React from "react";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Modal from "../Modal";
import Heading from "./components/Heading";
import Input from "../inputs/Input";
import useAddressModal from "@/app/hooks/useAddressModal";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";

// const schema = yup.object().shape({
//   email: yup.string().email("Email is invalid").required("Email is required"),
//   password: yup.string().required("Password is required"),
// });

const AdressModal = () => {
  const router = useRouter();
  const addressModal = useAddressModal();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    //resolver: yupResolver(schema),
  });

  const onSubmit = React.useCallback();

  {
    /*----------------RENDER INSIDE MODAL COMPONENT WITH PROPS---------*/
  }

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="New address" />

      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
        <div className="flex flex-col space-y-2 w-full">
          <Input
            id="firstName"
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
          <Input
            id="lastName"
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
      <Input
        id="fds"
        placeholder="City/Town, Province"
        required
        register={register}
        errors={errors}
        type="text"
        className="pl-3"
      />
      <Input
        id="fsd"
        placeholder="Specific location"
        required
        register={register}
        errors={errors}
        type="text"
        className="pl-3"
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3 ">
      <hr />
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={addressModal.isOpen}
      title="Add address"
      actionLabel={
        isLoading ? <ClipLoader size={20} color={"#fff"} /> : "Complete"
      }
      onClose={addressModal.onClose}
      onSubmit={() => {}}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default AdressModal;
