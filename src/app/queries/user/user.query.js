import { useQuery } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";

const SUB_URL = `api/Account`;

export function useGetAccountDetails(accountId) {
  return useQuery({
    queryKey: ["accountDetails", accountId],
    queryFn: async () => {
      if (!accountId) throw new Error("No accountId provided");
      const res = await BaseRequest.Get(`/${SUB_URL}/${accountId}`);
      return res.data;
    },
    enabled: !!accountId,
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,

  });
}
