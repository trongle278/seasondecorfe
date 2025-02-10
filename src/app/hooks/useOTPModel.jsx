import { create } from "zustand";

const useOTPModal = create((set) => ({
  isOpen: false,
  email: "",
  onOpen: (email) => set({ isOpen: true, email }),
  onClose: () => set({ isOpen: false, email: "" }),
}));

export default useOTPModal;
