import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

import { clearAuthSession, getAccessToken, getRefreshToken, setAuthSession } from "@/lib/auth/session";
import { normalizeApiError } from "./error-handler";
import { API_BASE_URL, endpoints } from "./endpoints";

const UNAUTHORIZED_EVENT = "rateddocs:unauthorized";

export function dispatchUnauthorizedEvent() {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
}

export function onUnauthorizedSession(callback: () => void) {
  if (typeof window === "undefined") return () => undefined;

  window.addEventListener(UNAUTHORIZED_EVENT, callback);

  return () => window.removeEventListener(UNAUTHORIZED_EVENT, callback);
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export function attachInterceptors(client: AxiosInstance) {
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const apiError = normalizeApiError(error);

      if (apiError.status === 401 && !originalRequest._retry) {
        if (originalRequest.url === endpoints.auth.refreshToken) {
          clearAuthSession();
          dispatchUnauthorizedEvent();
          return Promise.reject(apiError);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return client(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          clearAuthSession();
          dispatchUnauthorizedEvent();
          isRefreshing = false;
          return Promise.reject(apiError);
        }

        try {
          const response = await axios.post(`${API_BASE_URL}${endpoints.auth.refreshToken}`, {
            refresh: refreshToken,
          });

          // DRF SimpleJWT can return access (or token)
          const access = response.data?.access || response.data?.accessToken || response.data?.data?.access;
          const refresh = response.data?.refresh || response.data?.refreshToken || response.data?.data?.refresh;

          if (access) {
            setAuthSession({
              accessToken: access,
              refreshToken: refresh || refreshToken,
            });

            originalRequest.headers.Authorization = `Bearer ${access}`;
            processQueue(null, access);
            isRefreshing = false;

            return client(originalRequest);
          } else {
            throw new Error("Token refresh response did not contain access token");
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          clearAuthSession();
          dispatchUnauthorizedEvent();
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(apiError);
    },
  );

  return client;
}

