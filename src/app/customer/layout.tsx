"use client"

import { useAuth } from "@/hooks/useAuth";

export default function CustomerLayout(
  { children }: Readonly<{ children: React.ReactNode }>
) {
  const loading = useAuth("/auth/login", ["PASSENGER"]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-medium text-muted-foreground">Verificando sesión...</p>
      </div>
    );
  }
  return (
    <div >
      {children}
      Hola :D 
    </div>
  );
}
