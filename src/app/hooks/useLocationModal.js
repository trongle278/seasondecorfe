import { create } from "zustand";

export const useLocationModal = create((set) => ({
  isOpen: false,
  forceOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set((state) => ({ isOpen: state.forceOpen ? true : false })),
  setForceOpen: (value) => set({ forceOpen: value }),
  onSuccessUpdate: () => set({ forceOpen: false, isOpen: false }),
}));
