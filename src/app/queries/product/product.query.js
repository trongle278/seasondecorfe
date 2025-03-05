import { useQuery, useMutation } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/Product`;

export function useCreateProduct() {
  return useMutation({
    mutationFn: async (data) => {
      if (!data) throw new Error("No product provided");

      nProgress.start();

      try {
        return await BaseRequest.Post(`/${SUB_URL}/createProduct`, data);
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useGetProductById(id) {
  return useQuery({
    queryKey: ["product_by_id", id],
    queryFn: async () => {
      nProgress.start();

      try {
        const res = await BaseRequest.Get(`/${SUB_URL}/getById/${id}`, false);
        return res.data;
      } finally {
        nProgress.done();
      }
    },
    enabled: !!id,
    staleTime: 0,
    cacheTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}
