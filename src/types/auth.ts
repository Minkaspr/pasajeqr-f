import { Role } from "./roles"

export interface AuthenticatedUser {
  id: number
  firstName: string
  lastName: string
  email: string
  role: Role
}

export interface AuthResponse {
  token: string
  tokenType: "Bearer"
  expiresIn: number
  user: AuthenticatedUser
}

export function getCurrentUser(): AuthenticatedUser | null {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("user")
  return userStr ? JSON.parse(userStr) : null
}