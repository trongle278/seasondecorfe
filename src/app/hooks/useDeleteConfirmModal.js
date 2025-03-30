import { create } from "zustand";

const useDeleteConfimModal = create((set) => ({
  title: null,
  isOpen: false,
  itemToDelete: null,
  type: null,
  
  onOpen: (title, id, type = 'item') => set({ isOpen: true, itemToDelete: id, title, type }),
  onClose: () => set({ isOpen: false, itemToDelete: null, title: null, type: null }),
}));

export default useDeleteConfimModal;
