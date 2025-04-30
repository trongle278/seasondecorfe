import { useQuery} from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import { useUser } from "@/app/providers/userprovider";

const SUB_URL = `api/Notification`;

export function useGetNotifications() {
  const { user } = useUser();
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await BaseRequest.Get(
        `/${SUB_URL}/getAllNotifications`,
        false
      );
      return res.data;
    },
    enabled: !!user?.id,
    staleTime: 30000,
  });
}
