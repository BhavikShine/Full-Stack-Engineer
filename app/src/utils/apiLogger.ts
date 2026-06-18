import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const SENSITIVE_KEYS = ["password", "confirm_password", "token", "access_token"];

function maskSensitiveData(data: unknown): unknown {
  if (!data || typeof data !== "object") {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(maskSensitiveData);
  }

  return Object.entries(data as Record<string, unknown>).reduce(
    (acc, [key, value]) => {
      acc[key] = SENSITIVE_KEYS.includes(key) ? "***" : maskSensitiveData(value);
      return acc;
    },
    {} as Record<string, unknown>,
  );
}

function getRequestUrl(config: InternalAxiosRequestConfig) {
  return `${config.baseURL ?? ""}${config.url ?? ""}`;
}

export function logApiRequest(config: InternalAxiosRequestConfig) {
  if (!__DEV__) {
    return;
  }

  console.log("📤 API Request:", {
    method: config.method?.toUpperCase(),
    url: getRequestUrl(config),
    params: config.params,
    data: maskSensitiveData(config.data),
  });
}

export function logApiResponse(response: AxiosResponse) {
  if (!__DEV__) {
    return;
  }

  console.log("📥 API Response:", {
    method: response.config.method?.toUpperCase(),
    url: getRequestUrl(response.config),
    status: response.status,
    data: maskSensitiveData(response.data),
  });
}

export function logApiError(error: AxiosError) {
  if (!__DEV__) {
    return;
  }

  console.log("❌ API Error:", {
    method: error.config?.method?.toUpperCase(),
    url: error.config ? getRequestUrl(error.config) : undefined,
    status: error.response?.status,
    data: maskSensitiveData(error.response?.data),
    message: error.message,
  });
}
