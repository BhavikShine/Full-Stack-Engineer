import axios from "axios";
import { URL } from "../url.config";
import { getToken, removeToken } from "../../utils/tokenStorage";
import { notifySessionExpired } from "../../utils/authSession";
import { resetToLogin } from "../../navigation/navigationRef";
import {
  logApiError,
  logApiRequest,
  logApiResponse,
} from "../../utils/apiLogger";
import { shouldHandleSessionExpiry } from "../../utils/apiError";

const axiosInstance = axios.create({
  baseURL: URL.api,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    logApiRequest(config);
    return config;
  },
  (error) => {
    logApiError(error);
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    logApiResponse(response);
    return response;
  },
  async (error) => {
    logApiError(error);

    if (
      shouldHandleSessionExpiry(
        error?.response?.status,
        error?.config?.url,
      )
    ) {
      await removeToken();
      notifySessionExpired();
      resetToLogin();
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
