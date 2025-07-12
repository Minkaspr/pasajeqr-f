import { refreshTokenIfNeeded } from "@/app/auth/auth";

export function saveTokens({ token, refreshToken, expiresIn }: {
  token: string;
  refreshToken: string;
  expiresIn: number;
}) {
  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", refreshToken);
  const expiration = Date.now() + expiresIn * 1000;
  localStorage.setItem("tokenExpiresAt", expiration.toString());
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

export function isTokenExpired(): boolean {
  const exp = localStorage.getItem("tokenExpiresAt");
  return !exp || Date.now() > parseInt(exp);
}

export function clearTokens() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("tokenExpiresAt");
}

export async function ensureAuth(): Promise<boolean> {
  const token = getToken();
  const refreshToken = getRefreshToken();

  if (!token || !refreshToken) {
    return false; // No hay forma de autenticarse
  }

  if (isTokenExpired()) {
    try {
      await refreshTokenIfNeeded();
      return true;
    } catch (error) {
      console.error("❌ Falló el refresh token:", error);
      clearTokens();
      return false;
    }
  }

  return true;
}
