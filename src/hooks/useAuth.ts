import { refreshTokenIfNeeded } from "@/app/auth/auth";
import { getRefreshToken, getToken, isTokenExpired } from "@/lib/token";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuth(redirectTo: string = "/auth/login", allowedRoles?: string[]) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      const refreshToken = getRefreshToken();
      const userStr = localStorage.getItem("user");

      if (!token && !refreshToken || !userStr) {
        router.replace(redirectTo);
        return;
      }

      try {
        const user = JSON.parse(userStr);

        if (allowedRoles && !allowedRoles.includes(user.role)) {
          router.replace(redirectTo);
          return;
        }

        if (isTokenExpired()) {
          await refreshTokenIfNeeded();
        }

        setIsChecking(false);
      } catch (error) {
        console.error("Error al verificar sesión:", error);
        router.replace(redirectTo);
      }
    };

    checkAuth();
  }, [router, redirectTo, allowedRoles]);

  return isChecking;
}