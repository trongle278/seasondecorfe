import { create } from "zustand";

const useProductRemoveModal = create((set) => ({
  isOpen: false,
  productId: null,
  productName: null,
  
  onOpen: (productId, productName) => set({ isOpen: true, productId, productName }),
  onClose: () => set({ isOpen: false, productId: null, productName: null }),
}));

export default useProductRemoveModal; 