"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/app/auth/auth";
import { PasswordTooltipIcon } from "./password-tooltip-icon";
import { Eye, EyeOff } from "lucide-react";
import { FieldError } from "./field-error";
import { motion } from "framer-motion";

export default function RegisterCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dni, setDni] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formValid, setFormValid] = useState(false);

  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    dni: false,
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dni: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  
  const validateFields = useCallback(() => {
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/;
    
    const newErrors = {
      firstName:
        firstName.trim().length < 6
        ? "Debe tener al menos 6 caracteres"
        : !nameRegex.test(firstName.trim())
        ? "Solo se permiten letras"
        : firstName !== firstName.trim()
        ? "No debe comenzar ni terminar con espacios"
        : "",

      lastName:
        lastName.trim().length < 6
        ? "Debe tener al menos 6 caracteres"
        : !nameRegex.test(lastName.trim())
        ? "Solo se permiten letras"
        : lastName !== lastName.trim()
        ? "No debe comenzar ni terminar con espacios"
        : "",
      email: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)
        ? ""
        : "Correo no válido",
      password: password.includes(" ")
        ? "La contraseña no puede contener espacios"
        : !/(?=.*[a-z])/.test(password)
        ? "Debe tener al menos una letra minúscula"
        : !/(?=.*[A-Z])/.test(password)
        ? "Debe tener al menos una letra mayúscula"
        : !/(?=.*\d)/.test(password)
        ? "Debe tener al menos un número"
        : !/(?=.*[@#\$%*_\-])/.test(password)
        ? "Debe tener al menos un símbolo: @ # $ % * _ -"
        : !/^[A-Za-z\d@#\$%*_\-]+$/.test(password)
        ? "Solo se permiten letras, números y símbolos: @ # $ % * _ -"
        : password.length < 8
        ? "Debe tener al menos 8 caracteres"
        : "",

      dni: dni.includes(" ")
        ? "No se permiten espacios"
        : !/^\d+$/.test(dni)
        ? "Solo se permiten números"
        : dni.length !== 8
        ? "Debe tener 8 dígitos"
        : "",
    };

    setErrors(newErrors);
    setFormValid(Object.values(newErrors).every((e) => e === ""));
  }, [firstName, lastName, email, password, dni]);


  useEffect(() => {
    validateFields();
  }, [validateFields]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await registerUser(
        firstName,
        lastName,
        email,
        password,
        dni
      );

      if (response.status === 201) {
        window.location.href = "/auth/login";
      } else {
        setError(response.message || "Error al registrar usuario.");
      }
    } catch (error) {
      console.log("Error al registrar usuario:", error);
      setError("Hubo un problema al registrar el usuario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Crear cuenta</CardTitle>
          <CardDescription>
            Completa el formulario para registrarte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {/* Nombre */}
              <div className="grid gap-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Juan"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (!touched.firstName) {
                      setTouched((prev) => ({ ...prev, firstName: true }));
                    }
                  }}
                  onBlur={() => handleBlur("firstName")}
                  className={cn(
                    touched.firstName && errors.firstName
                      ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/40"
                      : ""
                  )}
                />
                <FieldError show={!!touched.firstName && !!errors.firstName} message={errors.firstName} />
              </div>

              {/* Apellido */}
              <div className="grid gap-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Pérez"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (!touched.lastName) {
                      setTouched((prev) => ({ ...prev, lastName: true }));
                    }
                  }}
                  onBlur={() => handleBlur("lastName")}
                  className={cn(
                    touched.lastName && errors.lastName
                      ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/40"
                      : ""
                  )}
                />
                <FieldError
                  show={!!touched.lastName && !!errors.lastName}
                  message={errors.lastName}
                />
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (!touched.email) {
                      setTouched((prev) => ({ ...prev, email: true }));
                    }
                  }}
                  onBlur={() => handleBlur("email")}
                  className={cn(
                    touched.email && errors.email
                      ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/40"
                      : ""
                  )}
                />
                <FieldError
                  show={!!touched.email && !!errors.email}
                  message={errors.email}
                />
              </div>

              {/* Contraseña */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <PasswordTooltipIcon />
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (!touched.password) {
                        setTouched((prev) => ({ ...prev, password: true }));
                      }
                    }}
                    onBlur={() => handleBlur("password")}
                    className={cn(
                      "pr-10",
                      touched.password && errors.password
                        ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/40"
                        : ""
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
                <FieldError
                  show={!!touched.password && !!errors.password}
                  message={errors.password}
                />
              </div>

              {/* DNI */}
              <div className="grid gap-2">
                <Label htmlFor="dni">DNI</Label>
                <Input
                  id="dni"
                  type="text"
                  placeholder="12345678"
                  value={dni}
                  onChange={(e) => {
                    setDni(e.target.value);
                    if (!touched.dni) {
                      setTouched((prev) => ({ ...prev, dni: true }));
                    }
                  }}
                  onBlur={() => handleBlur("dni")}
                  className={cn(touched.dni && errors.dni
                      ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/40"
                      : "")}
                />
                <FieldError
                  show={!!touched.dni && !!errors.dni}
                  message={errors.dni}
                />
              </div>

              {/* Error general */}
              {error && (
                <motion.p layout className="text-red-500 text-sm">
                  {error}
                </motion.p>
              )}

              {/* Botón */}
              <Button type="submit" className="w-full" disabled={!formValid || loading}>
                {loading ? "Cargando..." : "Registrarse"}
              </Button>

              {/* Enlace a login */}
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
