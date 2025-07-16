"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, User, Lock, Save, X, Eye, EyeOff } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AdminProfileUpdateRQ, adminProfileUpdateSchema, ChangePasswordForm, changePasswordSchema } from "@/app/dashboard/user/admin/types/admin.schema"
import { changeAdminPassword, getAdminProfile, updateAdminProfile } from "@/app/dashboard/user/admin/lib/api"
import { ensureAuth } from "@/lib/token"
import router from "next/router"
import { cn } from "@/lib/utils"

type View = "main" | "profile" | "password"

interface UserSettingsProps {
  user: {
    id: number
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
  const [passwordData, setPasswordData] = useState<ChangePasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [passwordErrors, setPasswordErrors] = useState<Partial<Record<keyof ChangePasswordForm, string>>>({});
  const [passwordTouched, setPasswordTouched] = useState<Partial<Record<keyof ChangePasswordForm, boolean>>>({});
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


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
    // Limpiar formulario de perfil
    setProfileData({
      firstName: "",
      lastName: "",
      birthDate: "",
    });
    setErrors({});
    setTouched({});

    // Limpiar formulario de contraseña
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordErrors({});
    setPasswordTouched({});
  };

  async function handleSavePassword() {
    setPasswordTouched({
      currentPassword: true,
      newPassword: true,
      confirmPassword: true,
    });

    const isValid = validatePassword();
    if (!isValid) return;

    const authOk = await ensureAuth();
    if (!authOk) {
      router.replace("/login");
      return;

    }

    try {
      setPasswordLoading(true);
      const { currentPassword, newPassword } = passwordData;

      // Aquí va la llamada a la API para cambiar la contraseña
      // await changePassword({ currentPassword, newPassword });
      await changeAdminPassword(user.id, {
        currentPassword,
        newPassword,
      });

      console.log("Simulación: contraseña cambiada exitosamente");
      handleClose(); // cerrar modal si todo fue bien
    } catch (error) {
      console.error("❌ Error al cambiar la contraseña:", error);
      // Aquí podrías usar toast o mostrar un error general
    } finally {
      setPasswordLoading(false);
    }
  }

  const handleCancel = () => {
    if (currentView === "main") {
      handleClose()
    } else {
      setCurrentView("main")
    }
  }

  function validatePassword(): boolean {
    const result = changePasswordSchema.safeParse(passwordData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setPasswordErrors({
        currentPassword: fieldErrors.currentPassword?.[0],
        newPassword: fieldErrors.newPassword?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      });
      return false;
    }
    setPasswordErrors({});
    return true;
  }

  function resetPasswordForm() {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordErrors({});
    setPasswordTouched({});
    setPasswordLoading(false);
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
        <Button variant="ghost" size="icon" 
        onClick={() => {
          resetPasswordForm();
          setCurrentView("main");
        }}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold">Cambiar Contraseña</h3>
      </div>

      <Separator />

      {/* Formulario */}
      <div className="space-y-4">
        {/* Contraseña actual */}
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Contraseña Actual</Label>
          <div className="relative">
            <Input
              id="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              value={passwordData.currentPassword}
              onChange={(e) => {
                setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }));
                setPasswordTouched((prev) => ({ ...prev, currentPassword: true }));
                validatePassword();
              }}
              onBlur={() => {
                setPasswordTouched((prev) => ({ ...prev, currentPassword: true }));
                validatePassword();
              }}
              placeholder="Ingresa tu contraseña actual"
              className={cn(
                passwordTouched.currentPassword && passwordErrors.currentPassword &&
                "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/40"
              )}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-primary focus:outline-none"
              tabIndex={-1}
            >
              {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {passwordTouched.currentPassword && passwordErrors.currentPassword && (
            <p className="text-sm text-red-500">{passwordErrors.currentPassword}</p>
          )}
        </div>

        {/* Nueva contraseña */}
        <div className="space-y-2">
          <Label htmlFor="newPassword">Nueva Contraseña</Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={passwordData.newPassword}
              onChange={(e) => {
                setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }));
                setPasswordTouched((prev) => ({ ...prev, newPassword: true }));
                validatePassword();
              }}
              onBlur={() => {
                setPasswordTouched((prev) => ({ ...prev, newPassword: true }));
                validatePassword();
              }}
              placeholder="Ingresa tu nueva contraseña"
              className={cn(
                passwordTouched.newPassword && passwordErrors.newPassword &&
                "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/40"
              )}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-primary focus:outline-none"
              tabIndex={-1}
            >
              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {passwordTouched.newPassword && passwordErrors.newPassword && (
            <p className="text-sm text-red-500">{passwordErrors.newPassword}</p>
          )}
        </div>

        {/* Confirmar contraseña */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={passwordData.confirmPassword}
              onChange={(e) => {
                setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }));
                setPasswordTouched((prev) => ({ ...prev, confirmPassword: true }));
                validatePassword();
              }}
              onBlur={() => {
                setPasswordTouched((prev) => ({ ...prev, confirmPassword: true }));
                validatePassword();
              }}
              placeholder="Confirma tu nueva contraseña"
              className={cn(
                passwordTouched.confirmPassword && passwordErrors.confirmPassword &&
                "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/40"
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-primary focus:outline-none"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {passwordTouched.confirmPassword && passwordErrors.confirmPassword && (
            <p className="text-sm text-red-500">{passwordErrors.confirmPassword}</p>
          )}
        </div>
      </div>

      {/* Botones */}
      <div className="flex space-x-3 pt-4">
        <Button onClick={handleSavePassword} className="flex-1" disabled={passwordLoading}>
          <Save className="mr-2 h-4 w-4" />
          {passwordLoading ? "Guardando..." : "Guardar"}
        </Button>
        <Button variant="outline" onClick={handleCancel} className="flex-1" disabled={passwordLoading}>
          <X className="mr-2 h-4 w-4" />
          Cancelar
        </Button>
      </div>
    </div>
  );


  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        handleClose();
      } else {
        onOpenChange(true); 
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {currentView === "main" && "Configuración de Usuario"}
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
