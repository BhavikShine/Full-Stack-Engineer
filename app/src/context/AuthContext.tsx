import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  loginUser,
  logoutUser,
  registerUser,
  type RegisterResponse,
} from "../services/authService";
import { getToken } from "../utils/tokenStorage";
import { setOnSessionExpired } from "../utils/authSession";

type AuthContextType = {
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<RegisterResponse>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await getToken();
        setTokenState(storedToken);
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
    setOnSessionExpired(() => setTokenState(null));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const newToken = await loginUser(email, password);
    setTokenState(newToken);
  }, []);

  const register = useCallback(
    async (
      fullName: string,
      email: string,
      password: string,
      confirmPassword: string,
    ) => {
      return registerUser(fullName, email, password, confirmPassword);
    },
    [],
  );

  const logout = useCallback(async () => {
    await logoutUser();
    setTokenState(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
