import { Eye, EyeOff, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { createDriver } from "../lib/api"
import { useDriverRefresh } from "../client/DriverRefreshContext"
import { driverCreateSchema, DriverCreateSchema } from "../validations/driverSchema"
import { FieldError } from "@/components/field-error"
import { cn } from "@/lib/utils"
import { PasswordTooltipIcon } from "@/components/password-tooltip-icon"

export function DriverAdd() {
  const refresh = useDriverRefresh();
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState<DriverCreateSchema>({
    firstName: "",
    lastName: "",
    dni: "",
    email: "",
    password: "",
    licenseNumber: "",
  });

  const [touched, setTouched] = useState<Record<keyof DriverCreateSchema, boolean>>({
    firstName: false,
    lastName: false,
    dni: false,
    email: false,
    password: false,
    licenseNumber: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof DriverCreateSchema, string>>>({});
  const [formValid, setFormValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBlur = (field: keyof DriverCreateSchema) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (!touched[name as keyof DriverCreateSchema]) {
      setTouched((prev) => ({ ...prev, [name]: true }));
    }
  };

  const validate = useCallback(() => {
    const result = driverCreateSchema.safeParse(form);
    const newErrors: Partial<Record<keyof DriverCreateSchema, string>> = {};

    if (!result.success) {
      for (const key in result.error.flatten().fieldErrors) {
        const message = result.error.flatten().fieldErrors[key as keyof DriverCreateSchema]?.[0];
        if (message) {
          newErrors[key as keyof DriverCreateSchema] = message;
        }
      }
    }

    setErrors(newErrors);
    setFormValid(Object.keys(newErrors).length === 0);
  }, [form]);

  useEffect(() => {
    validate();
  }, [validate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    validate();

    if (!formValid) return;

    try {
      setLoading(true);
      await createDriver(form);
      toast.success("Conductor creado correctamente");
      setForm({
        firstName: "",
        lastName: "",
        dni: "",
        email: "",
        password: "",
        licenseNumber: "",
      });
      setTouched({
        firstName: false,
        lastName: false,
        dni: false,
        email: false,
        password: false,
        licenseNumber: false,
      });
      setOpen(false);
      refresh();
    } catch (err: unknown) {
      let message = "Error desconocido";

      if (err instanceof Error) {
        message = err.message;
      }

      console.error("Error al crear conductor:", message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (
    id: keyof DriverCreateSchema,
    label: string,
    type: string = "text",
    placeholder?: string
  ) => (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id} className="text-right">
        {label}
      </Label>
      <div className="col-span-3">
        <Input
          id={id}
          name={id}
          type={type}
          value={form[id]}
          onChange={handleChange}
          onBlur={() => handleBlur(id)}
          placeholder={placeholder}
          className={
            touched[id] && errors[id]
              ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/40"
              : ""
          }
        />
        <FieldError show={!!touched[id] && !!errors[id]} message={errors[id]} />
      </div>
    </div>
  );
  const [formKey, setFormKey] = useState(0);
  useEffect(() => {
    if (!open) {
      // Resetear formulario cuando el modal se cierra
      setForm({
        firstName: "",
        lastName: "",
        dni: "",
        email: "",
        password: "",
        licenseNumber: "",
      });
      setErrors({});
      setTouched({
        firstName: false,
        lastName: false,
        dni: false,
        email: false,
        password: false,
        licenseNumber: false,
      });
      setFormValid(false);
      setShowPassword(false); // Opcional
      setFormKey((prev) => prev + 1);
    }
  }, [open]);

  return (
    <div className="flex items-center justify-end">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <PlusIcon className="mr-2 h-4 w-4" />
            Añadir Conductor
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir nuevo conductor</DialogTitle>
            <DialogDescription>
              Completa los campos para crear un nuevo conductor.
            </DialogDescription>
          </DialogHeader>

          <form className="grid gap-4 py-4" key={formKey} onSubmit={handleSubmit}>
            {renderField("firstName", "Nombres")}
            {renderField("lastName", "Apellidos")}
            {renderField("dni", "DNI")}
            {renderField("email", "Correo", "email")}
            {/* Password */}
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="flex flex-row gap-2">
                <Label htmlFor="password" className="text-right">
                  Contraseña
                </Label>
                <PasswordTooltipIcon />
              </div>
              <div className="col-span-3">
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur("password")}
                    className={cn(
                      touched.password && errors.password &&
                        "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/40"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
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
                <FieldError show={!!touched.password && !!errors.password} message={errors.password} />
              </div>
            </div>

            {renderField("licenseNumber", "Licencia")}

            <div className="flex justify-end">
              <Button type="submit" disabled={!formValid || loading}>
                {loading ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
