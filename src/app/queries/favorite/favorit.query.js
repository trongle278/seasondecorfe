import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";

const SUB_URL = `api/FavoriteService`;

export function useAddFavoriteDecorService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (decorServiceId) => {
      const res = await BaseRequest.Post(
        `/${SUB_URL}/${decorServiceId}`
      );
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decor-service"] });
    },
  });
}

export function useRemoveFavoriteDecorService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (decorServiceId) => {
      const res = await BaseRequest.Delete(
        `/${SUB_URL}/${decorServiceId}`
      );
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_list_favorite"] });
    },
  });
}
