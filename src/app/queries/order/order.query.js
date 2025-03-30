import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/Order`;

export function useCreateOrder() {
  return useMutation({
    mutationKey: ["create_order"],
    mutationFn: async (data) => {
      nProgress.start();

      try {
        const cartId = data.get ? data.get("id") : data.id;

        const addressId = data.get ? data.get("addressId") : data.addressId;

        console.log(
          `Creating order with cartId=${cartId}, addressId=${addressId}`
        );

        // Use the cart ID in the URL path and addressId as a query parameter
        return await BaseRequest.Post(
          `/${SUB_URL}/createOrder/${cartId}?addressId=${addressId}`
        );
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["cancel_order"],
    mutationFn: async (id) => {
      nProgress.start();

      try {
        return await BaseRequest.Delete(`/${SUB_URL}/cancelOrder/${id}`);
      } finally {
        nProgress.done();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order_list"] });
    },
  });
}
