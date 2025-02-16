"use client";

import * as React from "react";
import Button2 from "./buttons/Button2";
import { IoMdClose } from "react-icons/io";

const Modal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  footer,
  actionLabel,
  disabled,
  secondaryAction,
  secondaryActionLabel,
}) => {
  const [showModal, setShowModal] = React.useState(isOpen);

  React.useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = React.useCallback(() => {
    if (disabled) {
      return;
    }

    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [disabled, onClose]);

  const handleSubmit = React.useCallback(() => {
    if (disabled) {
      return;
    }

    onSubmit();
  }, [disabled, onSubmit]);

  const handleSecondaryAction = React.useCallback(() => {
    if (disabled || !secondaryAction) {
      return;
    }
    secondaryAction();
  }, [disabled, secondaryAction]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70 text-black">
        <div className="relative w-full md:w-4/5 lg:w-3/6 xl:w-2/5 my-6 mx-auto h-full lg:h-auto md:h-auto">
          {/*----------------------MODAL CONTENT HERE-------------------*/}
          <div
            className={`translate duration-300 h-full 
           ${showModal ? "translate-y-0" : "translate-y-full"}
           ${showModal ? "opacity-100" : "opacity-0"}
           `}
          >
            <div className="translate h-full lg:h-auto md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none ">
              {/*----------MODAL HEADER HERE----------------------*/}
              <div className="flex items-center p-6 rounded-t justify-center relative border-b-[1px]">
                <button
                  onClick={handleClose}
                  className="p-1 border-0 hover:opacity-70 transition absolute left-9"
                >
                  <IoMdClose size={18} />
                </button>
                <div className="text-lg font-semibold">{title}</div>
              </div>
              {/*----------------MODAL BODY HERE----------------*/}
              <div className="relative p-6 flex-auto">
                <div className="justify-center items-center">{body}</div>
              </div>
              {/*----------------MODAL FOOTER HERE----------------*/}
              <div className="flex flex-col gap-2 p-6">
                <div className="flex flex-row items-center justify-center gap-4 w-full">
                  {secondaryAction && secondaryActionLabel && (
                    <Button2
                      outline
                      disable={disabled}
                      label={secondaryActionLabel}
                      onClick={handleSecondaryAction}
                      btnClass="w-full"
                    />
                  )}

                  <Button2
                    disable={disabled}
                    label={actionLabel}
                    onClick={handleSubmit}
                    btnClass="w-[200px]"
                    labelClass="justify-center p-3"

                  />
                </div>
                {footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
