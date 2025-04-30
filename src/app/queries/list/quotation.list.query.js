import { useQuery } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import { useSelector } from "react-redux";

const SUB_URL = `api/Quotation`;


const defaultPagination = {
  pageIndex: 1,
  pageSize: 10,
  //quotationCode: "",
  //status: "",
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

        if (params.quotationCode !== undefined && params.quotationCode !== null)
          queryParams.push(`QuotationCode=${params.quotationCode}`);

        if (params.status !== undefined && params.status !== null) {
          queryParams.push(`Status=${params.status}`);
        }

        if (params.sortBy) queryParams.push(`SortBy=${params.sortBy}`);
        if (params.descending !== undefined)
          queryParams.push(`Descending=${params.descending}`);

        url += queryParams.join("&");

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

        if (params.quotationCode !== undefined && params.quotationCode !== null)
          queryParams.push(`QuotationCode=${params.quotationCode}`);

        if (params.status) queryParams.push(`Status=${params.status}`);

        if (params.sortBy) queryParams.push(`SortBy=${params.sortBy}`);
        if (params.descending !== undefined)
          queryParams.push(`Descending=${params.descending}`);

        url += queryParams.join("&");

        const res = await BaseRequest.Get(url, false);
        return res.data;
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useGetListRelatedProduct(paginationParams = {}, quotationCode, isStatusChecked = false) {
  const isQuoteExisted = useSelector((state) => state.quotation.quotationExisted);
  const isQuoteConfirmed = useSelector((state) => state.quotation.quotationConfirmed);
  const params = {
    ...defaultPagination,
    ...paginationParams,
  };
  return useQuery({
    queryKey: ["get_list_related_product", params, quotationCode, isStatusChecked],
    queryFn: async () => {
      nProgress.start();
      try {
        let url = `/${SUB_URL}/getPaginatedRelatedProduct?`;

        const queryParams = [];

        queryParams.push(`PageIndex=${params.pageIndex}`);
        queryParams.push(`PageSize=${params.pageSize}`);
        
        queryParams.push(`QuotationCode=${quotationCode}`);

        url += queryParams.join("&");

        const res = await BaseRequest.Get(url, false);
        return res.data;
      } finally {
        nProgress.done();
      }
    },
    enabled: isStatusChecked && !!isQuoteExisted && !isQuoteConfirmed,
  });
}
