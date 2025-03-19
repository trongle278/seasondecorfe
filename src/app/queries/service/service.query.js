import { useQuery, useMutation } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/DecorService`;

export function useCreateDecorService() {
  return useMutation({
    mutationFn: async (data) => {
      if (!data) throw new Error("No product provided");

      nProgress.start();

      try {
        return await BaseRequest.Post(`/${SUB_URL}/add`, data);
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useGetDecorServiceById(id) {
  return useQuery({
    queryKey: ["decor-service", id],
    queryFn: async (style, province, category, season) => {
      if (!id) throw new Error("No id provided");

      nProgress.start();

      try {
        const res = await BaseRequest.Get(`/${SUB_URL}/${id}`, false);
        return res.data;
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useSearchDecorService(params) {
  return useQuery({
    queryKey: ["search-decor-service", params],
    queryFn: async () => {
      nProgress.start();
      
      try {
        if (!params) {
          const res = await BaseRequest.Get(`/${SUB_URL}/getPaginated`, false);
          return {
            data: res.data.data || [],
            total: res.data.data?.length || 0
          };
        }
        
        // Construct the query string manually to ensure exact parameter format
        const queryParams = [];
        if (params.Province) queryParams.push(`Province=${encodeURIComponent(params.Province)}`);
        if (params.CategoryName) queryParams.push(`CategoryName=${encodeURIComponent(params.CategoryName)}`);
        if (params.SeasonName) queryParams.push(`SeasonName=${encodeURIComponent(params.SeasonName)}`);
        
        const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
        
        const res = await BaseRequest.Get(`/${SUB_URL}/search${queryString}`, false);
        return res;
      } finally {
        nProgress.done();
      }
    },
    enabled: true, // Always enable the query
  });
}
