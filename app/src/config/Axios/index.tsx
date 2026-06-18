import { AxiosError } from "axios";
import axiosInstance from "./axiosInstance";

type ApiResult<T> = {
  type: "success";
  data: T;
};

export async function apiGet<T>(url: string): Promise<ApiResult<T>> {
  try {
    const response = await axiosInstance.get<T>(url);
    return { type: "success", data: response.data };
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function apiPost<T>(
  url: string,
  data?: unknown,
): Promise<ApiResult<T>> {
  try {
    const isFormData =
      typeof FormData !== "undefined" && data instanceof FormData;

    const response = await axiosInstance.post<T>(url, data, {
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" },
    });

    return { type: "success", data: response.data };
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function apiPut<T>(
  url: string,
  data?: unknown,
): Promise<ApiResult<T>> {
  try {
    const response = await axiosInstance.put<T>(url, data);
    return { type: "success", data: response.data };
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function apiDelete<T>(url: string): Promise<ApiResult<T>> {
  try {
    const response = await axiosInstance.delete<T>(url);
    return { type: "success", data: response.data };
  } catch (error) {
    throw handleApiError(error);
  }
}

function handleApiError(error: unknown) {
  if (error instanceof AxiosError) {
    if (error.response?.data) {
      return error.response.data;
    }
    return error.message;
  }

  return error;
}
