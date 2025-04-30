import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/Quotation`;

export function useCreateQuotation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (!data) throw new Error("No quotation data provided");

      const { bookingCode, ...quotationData } = data;
      if (!bookingCode) throw new Error("No booking code provided");

      nProgress.start();

      try {
        return await BaseRequest.Post(
          `/${SUB_URL}/createQuotationByBookingCode/${bookingCode}`,
          quotationData
        );
      } finally {
        nProgress.done();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_list_quotation_for_customer"] });
    },
  });
}

export function useUploadQuotationFile() {
  return useMutation({
    mutationFn: async (formData) => {
      if (!formData) throw new Error("No quotation file provided");

      // Extract bookingCode from formData
      const bookingCode = formData.get("bookingCode");
      if (!bookingCode) throw new Error("No booking code provided");

      // Create a new FormData with just the file
      const fileFormData = new FormData();
      fileFormData.append("quotationFile", formData.get("file"));

      nProgress.start();

      try {
        // Send the request with bookingCode in the URL path
        return await BaseRequest.Post(
          `/${SUB_URL}/uploadQuotationFileByBookingCode/${bookingCode}`,
          fileFormData
        );
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useGetQuotationDetailByCustomerId(quotationCode) {
  return useQuery({
    queryKey: ["quotation", quotationCode],
    queryFn: async () => {
      const res = await BaseRequest.Get(
        `/${SUB_URL}/getQuotationDetailByCustomer/${quotationCode}`,
        false
      );
      return res.data;
    },
  });
}

export function useConfirmQuotation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (quotationCode) => {
      if (!quotationCode) throw new Error("No quotation code provided");

      nProgress.start();
      try {
        return await BaseRequest.Put(
          `/${SUB_URL}/confirmQuotation/${quotationCode}`,
          true,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } finally {
        nProgress.done();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotation"] });
    },
  });
}

export function useAddProductToQuotation() {
  return useMutation({
    mutationFn: async (data) => {
      try {
        nProgress.start();
        const { quotationCode, productId, quantity } = data;
        
        // Format the URL to match API expectations:
        // /api/Quotation/addProductToQuotation/{quotationCode}?productId=1&quantity=1
        return await BaseRequest.Post(
          `/${SUB_URL}/addProductToQuotation/${quotationCode}?productId=${productId}&quantity=${quantity}`
        );
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useRemoveProductFromQuotation() {
  return useMutation({
    mutationFn: async (data) => {
      try {
        nProgress.start();
        const { quotationCode, productId } = data;
        
        // Format the URL to match API expectations, similar to addProductToQuotation
        return await BaseRequest.Delete(
          `/${SUB_URL}/removeProductFromQuotation/${quotationCode}?productId=${productId}`
        );
      } finally {
        nProgress.done();
      }
    },
  });
}
