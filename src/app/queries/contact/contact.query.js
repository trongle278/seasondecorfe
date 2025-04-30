import { useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";

const SUB_URL = `api/contact`;

export function useAddContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (receiverId) => {
      const res = await BaseRequest.Post(
        `/${SUB_URL}/add/${receiverId}`,
        false
      );
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_list_contact"] });
    },
  });
}
