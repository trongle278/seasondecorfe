import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/Provider`;

export function useGetListProvider() {
  return useQuery({
    queryKey: ["get_list_provider"],
    queryFn: async () => {
      nProgress.start();
      try {
        const res = await BaseRequest.Get(`/${SUB_URL}/getAll`, false);
        return res.data;
      } finally {
        nProgress.done();
      }
    },
  });
}

