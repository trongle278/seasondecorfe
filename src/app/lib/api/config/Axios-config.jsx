import axios from "axios";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { toast } from "sonner";

const baseURL = "http://localhost:5297/";

const onRequestSuccess = (config) => {
  const token = Cookies.get("AT"); // Lấy token từ cookie
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  config.headers["Content-Type"] = "application/json";
  return config;
};

const onRequestError = (error) => {
  toast.error("Request failed! Please try again.");
  return Promise.reject(error);
};

const onResponseSuccess = (response) => {
  if (response && response.data) {
    if (response.data.success && response.data.message) {
      toast.success(response.data.message);
    }
    return response.data;
  }

  // Handle unexpected cases where response is undefined
  toast.error("Unexpected server response. Please try again.");
  return Promise.reject(new Error("Invalid response from server"));
};

const onResponseError = (error) => {
  if (error.response) {
    const { status, data } = error.response;

    if (status === 400) {
      if (Array.isArray(data.errors)) {
        // Case 1: errors is an array of strings
        data.errors.forEach((message) => {
          toast.error(message);
        });
      } else if (typeof data.errors === "object") {
        // Case 2: errors is an object with field-specific messages
        Object.entries(data.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach((message) => {
              toast.error(`${field}: ${message}`);
            });
          } else {
            toast.error(`${field}: ${messages}`);
          }
        });
      } else {
        // Default fallback
        toast.error(data.message || "An error occurred.");
      }
    } else if (status === 401) {
      toast.warning("Session expired. Redirecting to login...");
      redirect("/authen/login");
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
};

axios.interceptors.request.use(onRequestSuccess, onRequestError);
axios.interceptors.response.use(onResponseSuccess, onResponseError);
axios.defaults.baseURL = baseURL;

const BaseRequest = {
  Get: async (url) => {
    try {
      return await axios.get(url);
    } catch (err) {
      console.error("GET request error:", err);
      throw err;
    }
  },
  Post: async (url, data) => {
    try {
      return await axios.post(url, data);
    } catch (err) {
      console.error("POST request error:", err);
      throw err;
    }
  },
  Put: async (url, data) => {
    try {
      return await axios.put(url, data);
    } catch (err) {
      console.error("PUT request error:", err);
      throw err;
    }
  },
  Delete: async (url) => {
    try {
      return await axios.delete(url);
    } catch (err) {
      console.error("DELETE request error:", err);
      throw err;
    }
  },
};

export default BaseRequest;
