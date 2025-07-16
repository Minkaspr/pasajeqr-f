"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, User, Lock, Settings, Mail, LogOut } from "lucide-react"

interface PassengerSettingsProps {
  user?: {
    firstName: string
    lastName: string
    email: string
  }
  onBackClick?: () => void
  onUpdateProfile?: (data: { firstName: string; lastName: string }) => void
  onUpdatePassword?: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => void
  onLogout?: () => void
}

export default function PassengerSettings({
  user = { firstName: "Juan", lastName: "Pérez", email: "juan.perez@email.com" },
  onBackClick,
  onUpdateProfile,
  onUpdatePassword,
  onLogout,
}: PassengerSettingsProps) {
  const [profileData, setProfileData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
  })

  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)


  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingProfile(true)

    // Simular llamada a API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onUpdateProfile?.(profileData)
    setIsUpdatingProfile(false)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }

    if (passwordData.newPassword.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setIsUpdatingPassword(true)

    // Simular llamada a API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onUpdatePassword?.(passwordData)
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    setIsUpdatingPassword(false)
  }

  const router = useRouter()
  const handleLogout = () => {
    router.push("/")
    onLogout?.()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 sm:h-16">
            <Button variant="ghost" size="sm" onClick={onBackClick} className="mr-2 sm:mr-4">
              <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Atrás</span>
            </Button>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">SC</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Empresa Santa Catalina</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Settings className="h-5 w-6" />
            Configuración
          </h2>
          <p className="text-sm sm:text-base text-gray-600">Gestiona tu perfil y configuración de cuenta</p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="profile" className="flex items-center gap-2 text-xs sm:text-sm">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Perfil</span>
                  <span className="sm:hidden">Info</span>
                </TabsTrigger>
                <TabsTrigger value="password" className="flex items-center gap-2 text-xs sm:text-sm">
                  <Lock className="h-4 w-4" />
                  Contraseña
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-0">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg sm:text-xl">Información del Perfil</CardTitle>
                    <CardDescription className="text-sm">Actualiza tu información personal</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileSubmit} className="space-y-4 sm:space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-sm font-medium">
                            Nombres
                          </Label>
                          <Input
                            id="firstName"
                            value={profileData.firstName}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, firstName: e.target.value }))}
                            placeholder="Ingresa tus nombres"
                            className="h-10 sm:h-11"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-sm font-medium">
                            Apellidos
                          </Label>
                          <Input
                            id="lastName"
                            value={profileData.lastName}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, lastName: e.target.value }))}
                            placeholder="Ingresa tus apellidos"
                            className="h-10 sm:h-11"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Correo Electrónico
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={user.email}
                          disabled
                          className="bg-gray-50 h-10 sm:h-11"
                        />
                        <p className="text-xs text-gray-500">El correo electrónico no se puede modificar</p>
                      </div>

                      <Button
                        type="submit"
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                        disabled={isUpdatingProfile}
                        size="lg"
                      >
                        {isUpdatingProfile ? "Actualizando..." : "Actualizar Perfil"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="password" className="mt-0">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg sm:text-xl">Cambiar Contraseña</CardTitle>
                    <CardDescription className="text-sm">
                      Actualiza tu contraseña para mantener tu cuenta segura
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4 sm:space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-sm font-medium">
                          Contraseña Actual
                        </Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                          placeholder="Ingresa tu contraseña actual"
                          className="h-10 sm:h-11"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-sm font-medium">
                          Nueva Contraseña
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                          placeholder="Ingresa tu nueva contraseña"
                          className="h-10 sm:h-11"
                          required
                          minLength={6}
                        />
                        <p className="text-xs text-gray-500">Mínimo 6 caracteres</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium">
                          Confirmar Nueva Contraseña
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                          placeholder="Confirma tu nueva contraseña"
                          className="h-10 sm:h-11"
                          required
                          minLength={6}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                        disabled={isUpdatingPassword}
                        size="lg"
                      >
                        {isUpdatingPassword ? "Actualizando..." : "Actualizar Contraseña"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            {/* Simple Logout Button */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 bg-transparent"
                size="lg"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
