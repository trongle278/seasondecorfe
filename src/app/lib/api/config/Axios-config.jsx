import axios from "axios";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { getSession } from "next-auth/react";

const baseURL = "http://localhost:5297/";

const apiClient = axios.create({
  baseURL,
  //withCredentials: true, // Ensures cookies are sent with requests
});

// Request Interceptor: Attach token from cookies
apiClient.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers["Authorization"] = `Bearer ${session?.accessToken}`;
    }
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    toast.error("Request failed! Please try again.");
    return Promise.reject(error);
  }
);

// apiClient.interceptors.request.use((config) => {
//   console.log("Axios Request Config:", config);
//   return config;
// });

// Response Interceptor: Handle errors and token expiration
apiClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      const { success, message } = response.data;

      if (success && message && response.config.showToast !== false) {
        toast.success(message);
      }
      return response.data;
    }

    toast.error("Unexpected server response. Please try again.");
    return Promise.reject(new Error("Invalid response from server"));
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        handleValidationErrors(data.errors);
      } else if (status === 401) {
        handleUnauthorized();
      } else if (status === 403) {
        toast.error("You do not have permission to perform this action.");
      } else if (status === 500) {
        toast.error("Server error! Please try again later.");
      } else {
        toast.error(data?.message || "An error occurred.");
      }

      return Promise.reject(data);
    }

    toast.error("Network error. Please check your internet connection.");
    return Promise.reject(error);
  }
);

// Utility: Handle validation errors
const handleValidationErrors = (errors) => {
  if (Array.isArray(errors)) {
    errors.forEach((message) => toast.error(message));
  } else if (typeof errors === "object") {
    Object.entries(errors).forEach(([field, messages]) => {
      if (Array.isArray(messages)) {
        messages.forEach((message) => toast.error(`${field}: ${message}`));
      } else {
        toast.error(`${field}: ${messages}`);
      }
    });
  } else {
    toast.error(errors || "An error occurred.");
  }
};

// Utility: Handle unauthorized (401) responses
const handleUnauthorized = () => {
  toast.warning("Please login first !");
  redirect("/authen/login"); 
};

// API request functions
const BaseRequest = {
  Get: async (url, showToast = true) => {
    try {
      const response = await apiClient.get(url, { showToast });
      return response;
    } catch (err) {
      //console.error("GET request error:", err);
      throw err;
    }
  },
  Post: async (url, data, showToast = true) => {
    try {
      const response = await apiClient.post(url, data, {  showToast });
      return response;
    } catch (err) {
      //console.error("POST request error:", err);
      throw err;
    }
  },
  Put: async (url, data, showToast = true) => {
    try {
      const response = await apiClient.put(url, data, { showToast });
      return response;
    } catch (err) {
      //console.error("PUT request error:", err);
      throw err;
    }
  },
  Delete: async (url, showToast = true) => {
    try {
      const response = await apiClient.delete(url, { showToast });
      return response;
    } catch (err) {
      //console.error("DELETE request error:", err);
      throw err;
    }
  },
};

export default BaseRequest;
