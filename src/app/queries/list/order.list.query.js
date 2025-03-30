import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/Order`;

export function useGetOrderList() {
  return useQuery({
    queryKey: ["order_list"],
    queryFn: async () => {
      nProgress.start();
      try {
        const res = await BaseRequest.Get(`/${SUB_URL}/getList`, false);
        return res.data;
      } finally {
        nProgress.done();
      }
    },
  });
}
