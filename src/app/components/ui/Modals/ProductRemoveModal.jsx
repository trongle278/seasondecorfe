"use client";

import * as React from "react";
import Modal from "../Modal";
import Heading from "./components/Heading";
import { ClipLoader } from "react-spinners";
import useProductRemoveModal from "@/app/hooks/useProductRemoveModal";
import { IoWarningOutline } from "react-icons/io5";

const ProductRemoveModal = ({ onRemoveProduct }) => {
  const productRemoveModal = useProductRemoveModal();
  const [isRemoving, setIsRemoving] = React.useState(false);

  const handleRemove = () => {
    if (!productRemoveModal.productId) return;

    setIsRemoving(true);
    
    onRemoveProduct(productRemoveModal.productId);
    
    // Close the modal after removal
    setTimeout(() => {
      setIsRemoving(false);
      productRemoveModal.onClose();
    }, 300);
  };

  const bodyContent = (
    <>
      <div className="flex flex-row gap-4 items-center justify-center">
        <IoWarningOutline size={30} color="red" />
        <Heading title={`Remove ${productRemoveModal.productName || 'this product'} from quotation?`} />
      </div>
    </>
  );

  return (
    <Modal
      disabled={isRemoving}
      isOpen={productRemoveModal.isOpen}
      title="Confirmation"
      actionLabel={isRemoving ? <ClipLoader size={20} /> : "Remove"}
      secondaryAction={productRemoveModal.onClose}
      secondaryActionLabel="Cancel"
      onClose={productRemoveModal.onClose}
      onSubmit={handleRemove}
      body={bodyContent}
    />
  );
};

export default ProductRemoveModal; 