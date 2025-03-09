import { useQuery, useMutation } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/DecorService`;

export function useCreateDecorService() {
  return useMutation({
    mutationFn: async (data) => {
      if (!data) throw new Error("No product provided");

      nProgress.start();

      try {
        return await BaseRequest.Post(`/${SUB_URL}/add`, data);
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useGetDecorServiceById(id) {
  return useQuery({
    queryKey: ["decor-service", id],
    queryFn: async () => {
      if (!id) throw new Error("No id provided");

      nProgress.start();

      try {
        const res = await BaseRequest.Get(`/${SUB_URL}/${id}`, false);
        return res.data;
      } finally {
        nProgress.done();
      }
    },
  });
}
