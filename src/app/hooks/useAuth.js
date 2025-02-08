import { useSession } from "next-auth/react";

export default function useAuth() {
  const { data: session } = useSession();

  return { user: session?.user, token: session?.accessToken };
}
