import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/Booking`;

export function useBookService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      nProgress.start();
      try {
        return await BaseRequest.Post(`/${SUB_URL}/create`, data);
      } finally {
        nProgress.done();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["booking-list-for-customer"],
      });
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

export function useApproveBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      nProgress.start();
      try {
        return await BaseRequest.Put(`/${SUB_URL}/status/${id}`);
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


export function useGetBookingDetailForProvider(bookingCode) {
  return useQuery({
    queryKey: ["booking-detail-for-provider", bookingCode],
    queryFn: async () => {
      nProgress.start();
      try {
        const res = await BaseRequest.Get(`/${SUB_URL}/getBookingDetailsForProvider/${bookingCode}`, false);
        return res.data;
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useChangeBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookingCode) => {
      nProgress.start();
      try {
        return await BaseRequest.Put(`/${SUB_URL}/status/${bookingCode}`);
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
