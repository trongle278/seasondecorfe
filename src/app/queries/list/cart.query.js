import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/Cart`;

export function useGetListCart(id) {
  return useQuery({
    queryKey: ["get_list_cart"],
    queryFn: async () => {
      nProgress.start();
      try {
        const res = await BaseRequest.Get(`/${SUB_URL}/getCart/${id}`, false);
        return res.data;
        
      } finally {
        nProgress.done();
      }
    },
    enabled: !!id,
  });
}
