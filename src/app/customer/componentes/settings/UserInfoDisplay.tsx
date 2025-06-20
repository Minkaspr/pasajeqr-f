"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface UserInfoDisplayProps {
  name: string
  setName: (value: string) => void
  email: string
}

export function UserInfoDisplay({ name, setName, email }: UserInfoDisplayProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del usuario"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Correo</Label>
        <Input id="email" value={email} disabled />
      </div>
    </div>
  )
}
