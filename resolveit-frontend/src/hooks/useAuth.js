import { useState, useEffect } from "react";
import { authApi, saveToken, clearToken, getToken } from "../services/api";

/**
 * useAuth
 * Manages auth state using the real Spring Boot backend.
 * user shape: { id, email, firstName, lastName, fullName, role, ... }
 */
export function useAuth() {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      authApi.me()
        .then(data => setUser(data))
        .catch(() => clearToken())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function login(email, password) {
    setLoading(true);
    try {
      const data = await authApi.login(email, password); // { token, user }
      saveToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "Login failed" };
    } finally {
      setLoading(false);
    }
  }

  async function register(formData) {
    setLoading(true);
    try {
      const data = await authApi.register(formData);
      saveToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "Registration failed" };
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  return { user, loading, login, register, logout };
}
