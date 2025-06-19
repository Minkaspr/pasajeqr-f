"use client"

import { useState } from "react"
import { BalanceCard } from "./componentes/cards/BalanceCard"
import { RechargeHistoryCard } from "./componentes/cards/RechargeHistoryCard"
import { QrScanCard } from "./componentes/qr/QrScanCard"
import { SettingsForm } from "./componentes/settings/SettingsForm"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Settings } from "lucide-react"

export interface Recharge {
  id: number
  amount: number
  date: string
  method: string
}

export interface UserData {
  name: string
  email: string
  password: string
}

export default function ClientInterface() {
  const [user, setUser] = useState<UserData>({
    name: "Juan Pérez",
    email: "juan@example.com",
    password: "",
  })

  const [balance, setBalance] = useState(1500)
  const [rechargeHistory, setRechargeHistory] = useState<Recharge[]>([
    { id: 1, amount: 500, date: "2024-06-01", method: "Tarjeta" },
    { id: 2, amount: 1000, date: "2024-06-10", method: "Efectivo" },
  ])

  const [showScanner, setShowScanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [tempUser, setTempUser] = useState(user.name)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const handleScanResult = (result: string) => {
    alert(`Resultado del QR: ${result}`)
    setShowScanner(false)
  }

  const handleSave = (data: { name: string; password: string }) => {
    setUser((prev) => ({
      ...prev,
      name: data.name,
      password: data.password,
    }))
    setTempUser(data.name)
    setShowSettings(false)
  }

  const handleOpenSettings = () => {
    setShowSettings(true)
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl text-foreground space-y-6">
      {(showScanner || showSettings) && (
        <div className="w-full max-w-md">
          <Button
            onClick={() => {
              setShowScanner(false)
              setShowSettings(false)
            }}
          >
            Regresar
          </Button>
        </div>
      )}

      {!showScanner && !showSettings && (
        <>
          {/* Cuadro de Bienvenida adaptado */}
          <div className="flex justify-center">
            <Card
              className={`h-fit w-full max-w-md transition-colors duration-300 ${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
              }`}
            >
              <CardHeader>
                <CardTitle
                  className={`flex items-center justify-between transition-colors duration-300 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Bienvenido/a {user.name}
                  </div>
                  <Button
                    onClick={handleOpenSettings}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    <span className="text-xs">Configurar</span>
                  </Button>
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div className="flex justify-center">
            <BalanceCard balance={balance} onScanClick={() => setShowScanner(true)} />
          </div>

          <div className="flex justify-center w-full">
            <div className="w-full max-w-6xl">
              <RechargeHistoryCard
                rechargeHistory={rechargeHistory}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        </>
      )}

      {showSettings && (
        <div className="max-w-md mx-auto space-y-4">
          <SettingsForm
            user={user}
            onSave={handleSave}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        </div>
      )}

      {showScanner && (
        <div className="flex justify-center">
          <QrScanCard onStartScan={() => setShowScanner(true)} />
        </div>
      )}
    </main>
  )
}
