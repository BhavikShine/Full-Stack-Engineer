import { apiPost } from "../config/Axios";
import { LOGIN, REGISTER } from "../config/Axios/apis";
import { extractErrorMessage } from "../utils/apiError";
import { removeToken, setToken } from "../utils/tokenStorage";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
};

export type RegisterResponse = {
  user_id: string;
  email: string;
  full_name: string;
};

type LoginResponse = {
  token?: string;
  accessToken?: string;
  access_token?: string;
  jwt?: string;
  auth_token?: string;
  data?: {
    token?: string;
    accessToken?: string;
    access_token?: string;
    jwt?: string;
  };
  user?: {
    token?: string;
    access_token?: string;
  };
};

function extractToken(data: LoginResponse): string | null {
  return (
    data?.token ||
    data?.accessToken ||
    data?.access_token ||
    data?.jwt ||
    data?.auth_token ||
    data?.data?.token ||
    data?.data?.accessToken ||
    data?.data?.access_token ||
    data?.data?.jwt ||
    data?.user?.token ||
    data?.user?.access_token ||
    null
  );
}

export async function loginUser(email: string, password: string) {
  const payload: LoginPayload = {
    email: email.trim(),
    password,
  };

  try {
    const response = await apiPost<LoginResponse>(LOGIN, payload);

    if (__DEV__) {
      console.log("Login response:", response);
    }

    const token = extractToken(response.data);

    if (!token) {
      throw new Error("Login successful but no token received.");
    }

    await setToken(token);
    return token;
  } catch (error) {
    if (__DEV__) {
      console.log("Login error:", error);
    }

    throw new Error(extractErrorMessage(error, "Login failed. Please try again."));
  }
}

export async function registerUser(
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string,
): Promise<RegisterResponse> {
  const payload: RegisterPayload = {
    full_name: fullName.trim(),
    email: email.trim(),
    password,
    confirm_password: confirmPassword,
  };

  try {
    const response = await apiPost<RegisterResponse>(REGISTER, payload);

    if (__DEV__) {
      console.log("Register response:", response);
    }

    return response.data;
  } catch (error) {
    if (__DEV__) {
      console.log("Register error:", error);
    }

    throw new Error(
      extractErrorMessage(error, "Registration failed. Please try again."),
    );
  }
}

export async function logoutUser() {
  await removeToken();
}
