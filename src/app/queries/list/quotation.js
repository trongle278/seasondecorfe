import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/Quotation`;

const defaultPagination = {
  pageIndex: 1,
  pageSize: 10,
  status: "",
  sortBy: "",
  descending: false,
};

export function useGetListQuotationForCustomer(paginationParams = {}) {
  const params = {
    ...defaultPagination,
    ...paginationParams,
  };
  return useQuery({
    queryKey: ["get_list_quotation_for_customer", params],
    queryFn: async () => {
      nProgress.start();
      try {
        let url = `/${SUB_URL}/getPaginatedQuotationsForCustomer?`;

        const queryParams = [];

        queryParams.push(`PageIndex=${params.pageIndex}`);
        queryParams.push(`PageSize=${params.pageSize}`);

        if (params.status !== undefined && params.status !== null) {
          queryParams.push(`Status=${params.status}`);
        }

        if (params.sortBy) queryParams.push(`SortBy=${params.sortBy}`);
        if (params.descending !== undefined) queryParams.push(`Descending=${params.descending}`);

        url += queryParams.join('&');

        const res = await BaseRequest.Get(url, false);
        return res.data;
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useGetListQuotationForProvider(paginationParams = {}) {
  const params = {
    ...defaultPagination,
    ...paginationParams,
  };
  return useQuery({
    queryKey: ["get_list_quotation_for_provider", params],
    queryFn: async () => {
      nProgress.start();
      try {
        let url = `/${SUB_URL}/getPaginatedQuotationsForProvider?`;

        const queryParams = [];

        queryParams.push(`PageIndex=${params.pageIndex}`);
        queryParams.push(`PageSize=${params.pageSize}`);

        if (params.status) queryParams.push(`Status=${params.status}`);

        if (params.sortBy) queryParams.push(`SortBy=${params.sortBy}`);
        if (params.descending !== undefined) queryParams.push(`Descending=${params.descending}`);

        url += queryParams.join('&');

        const res = await BaseRequest.Get(url, false);
        return res.data;
      } finally {
        nProgress.done();
      }
    },
  });
}

