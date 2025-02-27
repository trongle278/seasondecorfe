import { useQuery, useMutation } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";

const SUB_URL = `api/Provider`;

export function useSendInvitation() {
  //const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["send_invitation"],
    mutationFn: async ({ email }) => {
      return BaseRequest.Post(
        `/${SUB_URL}/send-invitation?email=${email}`,
        email
      );
    },
    onError: (error) => {
      console.error("Error sending invitation:", error.message);
    },
  });
}

export function useCreateProviderProfile() {
  //const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create_provider_profile"],
    mutationFn: async ({data}) => {
      return BaseRequest.Post(`/${SUB_URL}/create-profile`, data);
    },
    onError: (error) => {
      console.error("Error create profile:", error.message);
    },
  });
}
