"use client"

import { useEffect, useState } from "react"
import { DriverDetailDTO } from "@/types/driver"
import { getDriverById } from "../lib/api"
import { DriverView } from "../components/DriverView"
import { toast } from "sonner"

interface Props {
  driverId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DriverViewClient({ driverId, open, onOpenChange }: Props) {
  const [driver, setDriver] = useState<DriverDetailDTO | null>(null)

  useEffect(() => {
    if (!open) return
    const fetchData = async () => {
      try {
        const data = await getDriverById(driverId)
        setDriver(data)
      } catch (e) {
        console.error("Error al obtener conductor", e)
        toast.error("No se pudo cargar el detalle del conductor")
      }
    }

    fetchData()
  }, [driverId, open])

  return driver ? (
    <DriverView driver={driver} open={open} onOpenChange={onOpenChange} />
  ) : null
}
