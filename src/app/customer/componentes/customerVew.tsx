"use client"

import { useState } from "react"
import PassengerDashboard from "./passenger-dashboard"
import PassengerSettings from "./passenger-settings"
import QrScanner from "./qr-scanner"

type View = "dashboard" | "settings" | "scanner"

export default function CustomerVew() {
  const [currentView, setCurrentView] = useState<View>("dashboard")

  const handleConfigClick = () => setCurrentView("settings")
  const handleQrClick = () => setCurrentView("scanner")
  const handleBackClick = () => setCurrentView("dashboard")

  const handleUpdateProfile = (data: { firstName: string; lastName: string }) => {
    console.log("Updating profile:", data)
    // Aquí implementarías la lógica para actualizar el perfil
  }

  const handleUpdatePassword = (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    console.log("Updating password",data)
    // Aquí implementarías la lógica para actualizar la contraseña
  }

  const handleScanSuccess = (data: string) => {
    console.log("QR Scan successful:", data)
    // Aquí implementarías la lógica para procesar el QR escaneado
  }

  const handleScanError = (error: string) => {
    console.log("QR Scan error:", error)
    // Aquí implementarías la lógica para manejar errores de escaneo
  }

  switch (currentView) {
    case "settings":
      return (
        <PassengerSettings
          onBackClick={handleBackClick}
          onUpdateProfile={handleUpdateProfile}
          onUpdatePassword={handleUpdatePassword}
        />
      )
    case "scanner":
      return <QrScanner onBackClick={handleBackClick} onScanSuccess={handleScanSuccess} onScanError={handleScanError} />
    default:
      return <PassengerDashboard onConfigClick={handleConfigClick} onQrClick={handleQrClick} />
  }
}
