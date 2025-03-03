import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BaseRequest from "@/app/lib/api/config/Axios-config";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const SUB_URL = `api/Follow`;

export function useGetFollowing() {
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
  });
}

export function useGetFollower() {
  return useQuery({
    queryKey: ["follower"],
    queryFn: async () => {
      nProgress.start();
      try {
        const res = await BaseRequest.Get(`/${SUB_URL}/followers`, false);
        return res.data;
      } finally {
        nProgress.done();
      }
    },
  });
}
