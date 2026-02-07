import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "nexgencrm.auth";
const API_BASE_URL = "http://localhost:5500";

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const readStoredAuth = () => {
  const localValue = localStorage.getItem(STORAGE_KEY);
  if (localValue) {
    return safeParse(localValue);
  }

  const sessionValue = sessionStorage.getItem(STORAGE_KEY);
  if (sessionValue) {
    return safeParse(sessionValue);
  }

  return null;
};

const writeStoredAuth = (data, remember) => {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const clearStoredAuth = () => {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => readStoredAuth());

  const login = async ({ email, password, remember }) => {
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        return {
          ok: false,
          message: errorBody.message || "Invalid email or password.",
        };
      }

      const data = await response.json();
      console.log("Login successful:", data);
      const payload = {
        token: data.token,
        user: data.user,
        loginAt: new Date().toISOString(),
      };

      writeStoredAuth(payload, remember);
      setAuth(payload);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: "Unable to reach the server." };
    }
  };

  const logout = () => {
    clearStoredAuth();
    setAuth(null);
  };

  const value = useMemo(
    () => ({
      user: auth?.user ?? null,
      token: auth?.token ?? null,
      isAuthenticated: Boolean(auth?.token),
      login,
      logout,
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AUTH_STORAGE_KEY = STORAGE_KEY;
