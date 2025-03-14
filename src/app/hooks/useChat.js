import { create } from "zustand";

const useChat = create((set, get) => ({
  
  conversations: {},
  selectedProvider: null,
  setSelectedProvider: (provider) => set({ selectedProvider: provider }),
  addMessage: (providerId, message) => {
    set((state) => ({
      conversations: {
        ...state.conversations,
        [providerId]: [
          ...(state.conversations[providerId] || []),
          {
            ...message,
            id: Date.now(),
            time: new Date(),
          },
        ],
      },
    }));
  },
  getConversation: (providerId) => {
    const state = get();
    return state.conversations[providerId] || [];
  },
}));

export default useChat;