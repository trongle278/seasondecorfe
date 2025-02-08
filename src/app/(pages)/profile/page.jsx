"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Profile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/authen/login");
      return;
    }

    if (session?.user) {
      fetchUserProfile(session.user.id); // Gọi API lấy thông tin user theo ID
    }
  }, [session, status]);

  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get(`/api/Account/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name || "User"}</h2>
      <p className="text-gray-600">Email: {user?.email}</p>
      {user?.image && (
        <img src={user.image} alt="Profile" className="w-20 h-20 rounded-full mt-4" />
      )}
    </div>
  );
};

export default Profile;
