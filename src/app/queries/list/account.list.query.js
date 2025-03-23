import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import { useUser } from "@/app/providers/userprovider";

const SUB_URL = `api/AccountManagement`;

const defaultPagination = {
    pageIndex: 1,
    pageSize: 10,
    status: "",
    gender: "",
    isVerified: "",
    isDisabled: "",
    sortBy: "",
    descending: ""
  };

export function useGetListAccount(paginationParams = {}) {
  const params = {
    ...defaultPagination,
    ...paginationParams,
  };
  return useQuery({
    queryKey: ["account_list", params],
    queryFn: async () => {
      nProgress.start();
      try {
        let url = `/${SUB_URL}/getPaginated`;

        url += `?PageIndex=${params.pageIndex}`;

        url += `&PageSize=${params.pageSize}`;

        if (params.status)
          url += `&Status=${encodeURIComponent(params.status)}`;
        if (params.gender) url += `&Gender=${params.gender}`;
        if (params.isVerified) url += `&IsVerified=${params.isVerified}`;
        if (params.isDisabled) url += `&IsDisabled=${params.isDisabled}`;
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