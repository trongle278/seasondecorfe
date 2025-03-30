"use client";

import * as React from "react";

import Modal from "../Modal";
import Heading from "./components/Heading";
import { ClipLoader } from "react-spinners";
import useDeleteConfimModal from "@/app/hooks/useDeleteConfirmModal";
import { IoWarningOutline } from "react-icons/io5";
import { useDeleteAddress } from "@/app/queries/user/address.query";
import { useCancelOrder } from "@/app/queries/order/order.query";
import { useQueryClient } from "@tanstack/react-query";

const DeleteConfirmModal = () => {
  const deleteConfirmModal = useDeleteConfimModal();
  const deleteMutation = useDeleteAddress();
  const cancelOrderMutation = useCancelOrder();
  const queryClient = useQueryClient();
  // Track loading state for both mutations
  const isLoading = deleteMutation.isLoading || cancelOrderMutation.isLoading;

  const handleDelete = () => {
    if (!deleteConfirmModal.itemToDelete) return;

    // Determine which mutation to use based on the type
    if (deleteConfirmModal.type === 'address') {
      deleteMutation.mutate(deleteConfirmModal.itemToDelete, {
        onSuccess: () => {
          deleteConfirmModal.onClose();
        },
        onError: (error) => {
          console.error("Error deleting address:", error);
        }
      });
    } 
    else if (deleteConfirmModal.type === 'order') {
      cancelOrderMutation.mutate(deleteConfirmModal.itemToDelete, {
        onSuccess: () => {
          deleteConfirmModal.onClose();
        },
        onError: (error) => {
          console.error("Error canceling order:", error);
        }
      });
    }
  };

  // Get appropriate title and action label based on type
  const getTitle = () => {
    const type = deleteConfirmModal.type || 'item';
    const title = deleteConfirmModal.title || type;
    
    if (type === 'order') {
      return `Are you sure you want to cancel this ${title}?`;
    }
    
    return `Are you sure you want to delete this ${title}?`;
  };
  
  const getActionLabel = () => {
    if (isLoading) {
      return <ClipLoader size={20} />;
    }
    
    return deleteConfirmModal.type === 'order' ? "Cancel" : "Delete";
  };

  const bodyContent = (
    <div className="flex flex-row gap-4 items-center justify-center">
      <IoWarningOutline size={30} color="red"/>
      <Heading title={getTitle()} />
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
      isOpen={deleteConfirmModal.isOpen}
      title="Confirmation"
      actionLabel={getActionLabel()}
      secondaryAction={deleteConfirmModal.onClose}
      secondaryActionLabel="Go Back"
      onClose={deleteConfirmModal.onClose}
      onSubmit={handleDelete}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default DeleteConfirmModal;
