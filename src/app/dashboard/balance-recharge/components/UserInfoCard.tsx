"use client"

import { ArrowLeft, DollarSign, User, Mail, CreditCard } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface UserData {
  id: string
  name: string
  email: string
  dni: string
  balance: number
}

interface Props {
  user: UserData
  amount: string
  onAmountChange: (value: string) => void
  onRecharge: () => void
  onBack?: () => void // NUEVO
  error?: string
  estimatedBalance?: string | null
  isRechargeDisabled?: boolean
}

export function UserInfoCard({
  user,
  amount,
  onAmountChange,
  onRecharge,
  onBack, // NUEVO
  error,
  estimatedBalance,
  isRechargeDisabled = false,
}: Props) {
  return (
    <div className="space-y-4">
      {onBack && (
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Buscar otro usuario
        </Button>
      )}

      <Card className="border-primary/20 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Información del Usuario
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UserField label="Nombre" value={user.name} icon={<User className="h-4 w-4 text-primary" />} />
            <UserField label="DNI" value={user.dni} icon={<CreditCard className="h-4 w-4 text-primary" />} />
            <UserField label="Correo" value={user.email} icon={<Mail className="h-4 w-4 text-primary" />} />
            <UserField
              label="Saldo Actual"
              value={`S/ ${user.balance.toFixed(2)}`}
              icon={<DollarSign className="h-4 w-4 text-primary" />}
            />
          </div>

          <div className="pt-6 border-t space-y-4">
            <Label htmlFor="amount" className="text-base font-medium">
              Monto a Recargar
            </Label>
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                  S/
                </span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => onAmountChange(e.target.value)}
                  className={cn("pl-10 text-lg", error && "border-red-500")}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}

              {estimatedBalance && !error && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700">
                    Nuevo saldo estimado: <span className="font-semibold text-blue-800">{estimatedBalance}</span>
                  </p>
                </div>
              )}

              <Button onClick={onRecharge} disabled={isRechargeDisabled} className="w-full sm:w-auto" size="lg">
                Confirmar Recarga
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function UserField({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground text-sm">{label}</Label>
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-medium">{value}</span>
      </div>
    </div>
  )
}
