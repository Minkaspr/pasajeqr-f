"use client"

import { useEffect, useState } from "react"
import PassengerDashboard from "./passenger-dashboard"
import PassengerSettings from "./passenger-settings"
import QrScanner from "./qr-scanner"
import { TransactionDetail } from "../customer"
import { getPassengerBalanceHistory } from "../api"

type View = "dashboard" | "settings" | "scanner"

export default function CustomerVew() {
  const [currentView, setCurrentView] = useState<View>("dashboard")
  const [transactions, setTransactions] = useState<TransactionDetail[]>([])


  const [user, setUser] = useState<null | {
    id: number
    firstName: string
    lastName: string
    email: string
    balance: number
  }>(null)

  useEffect(() => {
  const storedUser = localStorage.getItem("user")

  if (storedUser) {
    const parsedUser = JSON.parse(storedUser)
    const id = parsedUser.id // o userId, asegúrate cómo lo guardas

    setUser({
      id: parsedUser.id,
      firstName: parsedUser.firstName,
      lastName: parsedUser.lastName,
      email: parsedUser.email,
      balance: 0, // temporal
    })

    // Llamada a API balance + transacciones
    getPassengerBalanceHistory(id)
      .then((res) => {
        if (res.data) {
          setUser((prev) =>
            prev ? { ...prev, balance: res.data!.currentBalance } : prev
          )

          setTransactions(res.data.transactions)
        } else {
          console.warn("No se recibió data en la respuesta")
        }
      })
      .catch((err) => {
        console.error("Error al obtener balance e historial:", err)
      })
    }
  }, [])

  const allTransactions = transactions.map((t, index) => ({
    id: String(index + 1),
    amount: t.amount,
    date: t.transactionDate.split("T")[0], // solo fecha
    method: t.description ?? "Desconocido",
    status: t.type === "RECHARGE" ? "Recarga" : "Pago",
  }))

  const handleConfigClick = () => setCurrentView("settings")
  const handleQrClick = () => setCurrentView("scanner")
  const handleBackClick = () => setCurrentView("dashboard")

  const handleUpdateProfile = (data: { firstName: string; lastName: string }) => {
    if (!user) return
    const updatedUser = {
      ...user,
      firstName: data.firstName,
      lastName: data.lastName,
    }
    setUser(updatedUser)

    const stored = localStorage.getItem("user")
    if (stored) {
      const parsed = JSON.parse(stored)
      parsed.firstName = data.firstName
      parsed.lastName = data.lastName
      localStorage.setItem("user", JSON.stringify(parsed))
    }

    setCurrentView("dashboard")
  }

  const handleUpdatePassword = (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    console.log("Updating password", data)
  }

  const handleScanSuccess = (data: string) => {
    console.log("QR Scan successful:", data)
    // Aquí implementarías la lógica para procesar el QR escaneado
  }

  const handleScanError = (error: string) => {
    console.log("QR Scan error:", error)
    // Aquí implementarías la lógica para manejar errores de escaneo
  }

  if (!user) return <div className="p-4">Cargando usuario...</div>

  switch (currentView) {
    case "settings":
      return (
        <PassengerSettings
          user={{ firstName: user.firstName, lastName: user.lastName, email: user.email }}
          onBackClick={handleBackClick}
          onUpdateProfile={handleUpdateProfile}
          onUpdatePassword={handleUpdatePassword}
        />
      )
    case "scanner":
      return <QrScanner onBackClick={handleBackClick} onScanSuccess={handleScanSuccess} onScanError={handleScanError} />
    default:
      return (
        <PassengerDashboard
          user={{ name: `${user.firstName} ${user.lastName}`, balance: user.balance }}
          recharges={allTransactions}
          onConfigClick={handleConfigClick}
          onQrClick={handleQrClick}
        />
      )
  }
}
