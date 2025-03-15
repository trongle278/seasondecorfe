import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import { useUser } from "@/app/providers/userprovider";

const SUB_URL = `api/contact`;

export function useGetListContact() {
  const { user } = useUser();
  return useQuery({
    queryKey: ["get_list_contact"],
    queryFn: async () => {
      const res = await BaseRequest.Get(`/${SUB_URL}/contacts`, false);
      return res.data;
    },
    enabled: !!user,
  });
}
