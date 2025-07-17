"use client"

import React from "react"
import { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  QrCode,
  Camera,
  CheckCircle2,
  AlertCircle,
  Settings,
  Shield,
  ShieldAlert,
  Loader2,
  X,
  ArrowLeft,
  BusFront,
  LucideIcon,
  Ban,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { useRouter } from "next/navigation" // ✅ CORRECTO
import { validateTripQrToken } from "../api"

type ScannerStatus = "ready" | "requesting_permissions" | "permissions_denied" | "scanning" | "qr_detected" | "error" | "success"

interface CameraDevice {
  id: string
  label: string
}

interface QrScannerProps {
  onBackClick?: () => void
  onScanSuccess?: (data: string) => void
  onScanError?: (error: string) => void
}

export default function QrScanner({ onBackClick, onScanSuccess}: QrScannerProps) {
  const [status, setStatus] = useState<ScannerStatus>("ready")
  const [cameras, setCameras] = useState<CameraDevice[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string>("")
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [scannerInstance, setScannerInstance] = useState<Html5Qrcode | null>(null)
  const [showPermissionDialog, setShowPermissionDialog] = useState(false)

  const hasScannedRef = useRef(false)
  const [isRescanning, setIsRescanning] = useState(false)
  const [isValidating, setIsValidating] = useState<boolean>(false)
  const [scanFeedback, setScanFeedback] = useState<{
    icon: LucideIcon
    label: string
    status: "valid" | "invalid"
    data?: {
      tripId: number
      tripCode: string
      status: string
    }
  } | null>(null)

  const router = useRouter()
  
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        const cameraDevices = devices.map((device) => ({
          id: device.id,
          label: device.label || `Cámara ${device.id.slice(-4)}`,
        }))
        setCameras(cameraDevices)
        if (cameraDevices.length > 0) {
          setSelectedCamera(cameraDevices[0].id)
        }
      })
      .catch((err) => {
        console.warn("Error obteniendo cámaras:", err)
        if (err instanceof DOMException && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")) {
          setStatus("permissions_denied")
        } else {
          setStatus("error")
        }
      })
  }, [])

  useEffect(() => {
    return () => {
      if (scannerInstance) {
        const result = scannerInstance.clear() as unknown
      if (typeof (result as Promise<unknown>)?.catch === "function") {
        (result as Promise<unknown>).catch(() => {})
      }
      }
    }
  }, [scannerInstance])

  const handleScanSuccess = (decodedText: string) => {
    try {
      if (hasScannedRef.current) return
      hasScannedRef.current = true
      setIsRescanning(false)
      setIsValidating(true)
      setShowResultDialog(true)
      setStatus("qr_detected")

      if (scannerInstance) {
        const result = scannerInstance.clear() as unknown
      if (typeof (result as Promise<unknown>)?.catch === "function") {
        (result as Promise<unknown>).catch(() => {})
      }
        setScannerInstance(null)
      }

      toast.success("Código QR detectado correctamente")
      onScanSuccess?.(decodedText)
      validateScannedQr(decodedText)
    } catch (err) {
      console.error("Error interno en handleScanSuccess", err)
    }
  }

  const validateScannedQr = async (decodedText: string) => {
    const token = extractTokenFromUrl(decodedText)

    if (!token) {
      toast.error("Código QR inválido o sin token")
      setStatus("error")
      return
    }

    try {
      toast.loading("Verificando QR...", { id: "qr-validation" })
      const response = await validateTripQrToken(token)
      const tripInfo = response.data

      console.log("Trip validado:", tripInfo)

      if (tripInfo) {
        setScanFeedback({
          icon: BusFront,
          label: "Viaje válido",
          status: "valid",
          data: {
            tripId: tripInfo.tripId,
            tripCode: tripInfo.tripCode,
            status: tripInfo.status,
          },
        });
      } else {
        toast.error("La validación del QR no devolvió datos válidos");
      }

      setShowResultDialog(true) 
      toast.success("QR válido", { id: "qr-validation" })
    } catch (err) {
      console.error("Error al validar QR:", err)
      toast.error("QR inválido o expirado", { id: "qr-validation" })
      setStatus("error")
      setScanFeedback({
        icon: Ban,
        label: "QR inválido",
        status: "invalid",
      })
    } finally {
      setIsValidating(false)
    }
  }



  function extractTokenFromUrl(qrText: string): string | null {
    try {
      const url = new URL(qrText)
      return url.searchParams.get("token")
    } catch {
      return null
    }
  }

  const handleScanError = (errorMessage: string) => {
    if (errorMessage.includes("NotFoundException") === false) {
      console.warn("Error de escaneo:", errorMessage)
    }
  }

  const startCameraScanning = async () => {
    if (!selectedCamera) {
      toast.info("Por favor, selecciona una cámara antes de iniciar el escaneo")
      return
    }

    setStatus("requesting_permissions")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach((track) => track.stop())

      setStatus("scanning")
      const scannerId = "reader-camera"
      const readerElement = document.getElementById(scannerId)

      if (!readerElement) {
        console.error(`No se encontró el contenedor #${scannerId} en el DOM`)
        toast.error("Error al iniciar el escáner: contenedor no encontrado")
        return
      }

      await new Promise((res) => requestAnimationFrame(res))

      const width = readerElement.offsetWidth
      const height = readerElement.offsetHeight

      if (width === 0 || height === 0) {
        toast.error("Error: el contenedor del escáner no tiene dimensiones válidas")
        console.error("Tamaño inválido del contenedor:", width, height)
        setStatus("error")
        return
      }

      const scanner = new Html5Qrcode(scannerId)
      setScannerInstance(scanner)

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true,
      }

      setTimeout(async () => {
        try {
          await scanner.start(selectedCamera, config, handleScanSuccess, handleScanError)
        } catch (startError) {
          console.error("Error al iniciar escáner:", startError)
          toast.error("No se pudo iniciar la cámara")
          setStatus("error")
        }
      }, 300)
    } catch (err: unknown) {
      console.error("Error iniciando cámara:", err)
      if (err instanceof DOMException && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")) {
        setStatus("permissions_denied")
        toast.error("Se necesita acceso a la cámara para escanear códigos QR")
      } else {
        setStatus("error")
        toast.error("No se pudo acceder a la cámara seleccionada")
      }
    }
  }

  const stopScanning = async () => {
    if (!scannerInstance) return

    try {
      if ("stop" in scannerInstance && typeof scannerInstance.stop === "function") {
        await scannerInstance.stop()
      }
      await scannerInstance.clear()
    } catch (err) {
      console.warn("Error al detener o limpiar el escáner:", err)
    } finally {
      setScannerInstance(null)
      if (status !== "permissions_denied") {
        setStatus("ready")
      }
    }
  }

  useEffect(() => {
    if (status === "permissions_denied") {
      setShowPermissionDialog(true)
    }
  }, [status])

  const handleDialogOpenChange = (open: boolean) => {
    setShowResultDialog(open)
    if (!open) {
      hasScannedRef.current = false
      if (isRescanning) {
        return
      }
      stopScanning()
    }
  }

  const getStatusInfo = () => {
    switch (status) {
      case "ready":
        return {
          icon: <div className="w-2 h-2 bg-gray-400 rounded-full" />,
          text: "Listo para escanear",
          color: "text-gray-600",
        }
      case "requesting_permissions":
        return {
          icon: <Shield className="h-4 w-4 text-blue-600 animate-pulse" />,
          text: "Solicitando permisos...",
          color: "text-blue-600",
        }
      case "permissions_denied":
        return {
          icon: <ShieldAlert className="h-4 w-4 text-red-600" />,
          text: "Permisos denegados",
          color: "text-red-600",
        }
      case "scanning":
        return {
          icon: <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />,
          text: "Escaneando...",
          color: "text-green-600",
        }
      case "qr_detected":
        return {
          icon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
          text: "QR Detectado",
          color: "text-green-600",
        }
      case "error":
        return {
          icon: <AlertCircle className="h-4 w-4 text-red-600" />,
          text: "Error",
          color: "text-red-600",
        }
      default:
        return {
          icon: <div className="w-2 h-2 bg-gray-400 rounded-full" />,
          text: "Listo para escanear",
          color: "text-gray-600",
        }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 sm:h-16">
            <Button variant="ghost" size="sm" onClick={onBackClick} className="mr-2 sm:mr-4">
              <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Atrás</span>
            </Button>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">SC</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Empresa Santa Catalina</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <QrCode className="h-5 w-6" />
            Escáner QR
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Escanea el código QR del vehículo para registrar tu viaje
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de Control */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuración
                </CardTitle>
                <CardDescription>Configura tu cámara para escanear</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Selección de cámara */}
                {cameras.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cámara</label>
                    <Select
                      value={selectedCamera}
                      onValueChange={setSelectedCamera}
                      disabled={status === "scanning" || status === "requesting_permissions"}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar cámara" />
                      </SelectTrigger>
                      <SelectContent>
                        {cameras.map((camera) => (
                          <SelectItem key={camera.id} value={camera.id}>
                            <span className="truncate overflow-hidden text-ellipsis whitespace-nowrap block max-w-[200px]">
                              {camera.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Botones de control */}
                <div className="space-y-2">
                  {!showResultDialog &&
                  !isRescanning &&
                  status !== "scanning" &&
                  status !== "requesting_permissions" ? (
                    <Button
                      onClick={startCameraScanning}
                      className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
                      disabled={!selectedCamera}
                    >
                      <Camera className="h-4 w-4" />
                      Iniciar Cámara
                    </Button>
                  ) : (
                    <Button onClick={stopScanning} variant="destructive" className="w-full gap-2">
                      <X className="h-4 w-4" />
                      Detener Escáner
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Estado */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Estado del Escáner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {statusInfo.icon}
                  <span className={`text-sm font-medium ${statusInfo.color}`}>{statusInfo.text}</span>
                </div>
                {status === "permissions_denied" && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 mb-2">
                      Para usar la cámara, necesitas permitir el acceso en tu navegador.
                    </p>
                    <p className="text-xs text-red-600">
                      Busca el ícono de cámara en la barra de direcciones y permite el acceso.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="bg-blue-50 border-blue-200 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg text-blue-800">💡 Consejos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
                  <li>• Asegúrate de tener buena iluminación</li>
                  <li>• Mantén el teléfono estable</li>
                  <li>• El QR debe estar completamente visible</li>
                  <li>• Evita reflejos en el código</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Área de Escaneo */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Escáner de Cámara
                </CardTitle>
                <CardDescription>Apunta tu cámara hacia el código QR del vehículo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Estado inicial */}
                  {status === "ready" && (
                    <div className="text-center text-gray-500 absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                      <QrCode className="h-16 w-16 mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Listo para escanear</p>
                      <p className="text-sm">Haz clic en Iniciar Cámara para comenzar</p>
                    </div>
                  )}

                  {/* Estado de carga */}
                  {status === "requesting_permissions" && (
                    <div className="text-center text-gray-500 absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                      <Loader2 className="h-16 w-16 mx-auto mb-4 animate-spin text-blue-600" />
                      <p className="text-lg font-medium mb-2">Solicitando permisos...</p>
                      <p className="text-sm">Por favor, permite el acceso a la cámara</p>
                    </div>
                  )}

                  {/* Contenedor del escáner */}
                  <div
                    id="reader-camera"
                    className="w-full min-h-[400px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Dialog de Resultado */}
      <Dialog open={showResultDialog} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              ¡Código QR Detectado!
            </DialogTitle>
            <DialogDescription>
              {isValidating
                ? "Verificando QR, espere un momento..."
                : scanFeedback?.status === "valid"
                ? "Se ha escaneado correctamente el código del vehículo:"
                : "El código QR no es válido o ha expirado."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {isValidating ? (
              <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
                <span className="animate-pulse">Validando QR, por favor espere...</span>
              </div>
            ) : scanFeedback?.status === "valid" ? (
              <>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="gap-1">
                    {React.createElement(scanFeedback.icon, { className: "h-3 w-3" })}
                    {scanFeedback.label}
                  </Badge>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Viaje Registrado</span>
                  </div>
                  <p className="text-xs text-green-700">
                    Puedes continuar para seleccionar tus paraderos y confirmar tu viaje. El costo será descontado al finalizar el proceso.
                  </p>
                </div>
              </>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                Código QR inválido o expirado.
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            {!isValidating && scanFeedback?.status === "valid" && (
              <Button 
                onClick={() => {
                  if (!scanFeedback?.data) return null;
                  const { tripId, tripCode, status } = scanFeedback.data;

                  const params = new URLSearchParams({
                    tripId: tripId.toString(),
                    tripCode,
                    status,
                  }).toString();

                  router.push(`/customer/abordar?${params}`);
                }} className="gap-2">
                Ir al formulario
              </Button>
            )}
            <Button variant="outline" onClick={() => handleDialogOpenChange(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alerta de permisos */}
      {status === "permissions_denied" && showPermissionDialog && (
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                <ShieldAlert className="h-5 w-5" />
                Permisos de cámara requeridos
              </AlertDialogTitle>
              <AlertDialogDescription>
                Para escanear códigos QR necesitas permitir el acceso a la cámara. Busca el ícono de cámara en la barra
                de direcciones de tu navegador y permite el acceso.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowPermissionDialog(false)}>Entendido</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
