import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/AccountManagement`;

const defaultPagination = {
  pageIndex: 1,
  pageSize: 10,
  status: "",
  gender: "",
  isVerified: "",
  isDisabled: "",
  sortBy: "",
  descending: "",
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
        let url = `/${SUB_URL}/getPaginated?`;

        const queryParams = [];

        queryParams.push(`PageIndex=${params.pageIndex}`);
        queryParams.push(`PageSize=${params.pageSize}`);

        if (params.status) queryParams.push(`Status=${params.status}`);
        
        // Handle boolean parameters properly
        if (params.gender !== undefined && params.gender !== "") {
          queryParams.push(`Gender=${params.gender}`);
        }
        
        if (params.isVerified !== undefined && params.isVerified !== "") {
          queryParams.push(`IsVerified=${params.isVerified}`);
        }
        
        if (params.isDisabled !== undefined && params.isDisabled !== "") {
          queryParams.push(`IsDisable=${params.isDisabled}`);
        }
        
        if (params.sortBy) queryParams.push(`SortBy=${params.sortBy}`);
        
        if (params.descending !== undefined) {
          queryParams.push(`Descending=${params.descending}`);
        }

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
