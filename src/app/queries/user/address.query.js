import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";

const SUB_URL = `api/Address`;

export function useGetAllAddress() {
  return useQuery({
    queryKey: ["addressList"],
    queryFn: async () => {
      const res = await BaseRequest.Get(`/${SUB_URL}`, false);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create_address"],
    mutationFn: async (data) => {
      return BaseRequest.Post(`/${SUB_URL}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["addressList"]);
    },
    onError: (error) => {
      console.error("Error adding address:", error.message);
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update_address"],
    mutationFn: async ({ id, ...data }) => {
      return BaseRequest.Put(`/${SUB_URL}/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["addressList"]);
    },
    onError: (error) => {
      console.error("Error updating address:", error.message);
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete_address"],
    mutationFn: async (addressId) => {
      return BaseRequest.Delete(`/${SUB_URL}/${addressId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["addressList"]);
    },
    onError: (error) => {
      console.error("Error deleting address:", error.message);
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["set_default_address"],
    mutationFn: async (id) => {
      return BaseRequest.Post(`/${SUB_URL}/set-default/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["addressList"]);
    },
    onError: (error) => {
      console.error("Error setting default address:", error.message);
    },
  });
}

