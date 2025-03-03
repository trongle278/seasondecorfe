import { useQuery, useMutation } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/AccountProfile`;

const SUB_URL2 = `api/Follow`;

export function useGetAccountDetails(accountId) {
  return useQuery({
    queryKey: ["accountDetails", accountId],
    queryFn: async () => {
      if (!accountId) throw new Error("No accountId provided");

      nProgress.start();

      try {
        const res = await BaseRequest.Get(`/${SUB_URL}/${accountId}`);
        return res.data;
      } finally {
        nProgress.done();
      }
    },
    enabled: !!accountId,
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });
}

export function useFollow() {
  return useMutation({
    mutationFn: async ({followingId}) => {
      if (!followingId) throw new Error("No followingId provided");

      nProgress.start();

      try {
        return await BaseRequest.Post(`/${SUB_URL2}/follow`, followingId);
      } finally {
        nProgress.done();
      }
    },
  });
}

