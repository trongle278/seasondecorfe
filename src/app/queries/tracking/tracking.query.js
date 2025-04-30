import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/Tracking`;

export function useAddTracking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (!data) throw new Error("No data provided");

      nProgress.start();

      try {
        const { bookingCode, formData } = data;

        if (!bookingCode) {
          throw new Error("bookingCode is required");
        }

        return await BaseRequest.Post(
          `/${SUB_URL}/addTracking?bookingCode=${bookingCode}`,
          formData
        );
      } finally {
        nProgress.done();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracking"] }); 
    }
  });
}

export function useUpdateTracking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (!data) throw new Error("No data provided");

      nProgress.start();

      try {
        const { trackingId, formData } = data;

        if (!trackingId) {
          throw new Error("trackingId is required");
        }
        return await BaseRequest.Put(
          `/${SUB_URL}/updateTracking/${trackingId}`,
          formData
        );
      } finally {
        nProgress.done();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracking"] }); 
    }
  });
}

export function useRemoveTracking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (trackingId) => {
      if (!trackingId) throw new Error("No trackingId provided");

      nProgress.start();

      try {
        return await BaseRequest.Delete(
          `/${SUB_URL}/removeTracking/${trackingId}`
        );
      } finally {
        nProgress.done();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracking"] }); 
    }
  });
}

export function useGetTrackingByBookingCode(bookingCode) {
  return useQuery({
    queryKey: ["tracking", bookingCode],
    queryFn: async () => {
      nProgress.start();
      try {
        const res = await BaseRequest.Get(
          `/${SUB_URL}/getTrackingByBookingCode?bookingCode=${bookingCode}`,
          false
        );
        return res.data;
      } finally {
        nProgress.done();
      }
    },
  });
}
