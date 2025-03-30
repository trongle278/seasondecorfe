import { useQuery, useMutation } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/Payment`;

export function useCreateTopup() {
  return useMutation({
    mutationKey: ["top_up"],
    mutationFn: async (data) => {
      if (!data) throw new Error("No topup data provided");

      nProgress.start();

      try {
        return await BaseRequest.Post(`/${SUB_URL}/top-up`, data);
      } finally {
        nProgress.done();
      }
    },
  });
}
