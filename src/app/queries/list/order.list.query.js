import { useQuery } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/Order`;

const defaultPagination = {
  pageIndex: 1,
  pageSize: 10,
  status: null,
  sortBy: "",
  descending: true,
};

export function useGetOrderList(paginationParams = {}) {
  const params = {
    ...defaultPagination,
    ...paginationParams,
  };
  return useQuery({
    queryKey: ["order_list", params],
    queryFn: async () => {
      nProgress.start();
      try {
        let url = `/${SUB_URL}/getPaginatedList?`;

        const queryParams = [];

        queryParams.push(`PageIndex=${params.pageIndex}`);
        queryParams.push(`PageSize=${params.pageSize}`);

        // Include status (even if it's 0)
        if (params.status !== undefined) {
          queryParams.push(`Status=${params.status}`);
        }

        // Optional parameters
        if (params.sortBy) {
          queryParams.push(`SortBy=${params.sortBy}`);
        }

        if (params.descending) {
          queryParams.push(`Descending=${params.descending}`);
        }

        // Join all parameters with &
        url += queryParams.join("&");


        const res = await BaseRequest.Get(url, false);
        if (res && typeof res === "object") {
          if (res.data) {
            return res.data;
          } else if (Array.isArray(res)) {
            return {
              data: res,
              totalCount: res.length,
              totalPages: Math.ceil(res.length / params.pageSize),
            };
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

export function useGetOrderListByProvider(paginationParams = {}) {
  const params = {
    ...defaultPagination,
    ...paginationParams,
  };
  return useQuery({
    queryKey: ["order_list_by_provider", params],
    queryFn: async () => {
      nProgress.start();
      try {
        let url = `/${SUB_URL}/getPaginatedListForProvider?`;

        const queryParams = [];

        queryParams.push(`PageIndex=${params.pageIndex}`);
        queryParams.push(`PageSize=${params.pageSize}`);

        // Include status (even if it's 0)
        if (params.status !== undefined) {
          queryParams.push(`Status=${params.status}`);
        }

        // Optional parameters
        if (params.sortBy) {
          queryParams.push(`SortBy=${params.sortBy}`);
        }

        if (params.descending) {
          queryParams.push(`Descending=${params.descending}`);
        }

        // Join all parameters with &
        url += queryParams.join("&");


        const res = await BaseRequest.Get(url, false);
        if (res && typeof res === "object") {
          if (res.data) {
            return res.data;
          } else if (Array.isArray(res)) {
            return {
              data: res,
              totalCount: res.length,
              totalPages: Math.ceil(res.length / params.pageSize),
            };
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
