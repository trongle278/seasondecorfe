import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/DecorService`;

export function useGetListDecorService() {
  return useQuery({
    queryKey: ["get_list_decor_service"],
    queryFn: async () => {
      nProgress.start();
      try {
        const res = await BaseRequest.Get(
          `/${SUB_URL}`,
          false
        );
        return res.data;
      } finally {
        nProgress.done();
      }
    },
  });
}
