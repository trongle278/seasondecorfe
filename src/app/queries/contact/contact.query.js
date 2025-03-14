import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";

const SUB_URL = `api/contact`;


export function useAddContact() {
  return useMutation({
    mutationFn: async (receiverId) => {
      const res = await BaseRequest.Post(`/${SUB_URL}/add/${receiverId}`, false);
      return res;
    },
  });
}

