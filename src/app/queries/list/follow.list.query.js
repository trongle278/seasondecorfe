import { useQuery } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import { useUser } from "@/app/providers/userprovider";

const SUB_URL = `api/Follow`;

export function useGetFollowing() {
  const { user } = useUser();
  return useQuery({
    queryKey: ["following"],
    queryFn: async () => {
      nProgress.start();
      try {
        const res = await BaseRequest.Get(`/${SUB_URL}/followings`, false);
        return res.data;
      } finally {
        nProgress.done();
      }
    },
    enabled: !!user,
  });
}

export function useGetFollower() {
  const { user } = useUser();
  return useQuery({
    queryKey: ["followers"],
    queryFn: async () => {
      nProgress.start();
      try {
        const res = await BaseRequest.Get(`/${SUB_URL}/followers`, false);
        return res.data;
      } finally {
        nProgress.done();
      }
    },
    enabled: !!user,
  });
}

export function useGetFollowCount() {
  return useQuery({
    queryKey: ["follow-count"],
    queryFn: async () => {
      const res = await BaseRequest.Get(`/${SUB_URL}/counts`, false);
      return res.data;
    },
  });
}
