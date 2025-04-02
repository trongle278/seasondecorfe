import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/Booking`;

export function useBookService() {
  return useMutation({
    mutationFn: async (data) => {
      nProgress.start();
      try {
        return await BaseRequest.Post(`/${SUB_URL}/create`, data);
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      nProgress.start();
      try {
        return await BaseRequest.Post(`/${SUB_URL}/cancel/${id}`);
      } finally {
        nProgress.done();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["booking-list-for-provider"],
      });
    },
  });
}

export function useRejectBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      nProgress.start();
      try {
        return await BaseRequest.Put(`/${SUB_URL}/reject/${id}`);
      } finally {
        nProgress.done();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["booking-list-for-provider"],
      });
    },
  });
}
