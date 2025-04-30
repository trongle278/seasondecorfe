import { useQuery } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";

const SUB_URL = `api/Review`;

const defaultPagination = {
  pageIndex: 1,
  pageSize: 10,
  rate: null,
  sortBy: null,
  descending: true,
};

export function useGetListReviewByService(id, paginationParams = {}, options = {}) {
  const params = {
    ...defaultPagination,
    ...paginationParams,
  };

  return useQuery({
    queryKey: ["get_list_review_by_service", id, params],
    queryFn: async () => {
      if (!id) throw new Error("Service ID is required");
      
      let url = `/${SUB_URL}/getReviewByService/${id}?`;

      const queryParams = [];

      // Only add parameters with actual values
      queryParams.push(`PageIndex=${params.pageIndex}`);
      queryParams.push(`PageSize=${params.pageSize}`);

      if (params.rate !== undefined && params.rate !== null && params.rate !== "") {
        queryParams.push(`Rate=${params.rate}`);
      }

      if (params.sortBy !== undefined && params.sortBy !== null && params.sortBy !== "") {
        queryParams.push(`SortBy=${params.sortBy}`);
      }

      if (params.descending !== undefined && params.descending !== null) {
        queryParams.push(`Descending=${params.descending}`);
      }

      url += queryParams.join("&");

      const res = await BaseRequest.Get(url, false);
      return res.data;
    },
    enabled: !!id && (options?.enabled !== false),
    ...options,
  });
}

export function useGetListReviewByProduct(id, paginationParams = {}, options = {}) {
    const params = {
      ...defaultPagination,
      ...paginationParams,
    };
  
    return useQuery({
      queryKey: ["get_list_review_by_product", id, params],
      queryFn: async () => {
        if (!id) throw new Error("Product ID is required");
        
        let url = `/${SUB_URL}/getReviewByProduct/${id}?`;
  
        const queryParams = [];
  
        // Only add parameters with actual values
        queryParams.push(`PageIndex=${params.pageIndex}`);
        queryParams.push(`PageSize=${params.pageSize}`);
  
        if (params.rate !== undefined && params.rate !== null && params.rate !== "") {
          queryParams.push(`Rate=${params.rate}`);
        }
  
        if (params.sortBy !== undefined && params.sortBy !== null && params.sortBy !== "") {
          queryParams.push(`SortBy=${params.sortBy}`);
        }
  
        if (params.descending !== undefined && params.descending !== null) {
          queryParams.push(`Descending=${params.descending}`);
        }
  
        url += queryParams.join("&");
  
        const res = await BaseRequest.Get(url, false);
        return res.data;
      },
      enabled: !!id && (options?.enabled !== false),
      ...options,
    });
  }
