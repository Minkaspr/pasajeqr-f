"use client"

import { Dispatch, SetStateAction } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface UserCardProps {
  user: string
  isEditing: boolean
  tempUser: string
  setTempUser: Dispatch<SetStateAction<string>>
}

export function UserCard({ user, isEditing, tempUser, setTempUser }: UserCardProps) {
  return (
    <Card className="bg-muted/40">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">
          {isEditing ? "Editar nombre" : `¡Hola, ${user || "Usuario"}!`}
        </CardTitle>
      </CardHeader>
      {isEditing && (
        <CardContent>
          <Input
            value={tempUser}
            onChange={(e) => setTempUser(e.target.value)}
            placeholder="Escribe tu nombre"
          />
        </CardContent>
      )}
    </Card>
  )
}
