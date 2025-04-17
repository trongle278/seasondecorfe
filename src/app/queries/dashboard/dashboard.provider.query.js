import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";

const SUB_URL = `api/Dashboard`;

export function useGetProviderDashboard() {
  return useQuery({
    queryKey: ["get_provider_dashboard"],
    queryFn: async () => {
      const res = await BaseRequest.Get(`${SUB_URL}/getProviderDashboard`);
      return res.data;
    },
  });
}

export function useGetMonthlyRevenue() {
  return useQuery({
    queryKey: ["get_monthly_revenue"],
    queryFn: async () => {
      const res = await BaseRequest.Get(`${SUB_URL}/getMonthlyRevenue`);
      return res.data;
    },
  });
}

export function useGeTopCustomerSpending() {
  return useQuery({
    queryKey: ["get_top_customer_spending"],
    queryFn: async () => {
      const res = await BaseRequest.Get(`${SUB_URL}/getTopCustomerSpendingRanking`);
      return res.data;
    },
  });
}
