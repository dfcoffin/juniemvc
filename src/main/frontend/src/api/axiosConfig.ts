import type {AxiosInstance, AxiosRequestConfig} from "axios";
import axios, {AxiosError} from "axios";
import {getEnvConfig} from "../utils/env";

// Get environment configuration
const { apiBaseUrl } = getEnvConfig();

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 seconds
});

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth token here when authentication is implemented
    // const token = getToken();
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle API errors globally here
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("API Error Response:", error.response.data);
      console.error("Status:", error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("API Error Request:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("API Error Message:", error.message);
    }

    return Promise.reject(error);
  },
);

// Helper functions for common operations
export const apiService = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T>(url, config).then((response) => response.data),

  post: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) =>
    axiosInstance.post<T>(url, data, config).then((response) => response.data),

  put: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) =>
    axiosInstance.put<T>(url, data, config).then((response) => response.data),

  patch: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) =>
    axiosInstance.patch<T>(url, data, config).then((response) => response.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T>(url, config).then((response) => response.data),
};

export default axiosInstance;
