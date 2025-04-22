"use client";

import * as React from "react";
import { useState, useEffect } from "react";

import Modal from "../Modal";
import Heading from "./components/Heading";
import { ClipLoader } from "react-spinners";
import useDeleteConfimModal from "@/app/hooks/useDeleteConfirmModal";
import { IoWarningOutline } from "react-icons/io5";
import { useDeleteAddress } from "@/app/queries/user/address.query";
import { useCancelOrder } from "@/app/queries/order/order.query";
import { useQueryClient } from "@tanstack/react-query";
import { Label } from "@/app/components/ui/inputs/Label";
import { Field, Textarea } from "@headlessui/react";
import { useGetCancelType } from "@/app/queries/type/cancel.type.query";
import { useCancelBookingRequest } from "@/app/queries/book/book.query";
import { toast } from "sonner";
import { FootTypo } from "../Typography";

const DeleteConfirmModal = () => {
  const deleteConfirmModal = useDeleteConfimModal();
  const deleteMutation = useDeleteAddress();
  const cancelOrderMutation = useCancelOrder();
  const cancelRequestMutation = useCancelBookingRequest();
  const queryClient = useQueryClient();

  // State for storing selected cancel reason
  const [cancelReason, setCancelReason] = useState("");
  const [selectedCancelType, setSelectedCancelType] = useState("");

  // Only fetch cancel types when modal is open and type is "request"
  const shouldFetchCancelTypes =
    deleteConfirmModal.isOpen && deleteConfirmModal.type === "request";

  const { data: cancelType, isLoading: cancelTypeLoading } = useGetCancelType(
    shouldFetchCancelTypes
  );

  // Track loading state for all mutations
  const isLoading =
    deleteMutation.isLoading ||
    cancelOrderMutation.isLoading ||
    cancelRequestMutation.isLoading;

  // Reset form values when modal opens/closes
  useEffect(() => {
    if (!deleteConfirmModal.isOpen) {
      setCancelReason("");
      setSelectedCancelType("");
    }
  }, [deleteConfirmModal.isOpen]);

  const handleDelete = () => {
    if (!deleteConfirmModal.itemToDelete) return;

    // Determine which mutation to use based on the type
    if (deleteConfirmModal.type === "address") {
      deleteMutation.mutate(deleteConfirmModal.itemToDelete, {
        onSuccess: () => {
          deleteConfirmModal.onClose();
        },
        onError: (error) => {
          console.error("Error deleting address:", error);
        },
      });
    } else if (deleteConfirmModal.type === "order") {
      cancelOrderMutation.mutate(deleteConfirmModal.itemToDelete, {
        onSuccess: () => {
          deleteConfirmModal.onClose();
        },
        onError: (error) => {
          console.error("Error canceling order:", error);
        },
      });
    } else if (deleteConfirmModal.type === "request") {
      const requestData = {
        bookingCode: deleteConfirmModal.itemToDelete,
        cancelTypeId: selectedCancelType,
        cancelReason: cancelReason,
      };

      cancelRequestMutation.mutate(requestData, {
        onSuccess: () => {
          queryClient.invalidateQueries(["booking-list-for-customer"]);
          deleteConfirmModal.onClose();
        },
        onError: (error) => {
          toast.error(
            error?.response?.data?.message || "Failed to cancel request"
          );
          console.error("Error cancelling request:", error);
        },
      });
    }
  };

  // Get appropriate title and action label based on type
  const getTitle = () => {
    const type = deleteConfirmModal.type || "item";
    const title = deleteConfirmModal.title || type;

    if (type === "order") {
      return `Are you sure you want to cancel this ${title}?`;
    }

    if (type === "request") {
      return `Cancellation request for ${title}`;
    }

    return `Are you sure you want to delete this ${title}?`;
  };

  const getActionLabel = () => {
    if (isLoading) {
      return <ClipLoader size={20} />;
    }

    return deleteConfirmModal.type === "request" ? "Send" : "Delete";
  };

  const bodyContent = (
    <>
      <div className="flex flex-row gap-4 items-center justify-center">
        <IoWarningOutline size={30} color="red" />
        <Heading title={getTitle()} />
      </div>
      {deleteConfirmModal.type === "request" && (
        <div className="space-y-4 mt-5">
          {cancelType && cancelType.length > 0 && (
            <div className="w-full">
              <Label htmlFor="cancelType">
                Select a reason for cancellation
              </Label>
              <select
                id="cancelType"
                value={selectedCancelType}
                onChange={(e) => setSelectedCancelType(e.target.value)}
                className="my-3 block w-full rounded-lg border-[1px] border-black dark:border-gray-600 py-2 px-3 text-sm
                bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2
                focus:ring-black dark:focus:ring-white transition duration-200"
              >
                <option value="">Select a reason</option>
                {cancelType.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.type}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Label htmlFor="cancelReason">
            Tell provider more about why you want to cancel this request
          </Label>
          <div className="w-full">
            <Field>
              <Textarea
                id="cancelReason"
                name="cancelReason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Type your reason here..."
                className={`
      mt-3 block w-full resize-none rounded-lg border-[1px] 
      border-black dark:border-gray-600 py-1.5 px-3 text-sm/6 
      bg-white dark:bg-gray-800 text-black dark:text-white
      placeholder-gray-500 dark:placeholder-gray-400
      focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white
      transition duration-200
    `}
                rows={7}
              />
            </Field>
          </div>
        </div>
      )}
    </>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3 ">
      {deleteConfirmModal.type === "request" && (
        <div className="w-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="text-amber-600 dark:text-amber-400 mt-0.5">
              <IoWarningOutline size={20} />
            </div>
            <div>
              <FootTypo
                footlabel="Since your request is being processed by provider, you can only cancel it if you have a valid reason and provider agrees to cancel it."
                className="text-sm break-words text-amber-700 dark:text-amber-200 leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Disable submit button if it's a request cancellation and no reason is selected
  const isSubmitDisabled =
    isLoading ||
    (deleteConfirmModal.type === "request" &&
      cancelType &&
      cancelType.length > 0 &&
      !selectedCancelType);

  return (
    <Modal
      disabled={isSubmitDisabled}
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
