"use client";

import * as React from "react";

import Modal from "../Modal";
import Heading from "./components/Heading";
import { ClipLoader } from "react-spinners";
import useDeleteConfimModal from "@/app/hooks/useDeleteConfirmModal";
import { IoWarningOutline } from "react-icons/io5";
import { useDeleteAddress } from "@/app/queries/user/address.query";

const DeleteConfirmModal = ({}) => {
  const deleteConfirmModal = useDeleteConfimModal();
  const deleteMutation = useDeleteAddress();

  const handleDelete = () => {
    if (!deleteConfirmModal.itemToDelete) return;

    deleteMutation.mutate(deleteConfirmModal.itemToDelete, {
      onSuccess: () => {
        deleteConfirmModal.onClose();
      },
    });
  };

  {
    /*----------------RENDER INSIDE MODAL COMPONENT WITH PROPS---------*/
  }

  const bodyContent = (
    <div className="flex flex-row gap-4 items-center justify-center">
    <IoWarningOutline size={30} color="red"/>
      <Heading title={`Are you sure you want to delete this address ? `}/>
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3 ">
      <hr />
    </div>
  );

  return (
    <Modal
      disabled={deleteMutation.isLoading}
      isOpen={deleteConfirmModal.isOpen}
      title="Confirmation"
      actionLabel={deleteMutation.isLoading ? <ClipLoader size={20} /> : "Delete"}
      secondaryAction={deleteConfirmModal.onClose}
      secondaryActionLabel="Cancel"
      onClose={deleteConfirmModal.onClose}
      onSubmit={handleDelete}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default DeleteConfirmModal;
