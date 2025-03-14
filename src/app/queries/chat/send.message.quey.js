import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";

const SUB_URL = `api/Chat`;

export function useSendMessage() {
  return useMutation({
    mutationFn: async (data) => {
      const res = await BaseRequest.Post(
        `/${SUB_URL}/sendmessage`,
        data,
        false
      );
      return res.data;
    },
  });
}
