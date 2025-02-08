import axios from "axios";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

const baseURL = 'http://localhost:5297/';

const onRequestSuccess = (config) => {
    const token = Cookies.get('AT'); // Lấy token từ cookie
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
};

const onRequestError = (error) => Promise.reject(error);

const onResponseSuccess = (response) => response.data;

const onResponseError = (error) => {
    if (error.response) {
        if (error.response.status === 401) {
            redirect('/authen/login');
        }
        return Promise.reject(error.response.data);
    }
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
