import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import { useUser } from "@/app/providers/userprovider";

const SUB_URL = `api/FavoriteService`;

const SUB_URL2 = `api/FavoriteProduct`;

export function useGetListFavorite() {
  const { user } = useUser();
  return useQuery({
    queryKey: ["get_list_favorite"],
    queryFn: async () => {
      try {
        const res = await BaseRequest.Get(`/${SUB_URL}/myfavorite`, false);
        return res.data;
      } finally {
        nProgress.done();
      }
    },
    enabled: !!user,
  });
}

export function useGetListFavoriteProduct() {
  const { user } = useUser();
  return useQuery({
    queryKey: ["get_list_favorite_product"],
    queryFn: async () => {
      const res = await BaseRequest.Get(`/${SUB_URL2}/productList`, false);
      return res.data;
    },
    enabled: !!user,
  });
}
