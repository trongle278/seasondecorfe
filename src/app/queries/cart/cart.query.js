import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";


const SUB_URL = `api/Cart`;

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["add_to_cart"],
    mutationFn: async ({ accountId, productId, quantity }) => {
      nProgress.start();
      try {
        return await BaseRequest.Post(
          `/${SUB_URL}/addToCart/${accountId}?productId=${productId}&quantity=${quantity}`
        );
      } finally {
        nProgress.done();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_list_cart"] });
    },
  });
}

export function useUpdateQuantity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update_quantity"],
    mutationFn: async ({ accountId, productId, quantity }) => {
      nProgress.start();
      try {
        return await BaseRequest.Put(
          `/${SUB_URL}/updateQuantity/${accountId}?productId=${productId}&quantity=${quantity}`, false
        );
      } finally {
        nProgress.done();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_list_cart"] });
    },
  });
}

export function useDeleteCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete_cart_item"],
    mutationFn: async ({ accountId, productId }) => {
      nProgress.start();
      try {
        return await BaseRequest.Delete(
          `/${SUB_URL}/removeProduct/${accountId}?productId=${productId}`
        );
      } finally {
        nProgress.done();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_list_cart"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
}
