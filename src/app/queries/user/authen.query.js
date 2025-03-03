import { useQuery, useMutation } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import { signIn } from "next-auth/react";
import { toast } from "sonner";


const SUB_URL = `api/Auth`;

export function useRegisterCustomer() {
  return useMutation({
    mutationFn: async (userData) => {
      nProgress.start();
      console.log("Registering user:", userData);
      try {
        const res = await BaseRequest.Post(
          `/${SUB_URL}/register-customer`,
          userData
        );
        //console.log("Registration successful:", res.data);
        return res.data;
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: async (userData) => {
      nProgress.start();
      console.log("Verifying email:", userData);
      try {
        const res = await BaseRequest.Post(
          `/${SUB_URL}/verify-email`,
          userData
        );
        //console.log("Verification successful:", res.data);
        return res.data;
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async ({ email, password }) => {
      nProgress.start();
      try {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (!result || result.error) {
          toast.error(result.error);
        }

        return result;
      } finally {
        nProgress.done();
      }
    },
  });
}
