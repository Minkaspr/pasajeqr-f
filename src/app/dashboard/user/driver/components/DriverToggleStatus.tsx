"use client"

import { AlertDialogHeader, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { DriverListItem } from "@/types/driver";
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { changeDriverStatus } from "../lib/api";
import { useDriverRefresh } from "../client/DriverRefreshContext"

interface DriverToggleStatusProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver: DriverListItem;
}

export function DriverToggleStatus({ open, onOpenChange, driver }: DriverToggleStatusProps) {
  const refresh = useDriverRefresh();
  const handleConfirm = async () => {
    try {
      await changeDriverStatus(driver.id, { active: !driver.status });
      toast.success(driver.status ? "Cuenta desactivada" : "Cuenta activada");
      refresh();
      onOpenChange(false);
    } catch (error) {
      console.log("Error al cambiar el estado del conductor:", error);
      toast.error("Error al cambiar el estado");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {driver.status ? "Desactivar cuenta" : "Activar cuenta"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro que quieres {driver.status ? "desactivar" : "activar"} la cuenta de <strong>{driver.firstName}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
