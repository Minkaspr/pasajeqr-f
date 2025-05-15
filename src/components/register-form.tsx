"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/app/auth/auth";

export default function RegisterCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dni, setDni] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formValid, setFormValid] = useState(false);

  // Validar todo el formulario
  useEffect(() => { // Validación individual
    const isFirstNameValid  = firstName.trim().length >= 8;
    const isLastNameValid  = lastName.trim().length >= 8;
    const isEmailValid = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email);
    const isPasswordValid = password.length >= 6;
    const isDniValid = /^\d{8}$/.test(dni);
  
    setFormValid(
      isFirstNameValid &&
      isLastNameValid &&
      isEmailValid &&
      isPasswordValid &&
      isDniValid);
  }, [firstName, lastName, email, password, dni]); // Validar todo el formulario

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await registerUser(firstName, lastName, email, password, dni);

      if (response.status === 201) {
        window.location.href = "/auth/login";
      } else {
        setError(response.message || "Error al registrar usuario.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Hubo un problema al registrar el usuario.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Crear cuenta</CardTitle>
          <CardDescription>Completa el formulario para registrarte</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Juan"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nombre">Apellido</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Pérez"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Mínimo 6 caracteres</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dni">DNI</Label>
                <Input
                  id="dni"
                  type="text"
                  placeholder="12345678"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={!formValid || loading}>
                {loading ? "Cargando..." : "Registrarse"}
              </Button>
              <div className="text-center text-sm">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/auth/login" className="underline underline-offset-4">
                  Inicia sesión
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        Al registrarte, aceptas nuestros{" "}
        <a href="#">Términos de servicio</a> y{" "}
        <a href="#">Política de privacidad</a>.
      </div>
    </div>
  );
}
