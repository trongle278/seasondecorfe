import { create } from "zustand";

const useInfoModal = create((set) => ({
  isOrder: false,
  isBooking: false,
  isOpen: false,
  data: null,
  onOpen: (data) => set({ isOpen: true, data }),
  onClose: () => set({ isOpen: false, data: null }),
}));

export default useInfoModal;
