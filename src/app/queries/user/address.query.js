import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/Address`;

export function useGetAllAddress() {
  return useQuery({
    queryKey: ["addressList"],
    queryFn: async () => {
      nProgress.start();
      try {
        const res = await BaseRequest.Get(`/${SUB_URL}`, false);
        return res.data;
      } finally {
        nProgress.done();
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create_address"],
    mutationFn: async (data) => {
      nProgress.start();
      try {
        return await BaseRequest.Post(`/${SUB_URL}`, data);
      } finally {
        nProgress.done();
      }
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
      nProgress.start();
      try {
        return await BaseRequest.Put(`/${SUB_URL}/${id}`, data);
      } finally {
        nProgress.done();
      }
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
      nProgress.start();
      try {
        return await BaseRequest.Delete(`/${SUB_URL}/${addressId}`);
      } finally {
        nProgress.done();
      }
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
      nProgress.start();
      try {
        return await BaseRequest.Post(`/${SUB_URL}/set-default/${id}`);
      } finally {
        nProgress.done();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["addressList"]);
    },
    onError: (error) => {
      console.error("Error setting default address:", error.message);
    },
  });
}
