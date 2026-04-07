import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getToken } from "./auth";

interface RequestConfig extends AxiosRequestConfig {
  private?: boolean;
}

const request = <T = any>(config: RequestConfig): Promise<AxiosResponse<T>> => {
  const { private: isPrivate, ...axiosConfig } = config;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(axiosConfig.headers as Record<string, string>),
  };

  if (isPrivate) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  // Add X-Client-Id header if active client is set
  const activeClientId = typeof window !== 'undefined' 
    ? localStorage.getItem('bipro-active-client-id')
    : null;
  
  if (activeClientId && activeClientId !== 'null') {
    headers["X-Client-Id"] = activeClientId;
  }

  const baseURL = process.env.NEXT_PUBLIC_URL_API || "";

  return axios({
    baseURL,
    ...axiosConfig,
    headers,
  }).catch((error) => {
    if (error.response) {
      return Promise.reject(error.response);
    }
    return Promise.reject(error);
  });
};

export default request;
