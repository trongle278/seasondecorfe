import { useQuery } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";

const SUB_URL = `api/CancelType`;

export function useGetCancelType(isEnabled = false) {
  return useQuery({
    queryKey: ["cancel-type"],
    queryFn: async () => {
      const res = await BaseRequest.Get(`/${SUB_URL}/getAllCancelType`, false);
      return res.data;
    },
    enabled: isEnabled,
  });
}
