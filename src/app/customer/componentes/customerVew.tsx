"use client"

import { useEffect, useState } from "react"
import PassengerDashboard from "./passenger-dashboard"
import PassengerSettings from "./passenger-settings"
import QrScanner from "./qr-scanner"

type View = "dashboard" | "settings" | "scanner"

export default function CustomerVew() {
  const [currentView, setCurrentView] = useState<View>("dashboard")

  const [user, setUser] = useState<null | {
    firstName: string
    lastName: string
    email: string
    balance: number
  }>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser({
        firstName: parsedUser.firstName,
        lastName: parsedUser.lastName,
        email: parsedUser.email,
        balance: parsedUser.balance ?? 0,
      })
    }
  }, [])

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
          onConfigClick={handleConfigClick}
          onQrClick={handleQrClick}
        />
      )
  }
}
