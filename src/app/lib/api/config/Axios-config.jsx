import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { getSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export const BASE_URL = "http://localhost:5297";

let cachedToken = null;
let tokenExpiryTime = null;

const getAndCacheToken = async () => {
  if (cachedToken && tokenExpiryTime && Date.now() < tokenExpiryTime) {
    return cachedToken;
  }

  const session = await getSession();
  if (session?.accessToken) {
    cachedToken = session.accessToken;
    // Set token expiry time (e.g., 5 minutes before actual expiry)
    // Adjust this value based on your token's actual expiry time
    tokenExpiryTime = Infinity;
    return cachedToken;
  }
  return null;
};

const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Request Interceptor: Attach token from cache
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAndCacheToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
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
  async (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 400) {
        handleValidationErrors(data.errors);
      } else if (status === 401) {
        await handleUnauthorized();
        return Promise.reject(data);
      } else if (status === 403) {
        toast.error("You do not have permission to perform this action.");
      } else if (status === 500) {
        toast.error("Server error! Please try again later.");
      } else {
        toast.error(data?.message || "An error occurred.");
      }

      return Promise.reject(data);
    }

    //toast.error("Network error. Please check your internet connection.");
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
const handleUnauthorized = async () => {
  toast.warning("Please login to continue!");
  window.location.href = "/authen/login";
};

// Clear token cache on unauthorized response
const clearTokenCache = () => {
  cachedToken = null;
  tokenExpiryTime = null;
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
      const response = await apiClient.post(url, data, { showToast });
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
