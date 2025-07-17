import { refreshTokenIfNeeded } from "@/app/auth/auth"
import { getRefreshToken, getToken, isTokenExpired } from "@/lib/token"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function useAuth(redirectTo: string = "/auth/login", allowedRoles?: string[]) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getToken()
        const refreshToken = getRefreshToken()
        const userStr = localStorage.getItem("user")

        // 🔴 Si falta el refresh token o los datos del usuario
        if (!refreshToken || !userStr) {
          router.replace(redirectTo)
          return
        }

        const user = JSON.parse(userStr)

        // 🔒 Verifica roles si se especificaron
        if (allowedRoles && !allowedRoles.includes(user.role)) {
          router.replace(redirectTo)
          return
        }

        // ⏳ Si el token está expirado, intenta renovarlo
        if (!token || isTokenExpired()) {
          await refreshTokenIfNeeded()
        }

        // ✅ Todo OK
        setIsChecking(false)
      } catch (error) {
        console.error("❌ Error al verificar sesión:", error)
        router.replace(redirectTo)
      }
    }

    checkAuth()
  }, [router, redirectTo, allowedRoles])

  return isChecking
}
