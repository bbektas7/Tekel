import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - safety net for duplicate /api prefix
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Fix duplicate /api prefix: if URL starts with /api/, strip it
    // since baseURL already includes /api
    if (config.url?.startsWith("/api/")) {
      config.url = config.url.slice(4); // Remove "/api" prefix
      if (import.meta.env.DEV) {
        console.warn(
          `[API] Fixed duplicate /api prefix. Original: /api${config.url}, Fixed: ${config.url}`
        );
      }
    }

    // Log final URL in development mode
    if (import.meta.env.DEV) {
      const finalUrl = `${config.baseURL}${config.url}`;
      console.debug(`[API] ${config.method?.toUpperCase()} ${finalUrl}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
