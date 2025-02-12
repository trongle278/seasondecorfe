import axios from "axios";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { toast } from "sonner";

const baseURL = "http://localhost:5297/";

const apiClient = axios.create({
  baseURL,
  withCredentials: true, // Ensures cookies are sent with requests
});

// Request Interceptor: Attach token from cookies
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("AT");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {
    toast.error("Request failed! Please try again.");
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors and token expiration
apiClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      if (response.data.success && response.data.message) {
        toast.success(response.data.message);
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
  toast.warning("Session expired. Redirecting to login...");
  Cookies.remove("AT"); // Clear expired token
  redirect("/authen/login"); // Redirect user to login page
};

// API request functions
const BaseRequest = {
  Get: async (url) => {
    try {
      return await apiClient.get(url);
    } catch (err) {
      console.error("GET request error:", err);
      throw err;
    }
  },
  Post: async (url, data) => {
    try {
      return await apiClient.post(url, data);
    } catch (err) {
      console.error("POST request error:", err);
      throw err;
    }
  },
  Put: async (url, data) => {
    try {
      return await apiClient.put(url, data);
    } catch (err) {
      console.error("PUT request error:", err);
      throw err;
    }
  },
  Delete: async (url) => {
    try {
      return await apiClient.delete(url);
    } catch (err) {
      console.error("DELETE request error:", err);
      throw err;
    }
  },
};

export default BaseRequest;
