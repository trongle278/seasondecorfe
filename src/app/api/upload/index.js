import BaseRequest from "@/app/lib/api/config/Axios-config";
import { useQueryClient } from "@tanstack/react-query";
import { queryClient } from "@/app/providers/providers";

const SUB_URL = `api/AccountProfile`;

export const UserProfileUpdate = () => {
  const queryClient = useQueryClient();

  // Upload avatar API call
  const uploadAvatar = async (file) => {
    if (!file) {
      console.log("no file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await BaseRequest.Put(`/${SUB_URL}/avatar`, formData);

      queryClient.invalidateQueries(["accountDetails"]);

      return response;
    } catch (err) {
      return err;
    }
  };

  // Update profile API call
  const updateProfile = async (profileData) => {
    try {
      const response = await BaseRequest.Put(
        `/${SUB_URL}/update-account`,
        profileData
      );

      queryClient.invalidateQueries(["accountDetails"]);

      return response.data;
    } catch (err) {
      return err;
    }
  };

  return {
    uploadAvatar,
    updateProfile,
  };
};
