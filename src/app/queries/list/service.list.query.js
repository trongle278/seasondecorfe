import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/DecorService`;

const defaultPagination = {
  pageIndex: 1,
  pageSize: 10,
  subLocation: "",
  style: "",
  minPrice: "",
  maxPrice: "",
  sortBy: "",
  descending: false,
  seasonId: "",
};

export function useGetListDecorService(paginationParams = defaultPagination) {
  const params = {
    ...defaultPagination,
    ...paginationParams,
  };

  return useQuery({
    queryKey: ["get_list_decor_service", params],
    queryFn: async () => {
      nProgress.start();
      try {
        // Always use the paginated endpoint
        let url = `/${SUB_URL}/getPaginated?`;

        const queryParams = [];

        queryParams.push(`PageIndex=${params.pageIndex}`);
        queryParams.push(`PageSize=${params.pageSize}`);

        if (params.productName) {
          queryParams.push(`ProductName=${params.productName}`);
        }
        if (params.minPrice) {
          queryParams.push(`MinPrice=${params.minPrice}`);
        }
        if (params.maxPrice) {
          queryParams.push(`MaxPrice=${params.maxPrice}`);
        }
        if (params.sortBy) {
          queryParams.push(`SortBy=${params.sortBy}`);
        }
        if (params.descending !== undefined) {
          queryParams.push(`Descending=${params.descending}`);
        }

        url += queryParams.join("&");
        const res = await BaseRequest.Get(url, false);

        if (res?.data) {
          return {
            data: res.data.data || [],
            totalCount: res.data.totalCount || 0,
            totalPages: res.data.totalPages || 0,
            pageIndex: res.data.pageIndex || params.pageIndex,
            pageSize: res.data.pageSize || params.pageSize,
          };
        }

        return {
          data: [],
          totalCount: 0,
          totalPages: 0,
          pageIndex: params.pageIndex,
          pageSize: params.pageSize,
        };
      } finally {
        nProgress.done();
      }
    },
    keepPreviousData: true,
    staleTime: 30000,
  });
}

export function useGetDecorServiceListByProvider(paginationParams = {}) {
  const params = {
    ...defaultPagination,
    ...paginationParams,
  };

  return useQuery({
    queryKey: ["decor_service_list_by_provider", params],
    queryFn: async () => {
      nProgress.start();
      try {
        let url = `/${SUB_URL}/getDecorServiceListByProvider?`;

        url += `&PageIndex=${params.pageIndex}`;

        url += `&PageSize=${params.pageSize}`;

        if (params.productName)
          url += `&ProductName=${encodeURIComponent(params.productName)}`;
        if (params.minPrice) url += `&MinPrice=${params.minPrice}`;
        if (params.maxPrice) url += `&MaxPrice=${params.maxPrice}`;
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

export function useGetDecorServiceListForCustomer(paginationParams = {}) {
  const params = {
    ...defaultPagination,
    ...paginationParams,
  };

  return useQuery({
    queryKey: ["decor_service_list_for_customer", params, params.providerId],
    queryFn: async () => {
      nProgress.start();
      try {
        let url = `/${SUB_URL}/getDecorServiceListByCustomer?`;

        url += `&PageIndex=${params.pageIndex}`;

        url += `&PageSize=${params.pageSize}`;

        if (params.providerId) url += `&providerId=${params.providerId}`;

        if (params.productName)
          url += `&ProductName=${encodeURIComponent(params.productName)}`;
        if (params.minPrice) url += `&MinPrice=${params.minPrice}`;
        if (params.maxPrice) url += `&MaxPrice=${params.maxPrice}`;
        if (params.sortBy)
          url += `&SortBy=${encodeURIComponent(params.sortBy)}`;

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
