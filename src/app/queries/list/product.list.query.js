import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/Product`;


const defaultPagination = {
  pageIndex: 1,
  pageSize: 10,
  productName: "",
  minPrice: "",
  maxPrice: "",
  sortBy: "",
  descending: false
};

export function useGetListProduct(paginationParams = {}) {
  const params = {
    ...defaultPagination,
    ...paginationParams,
  };
  return useQuery({
    queryKey: ["product_list", params],
    queryFn: async () => {
      nProgress.start();
      try {
        let url = `/${SUB_URL}/getPaginatedList`;

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
    keepPreviousData: true, 
    staleTime: 30000, 
  });
}

export function useGetProductByCategoryId(categoryId, paginationParams = {}) {
  const params = {
    ...defaultPagination,
    ...paginationParams,
  };
  return useQuery({
    queryKey: ["product_list_by_category", categoryId, params],
    queryFn: async () => {
      nProgress.start();
      try {
        let url = `/${SUB_URL}/getPaginatedListByCategory?CategoryId=${categoryId}`;

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
    keepPreviousData: true, 
    staleTime: 30000, 
  });
}


export function useGetProductByProvider(slug, paginationParams = {}) {
  const params = {
    ...defaultPagination,
    ...paginationParams,
  };

  return useQuery({
    queryKey: ["product_list_by_provider", slug, params],
    queryFn: async () => {
      nProgress.start();
      try {
        let url = `/${SUB_URL}/getPaginatedListByProvider?Slug=${slug}`;

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
