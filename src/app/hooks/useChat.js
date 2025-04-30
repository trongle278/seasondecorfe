import { create } from "zustand";

const useChat = create((set, get) => ({
  
  conversations: {},
  selectedReceiver: null,
  setSelectedReceiver: (receiver) => set({ selectedReceiver: receiver }),
  addMessage: (receiverId, message) => {
    set((state) => ({
      conversations: {
        ...state.conversations,
        [receiverId]: [
          ...(state.conversations[receiverId] || []),
          {
            ...message,
            id: Date.now(),
            time: new Date(),
          },
        ],
      },
    }));
  },
  getConversation: (receiverId) => {
    const state = get();
    return state.conversations[receiverId] || [];
  },
}));

export default useChat;