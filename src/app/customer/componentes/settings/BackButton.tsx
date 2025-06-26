"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function BackButton() {
  const router = useRouter()

  return (
    <Button
      variant="outline"
      onClick={() => router.push("/customer")}
      className="w-full justify-start"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Regresar
    </Button>
  )
}
