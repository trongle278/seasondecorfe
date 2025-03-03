import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL1 = `api/ProductCategory`;

export function useGetListProductCategory() {
  return useQuery({
    queryKey: ["get_list_category"],
    queryFn: async () => {
      nProgress.start();
      try {
        const res = await BaseRequest.Get(`/${SUB_URL1}/getList`, false);
        return res.data;
      } finally {
        nProgress.done();
      }
    },
  });
}
