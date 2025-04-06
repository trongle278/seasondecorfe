import { useQuery, useMutation } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/Quotation`;

export function useCreateQuotation() {
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
  });
}

export function useUploadQuotationFile() {
  return useMutation({
    mutationFn: async (formData) => {
      if (!formData) throw new Error("No quotation file provided");

      nProgress.start();

      try {
        // Using formData directly for file upload
        return await BaseRequest.Post(
          `/${SUB_URL}/uploadQuotationFileByBookingCode`, 
          formData,
        );
      } finally {
        nProgress.done();
      }
    },
  });
}
