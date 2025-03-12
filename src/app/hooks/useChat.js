import { create } from "zustand";
import { useGetListProvider } from "../queries/list/provider.list.query";

const useChat = create((set, get) => ({
  
  providers: [
    {
      id: 1,
      name: "John's Furniture",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
      status: "Online",
      unreadCount: 0,
    },
    {
      id: 2,
      name: "Emily's Decor",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
      status: "Offline",
      unreadCount: 2,
    },
    
    // Add more mock providers as needed
  ],
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