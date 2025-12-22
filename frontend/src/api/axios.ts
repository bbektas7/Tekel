import axios, { AxiosResponse, AxiosError } from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle specific error codes
    if (error.response?.status === 401) {
      // Unauthorized - could redirect to login
      console.warn("Unauthorized access - session may have expired");
    }
    return Promise.reject(error);
  }
);

export default api;
