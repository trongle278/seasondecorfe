"use client";

import * as React from "react";

import Modal from "../Modal";
import useSearchModal from "@/app/hooks/useSearchModal";
import Input from "../inputs/Input";
import { FcSearch } from "react-icons/fc";

const SearchModal = ({}) => {
  const searchModal = useSearchModal();

  {
    /*----------------RENDER INSIDE MODAL COMPONENT WITH PROPS---------*/
  }

  const bodyContent = (
    <>
      <div className=" gap-4 items-center w-full pb-5">
        <Input
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          placeholder="Search something"
          icon={<FcSearch size={20} />}
        />
      </div>
      <div className="border-t-[1px]">content</div>
    </>
  );

  const footerContent = null;

  return (
    <Modal
      //disabled={deleteMutation.isLoading}
      isOpen={searchModal.isOpen}
      title="Search"
      //actionLabel={}
      //secondaryAction={deleteConfirmModal.onClose}
      //secondaryActionLabel="Cancel"
      onClose={searchModal.onClose}
      //onSubmit={handleDelete}
      body={bodyContent}
      footer={footerContent}
      isSearch={true}
    />
  );
};

export default SearchModal;
