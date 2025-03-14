import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SUB_URL = `api/Provider`;

export function useSendInvitation() {
  return useMutation({
    mutationKey: ["send_invitation"],
    mutationFn: async ({ email }) => {
      nProgress.start();
      try {
        return await BaseRequest.Post(
          `/${SUB_URL}/send-invitation?email=${email}`,
          email
        );
      } finally {
        nProgress.done();
      }
    },
    onError: (error) => {
      console.error("Error sending invitation:", error.message);
    },
  });
}

export function useCreateProviderProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create_provider_profile"],
    mutationFn: async (data) => {
      nProgress.start();
      try {
        return await BaseRequest.Post(`/${SUB_URL}/create-profile`, data);
      } finally {
        nProgress.done();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accountDetails"] });
    },
    onError: (error) => {
      console.error("Error creating profile:", error);
    },
  });
}

export function useCreateProviderAvatar() {
  return useMutation({
    mutationKey: ["create_provider_avatar"],
    mutationFn: async (data) => {
      nProgress.start();
      try {
        return await BaseRequest.Put(
          `/${SUB_URL}/upload-provider-avatar`,
          data
        );
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useChangeStatus() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationKey: ["change_status"],
    mutationFn: async (status) => {
      nProgress.start();
      try {
        return await BaseRequest.Put(`/${SUB_URL}/change-status`, status);
      } finally {
        nProgress.done();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accountDetails"] });
    },
    onError: () => {
      toast.info("Please apply for provider first !");
      console.error("Error changing status:", error.message);
    },
  });
}

export function useGetProviderProfile() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["provider_profile"],
    queryFn: async () => {
      nProgress.start();
      try {
        const res = await BaseRequest.Get(`/${SUB_URL}/myprofile`, false);
        return res.data;
      } finally {
        nProgress.done();
      }
    },
  });
}

export function useGetProviderBySlug(slug) {
  return useQuery({
    queryKey: ["get_provider_by_slug", slug],
    queryFn: async () => {
      if (!slug) return null;
      nProgress.start();
      try {
        const res = await BaseRequest.Get(
          `/${SUB_URL}/profile/${slug}`,
          false
        );
        return res.data;
      } finally {
        nProgress.done();
      }
    },
  });
}
