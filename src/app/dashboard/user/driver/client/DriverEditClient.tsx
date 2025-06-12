"use client"

import { useEffect, useState } from "react"
import { getDriverById } from "../lib/api"
import { DriverDetailDTO } from "@/types/driver"
import { DriverEdit } from "../components/DriverEdit"
import { toast } from "sonner"
import { updateDriver } from "../lib/api"
import { toDriverUpdateRequest } from "../lib/mapper" // lo puedes crear tú abajo
import { useDriverRefresh } from "./DriverRefreshContext"

interface Props {
  driverId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DriverEditClient({ driverId, open, onOpenChange }: Props) {
  const [driver, setDriver] = useState<DriverDetailDTO | null>(null)
  const [loading, setLoading] = useState(false)
  const refresh = useDriverRefresh();

  console.log("🧩 DriverEditClient montado con props:", { driverId, open })

  // Cargar datos al abrir
  useEffect(() => {
    console.log("👀 useEffect ejecutado. Valor de open:", open)
    if (!open) return
    const load = async () => {
      try {
        const data = await getDriverById(driverId)
        console.log("🔍 Datos recibidos del backend:", data)
        setDriver(data)
      } catch (e) {
        console.error("Error cargando conductor:", e)
        toast.error("Error al cargar datos del conductor")
      }
    }
    load()
  }, [open, driverId])

  const handleChange = (field: keyof DriverDetailDTO, value: string | boolean | number) => {
    if (!driver) return
    setDriver({ ...driver, [field]: value })
  }

  const handleSubmit = async () => {
    if (!driver) return
    setLoading(true)
    try {
      const updateData = toDriverUpdateRequest(driver)
      const updated = await updateDriver(driver.id, updateData)
      toast.success("Conductor actualizado correctamente")
      console.log("🔄 Conductor actualizado:", updated)
      refresh();
      onOpenChange(false)
    } catch (e) {
      console.error("Error actualizando conductor:", e)
      toast.error("Error al actualizar conductor")
    } finally {
      setLoading(false)
    }
  }


  return driver ? (
    <DriverEdit
      open={open}
      driver={driver}
      loading={loading}
      onOpenChange={onOpenChange}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  ) : null
}
