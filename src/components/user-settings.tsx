"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, User, Lock, Save, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AdminProfileUpdateRQ, adminProfileUpdateSchema } from "@/app/dashboard/user/admin/types/admin.schema"
import { getAdminProfile, updateAdminProfile } from "@/app/dashboard/user/admin/lib/api"
import { ensureAuth } from "@/lib/token"
import router from "next/router"

type View = "main" | "profile" | "password"

interface UserSettingsProps {
  user: {
    firstName: string
    lastName: string
    email: string
    avatar?: string
    dni?: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserSettings({ user, open, onOpenChange }: UserSettingsProps) {
  const [currentView, setCurrentView] = useState<View>("main")

  // Estados para el formulario de perfil
  const [profileData, setProfileData] = useState<AdminProfileUpdateRQ>({
    firstName: "",
    lastName: "",
    birthDate: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AdminProfileUpdateRQ, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof AdminProfileUpdateRQ, boolean>>>({});
  const [loading, setLoading] = useState(false);

  // Estados para el formulario de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (!open) return;

    const fetchProfile = async () => {
      setLoading(true);
      const authOk = await ensureAuth();
      if (!authOk) {
        router.replace("/login"); 
        return;
      }

      try {
        const res = await getAdminProfile();
        if (!res.data) return;

        const { firstName, lastName, birthDate } = res.data;
        setProfileData({
          firstName,
          lastName,
          birthDate: birthDate?.slice(0, 10) || "",
        });
        setErrors({});
        setTouched({});
      } catch (err) {
        console.error("❌ Error al obtener perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [open]);

  function validateProfile(): boolean {
    const result = adminProfileUpdateSchema.safeParse(profileData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        firstName: fieldErrors.firstName?.[0] || "",
        lastName: fieldErrors.lastName?.[0] || "",
        birthDate: fieldErrors.birthDate?.[0] || "",
      });
      return false;
    }
    setErrors({});
    return true;
  }

  async function handleSaveProfile() {
    const isValid = validateProfile();
    if (!isValid) return;

    const authOk = await ensureAuth();
    if (!authOk) {
      router.replace("/login");
      return;
    }

    try {
      setLoading(true);
      await updateAdminProfile(profileData);
      handleClose(); 
    } catch (error) {
      console.error("❌ Error al actualizar perfil:", error);
    } finally {
      setLoading(false);
    }
  }


  const handleClose = () => {
    setCurrentView("main");
    onOpenChange(false);
    setProfileData({
      firstName: "",
      lastName: "",
      birthDate: "",
    });
    setErrors({});
    setTouched({});
  };

  const handleSavePassword = () => {
    // Validar que las contraseñas coincidan
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Las contraseñas nuevas no coinciden")
      return
    }

    // Aquí implementarías la lógica para cambiar la contraseña
    console.log("Cambiando contraseña")
    // Simular cambio exitoso
    handleClose()
  }

  const handleCancel = () => {
    if (currentView === "main") {
      handleClose()
    } else {
      setCurrentView("main")
    }
  }

  function getInitials(firstName?: string, lastName?: string): string {
    const first = firstName?.[0] ?? ""
    const last = lastName?.[0] ?? ""
    const initials = `${first}${last}`.toUpperCase()
    return initials || "US"
  }

  const renderMainView = () => (
    <div className="space-y-6">
      {/* Header con información del usuario */}
      <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatar || "/placeholder.svg?height=64&width=64"} alt={user.firstName} />
          <AvatarFallback className="text-lg">{getInitials(user.firstName, user.lastName)}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* Opciones de configuración */}
      <div className="space-y-2">
        <Button variant="ghost" className="w-full justify-start h-12" onClick={() => setCurrentView("profile")}>
          <User className="mr-3 h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">Editar Perfil</div>
            <div className="text-sm text-muted-foreground">Actualiza tu información personal</div>
          </div>
        </Button>

        <Button variant="ghost" className="w-full justify-start h-12" onClick={() => setCurrentView("password")}>
          <Lock className="mr-3 h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">Cambiar Contraseña</div>
            <div className="text-sm text-muted-foreground">Actualiza tu contraseña de acceso</div>
          </div>
        </Button>
      </div>
    </div>
  )

  const renderProfileView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" onClick={() => setCurrentView("main")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold">Editar Perfil</h3>
      </div>

      <Separator />

      {/* Formulario */}
      <div className="space-y-4">
        {/* Nombre */}
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombre</Label>
          <Input
            id="firstName"
            value={profileData.firstName}
            onChange={(e) => {
              setProfileData((prev) => ({ ...prev, firstName: e.target.value }));
              setTouched((prev) => ({ ...prev, firstName: true }));
            }}
            onBlur={validateProfile}
            placeholder="Ingresa tu nombre"
            className={errors.firstName ? "border-red-500" : ""}
          />
          {touched.firstName && errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName}</p>
          )}
        </div>

        {/* Apellido */}
        <div className="space-y-2">
          <Label htmlFor="lastName">Apellido</Label>
          <Input
            id="lastName"
            value={profileData.lastName}
            onChange={(e) => {
              setProfileData((prev) => ({ ...prev, lastName: e.target.value }));
              setTouched((prev) => ({ ...prev, lastName: true }));
            }}
            onBlur={validateProfile}
            placeholder="Ingresa tu apellido"
            className={errors.lastName ? "border-red-500" : ""}
          />
          {touched.lastName && errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName}</p>
          )}
        </div>

        {/* Fecha de nacimiento */}
        <div className="space-y-2">
          <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
          <Input
            id="birthDate"
            type="date"
            value={profileData.birthDate}
            onChange={(e) => {
              setProfileData((prev) => ({ ...prev, birthDate: e.target.value }));
              setTouched((prev) => ({ ...prev, birthDate: true }));
            }}
            onBlur={validateProfile}
            className={errors.birthDate ? "border-red-500" : ""}
          />
          {touched.birthDate && errors.birthDate && (
            <p className="text-sm text-red-500">{errors.birthDate}</p>
          )}
        </div>
      </div>

      {/* Botones */}
      <div className="flex space-x-3 pt-4">
        <Button onClick={handleSaveProfile} className="flex-1" disabled={loading}>
          <Save className="mr-2 h-4 w-4" />
          {loading ? "Guardando..." : "Guardar"}
        </Button>
        <Button variant="outline" onClick={handleCancel} className="flex-1" disabled={loading}>
          <X className="mr-2 h-4 w-4" />
          Cancelar
        </Button>
      </div>
    </div>
  );

  const renderPasswordView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" onClick={() => setCurrentView("main")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold">Cambiar Contraseña</h3>
      </div>

      <Separator />

      {/* Formulario */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Contraseña Actual</Label>
          <Input
            id="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData((prev) => ({
                ...prev,
                currentPassword: e.target.value,
              }))
            }
            placeholder="Ingresa tu contraseña actual"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">Nueva Contraseña</Label>
          <Input
            id="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData((prev) => ({
                ...prev,
                newPassword: e.target.value,
              }))
            }
            placeholder="Ingresa tu nueva contraseña"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) =>
              setPasswordData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            placeholder="Confirma tu nueva contraseña"
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex space-x-3 pt-4">
        <Button onClick={handleSavePassword} className="flex-1">
          <Save className="mr-2 h-4 w-4" />
          Guardar
        </Button>
        <Button variant="outline" onClick={handleCancel} className="flex-1">
          <X className="mr-2 h-4 w-4" />
          Cancelar
        </Button>
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {currentView === "main" && "Configuración de Usuario"}
            {currentView === "profile" && "Editar Perfil"}
            {currentView === "password" && "Cambiar Contraseña"}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {currentView === "main" && renderMainView()}
          {currentView === "profile" && renderProfileView()}
          {currentView === "password" && renderPasswordView()}
        </div>
      </DialogContent>
    </Dialog>
  )
}
