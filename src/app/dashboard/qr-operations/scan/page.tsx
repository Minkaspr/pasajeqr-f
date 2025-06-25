"use client"

import React from "react"

import { useEffect, useRef, useState } from "react"
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode"
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
  ImageIcon,
  RotateCcw,
  ExternalLink,
  Copy,
  CheckCircle2,
  AlertCircle,
  Settings,
  Upload,
  Shield,
  ShieldAlert,
  Loader2,
  X,
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

type ScanMode = "camera" | "file"
type ScannerStatus =
  | "ready"
  | "requesting_permissions"
  | "permissions_denied"
  | "scanning"
  | "loading_image"
  | "image_loaded"
  | "qr_detected"
  | "error"

interface CameraDevice {
  id: string
  label: string
}

export default function ScanQRCodePage() {
  const [scannedResult, setScannedResult] = useState<string | null>(null)
  const [status, setStatus] = useState<ScannerStatus>("ready")
  const [scanMode, setScanMode] = useState<ScanMode>("camera")
  const [cameras, setCameras] = useState<CameraDevice[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string>("")
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [scannerInstance, setScannerInstance] = useState<Html5QrcodeScanner | Html5Qrcode | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const scannerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const hasScannedRef = useRef(false)
  const [isRescanning, setIsRescanning] = useState(false)
  const [showPermissionDialog, setShowPermissionDialog] = useState(true)

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

        if (
          err instanceof DOMException &&
          (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")
        ) {
          setStatus("permissions_denied")
        } else {
          setStatus("error")
        }
      })
  }, [])

  useEffect(() => {
    return () => {
      if (scannerInstance) {
        const result = scannerInstance.clear()
        if (result instanceof Promise) {
          result.catch(() => {})
        }
      }
    }
  }, [scannerInstance])

  const handleScanSuccess = (decodedText: string) => {
    try {
      if (hasScannedRef.current) return
      hasScannedRef.current = true
      setIsRescanning(false)
      setScannedResult(decodedText)
      setShowResultDialog(true)
      setStatus("qr_detected")

      if (scannerInstance) {
        const result = scannerInstance.clear()
        if (result instanceof Promise) result.catch(() => {})
        setScannerInstance(null)
      }

      toast.success("Código QR detectado correctamente")
    } catch (err) {
      console.error("Error interno en handleScanSuccess", err)
    }
  }


  const handleScanError = (errorMessage: string) => {
    // Solo mostrar errores importantes
    if (errorMessage.includes("NotFoundException") === false) {
      console.warn("Error de escaneo:", errorMessage)
    }
  }

  const getScannerId = () => (scanMode === "camera" ? "reader-camera" : "reader-file")

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

      const scannerId = getScannerId()
      const readerElement = document.getElementById(scannerId)

      if (!readerElement) {
        console.error(`No se encontró el contenedor #${scannerId} en el DOM`)
        toast.error("Error al iniciar el escáner: contenedor no encontrado")
        return
      }

      // 🔒 Esperar un frame para asegurar que el layout esté aplicado
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

      // 🔁 Esperar un poco más para asegurar visibilidad completa
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

      if (
        err instanceof DOMException &&
        (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")
      ) {
        setStatus("permissions_denied")
        toast.error("Se necesita acceso a la cámara para escanear códigos QR")
      } else {
        setStatus("error")
        toast.error("No se pudo acceder a la cámara seleccionada")
      }
    }
  }

  const startFileScanning = () => {
    setStatus("ready")

    // Limpiar instancia previa
    if (scannerInstance) {
      const result = scannerInstance.clear()
      if (result instanceof Promise) {
        result.catch(() => {})
      }
      setScannerInstance(null)
    }

    // 🧼 Limpieza del DOM
    const container = document.getElementById(getScannerId())
    if (container) {
      container.innerHTML = ""
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    event.target.value = ""

    if (file) {
      setSelectedImage(file)
      setStatus("loading_image")

      const scannerId = getScannerId()

      // ✅ aseguramos DOM listo antes de proceder
      setTimeout(() => {
        const container = document.getElementById(scannerId)
        if (!container) {
          console.error(`No se encontró el contenedor #${scannerId}`)
          toast.error("Error al escanear: contenedor no disponible")
          setStatus("error")
          return
        }

        // 🖼️ Crear preview
        const reader = new FileReader()
        reader.onload = () => {
          setStatus("image_loaded")
        }
        reader.readAsDataURL(file)

        const scanner = new Html5Qrcode(scannerId)
        setScannerInstance(scanner)

        scanner
          .scanFile(file, true)
          .then(handleScanSuccess)
          .catch((err) => {
            console.error("Error escaneando imagen:", err)
            toast.error("Error al escanear la imagen seleccionada")
            setStatus("ready")
          })
      }, 100) // 🔁 delay mínimo para garantizar que el contenedor esté montado
    }
  }

  const startScanning = () => {
    if (status === "permissions_denied") {
      toast.error("No puedes escanear sin dar permisos de cámara")
      return
    }

    const scannerId = getScannerId()
    const readerContainer = document.getElementById(scannerId)

    if (!readerContainer) {
      toast.error("No se encontró el contenedor del escáner en el DOM")
      return
    }
    if (scanMode === "camera") {
      startCameraScanning()
    } else {
      startFileScanning()
    }
  }

  /* const stopScanning = () => {
    if (scannerInstance) {
      const safeClear = () => {
        try {
          const result = scannerInstance.clear()
          if (result instanceof Promise) {
            result.catch((err) => {
              console.warn("Error al hacer clear():", err)
            })
          }
        } catch (err) {
          console.warn("Clear falló con error:", err)
        }
      }

      if ("stop" in scannerInstance && typeof scannerInstance.stop === "function") {
        scannerInstance
          .stop()
          .then(() => {
            safeClear()
          })
          .catch((err) => {
            console.warn("Error al detener el escáner:", err)
          })
      } else {
        safeClear()
      }
      setScannerInstance(null)
    }

    setStatus("ready")
    setSelectedImage(null)
  } */
  const stopScanning = async () => {
    if (!scannerInstance) return;

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
      setSelectedImage(null)
    }
  }

  useEffect(() => {
    if (status === "permissions_denied") {
      setShowPermissionDialog(true)
    }
  }, [status])

  const resetScanner = () => {
    setScannedResult(null)
    setShowResultDialog(false)
    hasScannedRef.current = false

    if (scanMode === "file") {
      setSelectedImage(null)
      setStatus("ready")
      fileInputRef.current?.click()
    }

    if (scanMode === "camera") {
      setIsRescanning(true)
    }
  }

  const handleDialogOpenChange = (open: boolean) => {
    setShowResultDialog(open)

    if (!open) {
      hasScannedRef.current = false

      if (isRescanning) {
        return
      }

      if (scanMode === "camera") {
        stopScanning()
      }

      if (scanMode === "file") {
        setSelectedImage(null)
        setStatus("ready")
      }
    }
  }

  const copyToClipboard = async () => {
    if (scannedResult) {
      try {
        await navigator.clipboard.writeText(scannedResult)
        toast.success("Texto copiado al portapapeles")
      } catch (error: unknown) {
        toast.error("No se pudo copiar al portapapeles")
        console.log("Error al copiar al portapapeles:", error)
      }
    }
  }


  const getResultType = (text: string) => {
    if (text.startsWith("http://") || text.startsWith("https://")) {
      return { type: "url", label: "Enlace Web", icon: ExternalLink }
    }
    if (text.startsWith("mailto:")) {
      return { type: "email", label: "Correo Electrónico", icon: ExternalLink }
    }
    if (text.startsWith("tel:")) {
      return { type: "phone", label: "Teléfono", icon: ExternalLink }
    }
    if (text.includes("@") && text.includes(".")) {
      return { type: "email", label: "Correo Electrónico", icon: ExternalLink }
    }
    return { type: "text", label: "Texto", icon: Copy }
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
      case "loading_image":
        return {
          icon: <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />,
          text: "Cargando imagen...",
          color: "text-blue-600",
        }
      case "image_loaded":
        return {
          icon: <ImageIcon className="h-4 w-4 text-blue-600" />,
          text: "Imagen cargada",
          color: "text-blue-600",
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

  const resultInfo = scannedResult ? getResultType(scannedResult) : null
  const statusInfo = getStatusInfo()

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de Control */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuración
              </CardTitle>
              <CardDescription>Selecciona el método de escaneo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Modo de escaneo */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Método de Escaneo</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={scanMode === "camera" ? "default" : "outline"}
                    onClick={() => setScanMode("camera")}
                    className="gap-2"
                    disabled={status === "scanning" || status === "requesting_permissions"}
                  >
                    <Camera className="h-4 w-4" />
                    Cámara
                  </Button>
                  <Button
                    variant={scanMode === "file" ? "default" : "outline"}
                    onClick={() => setScanMode("file")}
                    className="gap-2"
                    disabled={status === "scanning" || status === "requesting_permissions"}
                  >
                    <ImageIcon className="h-4 w-4" />
                    Imagen
                  </Button>
                </div>
              </div>

              {/* Selección de cámara */}
              {scanMode === "camera" && cameras.length > 0 && (
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

              {/* Input de archivo para modo imagen */}
              {scanMode === "file" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Seleccionar Imagen</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full gap-2"
                    disabled={status === "loading_image"}
                  >
                    <Upload className="h-4 w-4" />
                    {status === "loading_image" ? "Cargando..." : "Seleccionar Imagen"}
                  </Button>
                </div>
              )}

              {/* Botones de control */}
              <div className="space-y-2">
                {(!showResultDialog && !isRescanning && status !== "scanning" && status !== "requesting_permissions" && status !== "loading_image") ? (
                  <Button
                    onClick={startScanning}
                    className="w-full gap-2"
                    disabled={scanMode === "file" && !selectedImage}
                  >
                    <QrCode className="h-4 w-4" />
                    {scanMode === "camera" ? "Iniciar Cámara" : "Escanear Imagen"}
                  </Button>
                ) : (
                  <Button
                    onClick={stopScanning}
                    variant="destructive"
                    className="w-full gap-2"
                  >
                    <X className="h-4 w-4" />
                    Detener
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Estado */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {statusInfo.icon}
                <span className={`text-sm font-medium ${statusInfo.color}`}>{statusInfo.text}</span>
              </div>
              {status === "permissions_denied" && (
                <div className="mt-2 text-sm text-muted-foreground space-y-2">
                  <p>
                    Para usar la cámara, ve a la configuración de tu navegador y permite el acceso a la cámara para este sitio.
                  </p>
                  <p>
                    En Chrome/Edge, puedes ir manualmente a: <br />
                    <code className="bg-muted px-1 py-0.5 rounded text-xs">
                      chrome://settings/content/camera
                    </code>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alerta de permisos */}
          {status === "permissions_denied" && showPermissionDialog  && (
            <AlertDialog open>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                    <ShieldAlert className="h-5 w-5" />
                    Permisos de cámara denegados
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Para usar la cámara, ve a la configuración de tu navegador y permite el acceso a la cámara para este sitio.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setShowPermissionDialog(false)}>Entendido</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

        </div>

        {/* Área de Escaneo */}
        <div className="lg:col-span-2">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {scanMode === "camera" ? <Camera className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}
                {scanMode === "camera" ? "Escáner de Cámara" : "Escáner de Imagen"}
              </CardTitle>
              <CardDescription>
                {scanMode === "camera"
                  ? "Apunta tu cámara hacia el código QR"
                  : "Selecciona una imagen que contenga un código QR"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="relative space-y-4">
                {/* Estado inicial */}
                {status === "ready" && (
                  <div className="text-center text-gray-500 absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <QrCode className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Listo para escanear</p>
                    <p className="text-sm">
                      {scanMode === "camera"
                        ? "Haz clic en 'Iniciar Cámara' para comenzar"
                        : "Selecciona una imagen con código QR"}
                    </p>
                  </div>
                )}

                {/* Estado de carga */}
                {(status === "requesting_permissions" || status === "loading_image") && (
                  <div className="text-center text-gray-500 absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin" />
                    <p className="text-lg font-medium mb-2">
                      {status === "requesting_permissions" ? "Solicitando permisos..." : "Cargando imagen..."}
                    </p>
                    <p className="text-sm">
                      {status === "requesting_permissions"
                        ? "Por favor, permite el acceso a la cámara"
                        : "Procesando imagen seleccionada"}
                    </p>
                  </div>
                )}

                {/* Contenedor del escáner - se muestra solo cuando no está cargando */}
                <div
                  id={scanMode === "camera" ? "reader-camera" : "reader-file"}
                  ref={scannerRef}
                  className={`w-full min-h-[300px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${
                    status === "loading_image" || status === "requesting_permissions" ? "invisible" : ""
                  }`}
                />
              </div>
            </CardContent>

          </Card>
        </div>
      </div>

      {/* Dialog de Resultado */}
      <Dialog 
        open={showResultDialog} 
        onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              ¡Código QR Detectado!
            </DialogTitle>
            <DialogDescription>Se ha escaneado correctamente el siguiente contenido:</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Tipo de contenido */}
            {resultInfo && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  {React.createElement(resultInfo.icon, { className: "h-3 w-3" })}
                  {resultInfo.label}
                </Badge>
              </div>
            )}

            {/* Contenido */}
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-mono text-sm break-all">{scannedResult}</p>
            </div>

            {/* Acciones */}
            <div className="flex gap-2">
              <Button onClick={copyToClipboard} variant="outline" className="gap-2">
                <Copy className="h-4 w-4" />
                Copiar
              </Button>

              {scannedResult?.startsWith("http") && (
                <Button asChild variant="outline" className="gap-2">
                  <a href={scannedResult} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Abrir Enlace
                  </a>
                </Button>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button onClick={resetScanner} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Escanear Otro
            </Button>
            <Button variant="outline" onClick={() => handleDialogOpenChange(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
