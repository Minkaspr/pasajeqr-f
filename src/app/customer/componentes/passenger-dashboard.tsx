"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, QrCode, CreditCard, Clock } from "lucide-react"

interface Recharge {
  id: string
  amount: number
  date: string
  method: string
  status: string
}

interface PassengerDashboardProps {
  user: {
    name: string
    balance: number
  }
  recharges: Recharge[]
  onConfigClick?: () => void
  onQrClick?: () => void
}

export default function PassengerDashboard({
  user,
  recharges,
  onConfigClick,
  onQrClick,
}: PassengerDashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">SC</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Empresa Santa Catalina</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={onConfigClick} className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Configuración</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 lg:pb-6">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">¡Bienvenido/a, {user.name}!</h2>
          <p className="text-sm sm:text-base text-gray-600">Gestiona tu saldo y revisa tu historial de recargas</p>
        </div>

        {/* Balance and Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Balance Card */}
          <Card className="col-span-1 bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Saldo Actual</CardTitle>
              <CreditCard className="h-4 w-4 text-green-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">${user.balance.toFixed(2)}</div>
              <p className="text-xs text-green-100 mt-1">Disponible para usar</p>
            </CardContent>
          </Card>
        </div>

        {/* Desktop QR Scanner Button */}
        <div className="hidden lg:block mb-8">
          <Button onClick={onQrClick} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700" size="lg">
            <QrCode className="h-5 w-5 mr-2" />
            Abrir Escáner QR
          </Button>
        </div>

        {/* Recent Recharges */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Clock className="h-5 w-5" />
              Últimas Recargas
            </CardTitle>
            <CardDescription className="text-sm">Historial de tus recargas más recientes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {recharges.map((recharge) => (
                <div
                  key={recharge.id}
                  className="flex items-center justify-between p-3 sm:p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm sm:text-base">${recharge.amount.toFixed(2)}</p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{recharge.method}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Badge variant={recharge.status === "PAYMENT" ? "default" : "secondary"} className="mb-1 text-xs">
                      {recharge.status}
                    </Badge>
                    <p className="text-xs text-gray-500">{recharge.date}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Show more button for mobile */}
            <div className="mt-4 text-center lg:hidden">
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Ver más recargas
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Floating QR Button for Mobile */}
      <div className="lg:hidden fixed bottom-6 right-4 z-50">
        <Button
          onClick={onQrClick}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
          size="icon"
        >
          <QrCode className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
