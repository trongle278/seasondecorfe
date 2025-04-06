import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/Booking`;

const defaultPagination = {
  pageIndex: 1,
  pageSize: 10,
  status: "",
  decorServiceId: "",
  sortBy: "",
  descending: false,
};

export function useGetPaginatedBookingsForCustomer(paginationParams = {}) {
  const params = {
    ...defaultPagination,
    ...paginationParams,
  };
  return useQuery({
    queryKey: ["booking-list-for-customer", params],
    queryFn: async () => {
      nProgress.start();
      try {
        let url = `/${SUB_URL}/getPaginatedBookingsForCustomer`;

        url += `?PageIndex=${params.pageIndex}`;

        url += `&PageSize=${params.pageSize}`;

        if (params.status)
          url += `&Status=${encodeURIComponent(params.status)}`;
        if (params.decorServiceId)
          url += `&DecorServiceId=${params.decorServiceId}`;
        if (params.sortBy)
          url += `&SortBy=${encodeURIComponent(params.sortBy)}`;
        if (params.descending !== undefined)
          url += `&Descending=${params.descending}`;

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

export function useGetPaginatedBookingsForProvider(paginationParams = {}) {
  const params = {
    ...defaultPagination,
    ...paginationParams,
  };
  return useQuery({
    queryKey: ["booking-list-for-provider", params],
    queryFn: async () => {
      nProgress.start();
      try {
        let url = `/${SUB_URL}/getPaginatedBookingsForProvider?`;

        const queryParams = [];

        queryParams.push(`PageIndex=${params.pageIndex}`);
        queryParams.push(`PageSize=${params.pageSize}`);

        if (params.status) queryParams.push(`Status=${params.status}`);
        if (params.decorServiceId)
          queryParams.push(`DecorServiceId=${params.decorServiceId}`);
        if (params.sortBy) queryParams.push(`SortBy=${params.sortBy}`);
        if (params.descending !== undefined)
          queryParams.push(`Descending=${params.descending}`);

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
