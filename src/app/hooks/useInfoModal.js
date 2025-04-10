import { create } from "zustand";

const useInfoModal = create((set) => ({
  isOrder: false,
  isBooking: false,
  isDescription: false,
  isOpen: false,
  data: null,
  buttonLabel: null,
  onOpen: (data, buttonLabel) => set({ isOpen: true, data, buttonLabel }),
  onClose: () => set({ isOpen: false, data: null, buttonLabel: null }),
}));

export default useInfoModal;
