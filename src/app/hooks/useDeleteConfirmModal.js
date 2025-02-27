import { create } from "zustand";

const useDeleteConfimModal = create((set) => ({
  isOpen: false,
  itemToDelete: null,
  onOpen: (id) => set({ isOpen: true, itemToDelete: id }),
  onClose: () => set({ isOpen: false, itemToDelete: null }),
}));

export default useDeleteConfimModal;
