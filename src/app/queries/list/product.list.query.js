import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/Product`;

export function useGetListProduct() {
  return useQuery({
    queryKey: ["product_list"],
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

export function useGetProductByCategoryId(categoryId) {
  return useQuery({
    queryKey: ["product_list", categoryId],
    queryFn: async () => {
      nProgress.start();
      try {
        const res = await BaseRequest.Get(
          `/${SUB_URL}/getProductByCategory/${categoryId}`,
          false
        );
        return res.data;
      } finally {
        nProgress.done();
      }
    },
  });
}
