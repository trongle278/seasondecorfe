import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";

const SUB_URL = `api/Dashboard`;

export function useGetAdminDashboard() {
  return useQuery({
    queryKey: ["get_admin_dashboard"],
    queryFn: async () => {
      const res = await BaseRequest.Get(`${SUB_URL}/getAdminDashboard`);
      return res.data;
    },
  });
}

export function useGetAdminMonthlyRevenue() {
  return useQuery({
    queryKey: ["get_admin_monthly_revenue"],
    queryFn: async () => {
      const res = await BaseRequest.Get(`${SUB_URL}/getAdminMonthlyRevenue`);
      return res.data;
    },
  });
}

export function useGetTopProviderRating() {
  return useQuery({
    queryKey: ["get_top_provider_rating"],
    queryFn: async () => {
      const res = await BaseRequest.Get(`${SUB_URL}/getTopProviderRatingRanking`);
      return res.data;
    },
  });
}