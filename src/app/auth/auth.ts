import { saveTokens, isTokenExpired, getRefreshToken, clearTokens } from "@/lib/token";

export async function registerUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  dni: string
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_V1_URL;

  const requestBody = { firstName, lastName, email, password, dni };

  console.log("Cuerpo de la solicitud:", JSON.stringify(requestBody));

  const response = await fetch(`${apiUrl}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const responseData = await response.json();
  console.log("Respuesta de la API:", responseData);

  if (!response.ok) {
    throw new Error(
      responseData?.errors?.email ||
      responseData?.message ||
      "Error al registrar usuario."
    );
  }

  return responseData;
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_V1_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok || data.status !== 200) throw new Error(data.message || "Login failed");

  saveTokens({
    token: data.data.token,
    refreshToken: data.data.refreshToken,
    expiresIn: data.data.expiresIn,
  });

  localStorage.setItem("user", JSON.stringify(data.data.user));

  return data.data.user;
}

export async function refreshTokenIfNeeded() {
  if (!isTokenExpired()) return;

  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_V1_URL}/auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await res.json();
  if (!res.ok || data.status !== 200) throw new Error("Refresh failed");

  saveTokens({
    token: data.data.token,
    refreshToken: data.data.refreshToken,
    expiresIn: data.data.expiresIn,
  });
  
}

export async function logoutUser() {
  try {
    const refreshToken = getRefreshToken();

    if (refreshToken) {
      await fetch(`${process.env.NEXT_PUBLIC_API_V1_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });
    }
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  } finally {
    clearTokens(); 
    localStorage.removeItem("user"); 
  }
}