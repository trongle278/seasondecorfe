import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/DecorService`;


const defaultPagination = {
  pageIndex: 1,
  pageSize: 10,
  productName: "",
  minPrice: "",
  maxPrice: "",
  sortBy: "",
  descending: false
};



export function useGetListDecorService(paginationParams = {}) {
  const params = {
    ...defaultPagination,
    ...paginationParams,
  };
  return useQuery({
    queryKey: ["get_list_decor_service", params],
    queryFn: async () => {
      nProgress.start();
      try {
        let url = `/${SUB_URL}/getPaginated`;

        url += `?PageIndex=${params.pageIndex}`;

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


        if (res && typeof res === 'object') {
          if (res.data) {
            return res.data.data;
          } else if (Array.isArray(res)) {
            return {
              data: res,
              totalCount: res.length,
              totalPages: Math.ceil(res.length / params.pageSize)
            };
          }
        }
        return {
          data: [],
          totalCount: 0,
          totalPages: 0
        };
      } finally {
        nProgress.done();
      }
    },
    keepPreviousData: true, 
    staleTime: 30000, 
  });
}



export function useGetDecorServiceByProvider(slug, paginationParams = {}) {
  const params = {
    ...defaultPagination,
    ...paginationParams,
  };

  return useQuery({
    queryKey: ["decor_service_list_by_provider", slug, params],
    queryFn: async () => {
      nProgress.start();
      try {
        let url = `/${SUB_URL}/getDecorServiceByProvider?Slug=${slug}`;

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


        if (res && typeof res === 'object') {
          if (res.data) {
            return res.data;
          } else if (Array.isArray(res)) {
            return {
              data: res,
              totalCount: res.length,
              totalPages: Math.ceil(res.length / params.pageSize)
            };
          }
        }
        return {
          data: [],
          totalCount: 0,
          totalPages: 0
        };
      } finally {
        nProgress.done();
      }
    },
    enabled: !!slug,
    keepPreviousData: true, 
    staleTime: 30000, 
  });
}
