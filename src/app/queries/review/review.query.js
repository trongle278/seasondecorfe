import { useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/Review`;

export function useReviewProduct() {
  return useMutation({
    mutationFn: async (data) => {
      if (!data) throw new Error("No review data provided");

      try {
        return await BaseRequest.Post(`/${SUB_URL}/reviewProduct`, data);
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useReviewService() {
  return useMutation({
    mutationFn: async (data) => {
      if (!data) throw new Error("No review data provided");

      try {
        return await BaseRequest.Post(`/${SUB_URL}/reviewService`, data);
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useUpdateProductReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (!data) throw new Error("No review data provided");

      const { id, productId, orderId, ...reviewData } = data;
      if (!id) throw new Error("No id provided");

      try {
        return await BaseRequest.Put(
          `/${SUB_URL}/updateProductReview/${id}?productId=${productId}&orderId=${orderId}`,
          reviewData
        );
      } finally {
        nProgress.done();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productReviews"] });
    },
  });
}

export function useUpdateServiceReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (!data) throw new Error("No review data provided");

      const { id, serviceId, orderId, ...reviewData } = data;
      if (!id) throw new Error("No id provided");

      try {
        return await BaseRequest.Put(
          `/${SUB_URL}/updateServiceReview/${id}?serviceId=${serviceId}&orderId=${orderId}`,
          reviewData
        );
      } finally {
        nProgress.done();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceReviews"] });
    },
  });
}

export function useDeleteProductReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!id) throw new Error("No review data provided");

      try {
        return await BaseRequest.Delete(
          `/${SUB_URL}/deleteProductReview/${id}`
        );
      } finally {
        nProgress.done();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productReviews"] });
    },
  });
}
