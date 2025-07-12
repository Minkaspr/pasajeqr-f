"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeOff, Eye } from "lucide-react";
import { loginUser } from "@/app/auth/auth";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const isEmailValid = email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/);
  const isPasswordValid = password.length >= 8;

  const isFormValid = isEmailValid && isPasswordValid;

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!isFormValid) {
      setEmailTouched(true);
      setPasswordTouched(true);
      return;
    }

    try {
      const user = await loginUser(email, password);

      const role = user.role;

      if (role === "ADMIN") {
        router.replace("/dashboard");
      } else if (role === "PASSENGER") {
        router.replace("/customer");
      } else {
        setServerError("Rol no reconocido. Contacte al administrador.");
      }
    } catch (error) {
      console.error("Error al hacer login:", error);
      setServerError("Error de conexión con el servidor");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Iniciar sesión</CardTitle>
          <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {/* Email */}
              <div className="grid gap-1.5">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  placeholder="tucorreo@ejemplo.com"
                  className={cn(
                    emailTouched && !isEmailValid &&
                    "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/40"
                  )}
                />
                <p
                  className={cn(
                    "text-xs text-red-500 transition-all duration-300",
                    emailTouched && !isEmailValid ? "opacity-100 mt-1" : "opacity-0 h-0"
                  )}
                >
                  Por favor ingresa un correo válido
                </p>
              </div>

              {/* Password */}
              <div className="grid gap-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setPasswordTouched(true)}
                    className={cn(
                      passwordTouched && !isPasswordValid &&
                      "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/40"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-primary focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p
                  className={cn(
                    "text-xs text-red-500 transition-all duration-300",
                    passwordTouched && !isPasswordValid ? "opacity-100 mt-1" : "opacity-0 h-0"
                  )}
                >
                  La contraseña debe tener al menos 8 caracteres
                </p>
              </div>

              {/* Botón */}
              <Button type="submit" className="w-full">
                Iniciar sesión
              </Button>

              {/* Error del servidor */}
              {serverError && (
                <div className="text-red-500 text-sm text-center transition-all duration-300">
                  {serverError}
                </div>
              )}

              {/* Enlace a registro */}
              <div className="text-center text-sm">
                ¿No tienes una cuenta?{" "}
                <Link href="/auth/register" className="underline underline-offset-4">
                  Regístrate
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        Al continuar, aceptas nuestros{" "}
        <a href="#">Términos de servicio</a> y{" "}
        <a href="#">Política de privacidad</a>.
      </div>
    </div>
  );
}
