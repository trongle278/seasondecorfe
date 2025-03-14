import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";

const SUB_URL = `api/Chat`;

export function useGetHistoryChat(userId) {
  return useQuery({
    queryKey: ["get_history_chat", userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await BaseRequest.Get(`/${SUB_URL}/chat-history/${userId}`, false);
      return res.data;
    },
    enabled: !!userId,
  });
}
