import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/Dashboard`;

const defaultPagination = {
  pageIndex: 1,
  pageSize: 10,
  paymentType: "",
  sortBy: "",
  descending: false,
};

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
      const res = await BaseRequest.Get(
        `${SUB_URL}/getTopCustomerSpendingRanking`
      );
      return res.data;
    },
  });
}

export function useGetPaginatedProviderTransactions(paginationParams = {}) {
  const params = {
    ...defaultPagination,
    ...paginationParams,
  };

  return useQuery({
    queryKey: ["get_paginated_provider_transactions", params],
    queryFn: async () => {
      nProgress.start();
      try {
        let url = `/${SUB_URL}/getProviderPaginatedPaymentTransaction`;

        url += `?PageIndex=${params.pageIndex}`;

        url += `&PageSize=${params.pageSize}`;

        if (params.paymentType) url += `&PaymentType=${params.paymentType}`;

        if (params.sortBy) url += `&SortBy=${params.sortBy}`;

        if (params.descending !== undefined)
          url += `&Descending=${params.descending}`;

        const res = await BaseRequest.Get(url, false);

        if (res && typeof res === "object") {
          if (res.data) {
            return res.data;
          }
        }
        return {
          data: [],
          totalCount: 0,
          totalPages: 0,
        };
      } finally {
        nProgress.done();
      }
    },
    keepPreviousData: true,
    staleTime: 30000,
  });
}
