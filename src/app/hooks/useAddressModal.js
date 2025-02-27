import { create } from "zustand";

const useAddressModal = create((set) => ({
  isOpen: false,
  editAddress: null,
  AddressId: null,
  onOpen: (address = null) => {
    console.log("Setting modal state in useAddressModal:", address);
    set({ isOpen: true, editAddress: address, AddressId: address?.id || null });
  },
  onClose: () => set({ isOpen: false, editAddress: null, AddressId: null }),
}));

export default useAddressModal;
