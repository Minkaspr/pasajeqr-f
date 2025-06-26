"use client"

import { useEffect, useRef, useState } from "react"
import QRCodeStyling from "qr-code-styling"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@radix-ui/react-separator"

type CornerStyle = "dot" | "square" | "extra-rounded" | "rounded" | "classy" | "classy-rounded"
type DotType = "dots" | "square" | "extra-rounded" | "rounded" | "classy" | "classy-rounded"
type FileExt = "png" | "jpeg" | "webp" | "svg"
type QrType = "canvas" | "svg"

export default function GenerateQRCodePage() {
  const qrRef = useRef<HTMLDivElement>(null)
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null)

  const [data, setData] = useState("https://example.com")
  const [dotColor, setDotColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("#ffffff")
  const [dotType, setDotType] = useState<DotType>("rounded")
  const [size, setSize] = useState(300)
  const [fileExt, setFileExt] = useState<FileExt>("png")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [showLogo, setShowLogo] = useState(false)
  const [logoMargin, setLogoMargin] = useState(10)
  const [qrType, setQrType] = useState<QrType>("canvas")

  const [cornerSquareColor, setCornerSquareColor] = useState("#000000")
  const [cornerSquareType, setCornerSquareType] = useState<CornerStyle>("square")
  const [cornerDotColor, setCornerDotColor] = useState("#000000")
  const [cornerDotType, setCornerDotType] = useState<CornerStyle>("dot")


  const logoUrlRef = useRef<string | null>(null)

  useEffect(() => {
    if (logoUrlRef.current) {
      URL.revokeObjectURL(logoUrlRef.current)
    }

    const imageUrl = showLogo && logoFile ? URL.createObjectURL(logoFile) : undefined
    if (imageUrl) logoUrlRef.current = imageUrl

    const qr = new QRCodeStyling({
      width: size,
      height: size,
      type: qrType,
      data,
      dotsOptions: { color: dotColor, type: dotType },
      backgroundOptions: { color: bgColor },
      cornersSquareOptions: { color: cornerSquareColor, type: cornerSquareType },
      cornersDotOptions: { color: cornerDotColor, type: cornerDotType },
      image: imageUrl,
      imageOptions: { crossOrigin: "anonymous", margin: logoMargin }
    })

    qrRef.current!.innerHTML = ""
    qr.append(qrRef.current!)
    setQrCode(qr)

    return () => {
      if (logoUrlRef.current) {
        URL.revokeObjectURL(logoUrlRef.current)
        logoUrlRef.current = null
      }
    }
  }, [qrType, size, data, dotColor, dotType, bgColor, showLogo, logoFile, logoMargin, cornerSquareColor, cornerSquareType, cornerDotColor, cornerDotType])

  useEffect(() => {
    if (!qrCode) return
    const imageUrl = showLogo && logoFile ? URL.createObjectURL(logoFile) : undefined
    if (logoUrlRef.current) {
      URL.revokeObjectURL(logoUrlRef.current)
    }
    if (imageUrl) logoUrlRef.current = imageUrl

    qrCode.update({
      width: size,
      height: size,
      data,
      dotsOptions: { color: dotColor, type: dotType },
      backgroundOptions: { color: bgColor },
      cornersSquareOptions: { color: cornerSquareColor, type: cornerSquareType },
      cornersDotOptions: { color: cornerDotColor, type: cornerDotType },
      image: imageUrl,
      imageOptions: { crossOrigin: "anonymous", margin: logoMargin }
    })
  }, [data, dotColor, bgColor, dotType, size, showLogo, logoFile, logoMargin, qrCode, cornerSquareColor, cornerSquareType, cornerDotColor, cornerDotType])

  useEffect(() => {
    if (qrType === "svg") {
      setFileExt("svg" as FileExt)
    } else if (fileExt === "svg") {
      setFileExt("png")
    }
  }, [qrType, fileExt])

  const handleDownload = () => {
    qrCode?.download({ extension: fileExt })
  }

  return (
    <div className="@container w-full max-w-5xl mx-auto px-4 py-6">
      <div className="flex flex-col items-center xl:flex-row xl:items-start gap-8">
        {/* Panel de configuración */}
        <div className="flex-1 space-y-6 min-w-[390px] md:min-w-[500px]">
          <Tabs defaultValue="data" className="w-full">
            <TabsList className="flex w-full flex-wrap gap-2 justify-between">
              <TabsTrigger value="data">Datos</TabsTrigger>
              <TabsTrigger value="style">Estilo</TabsTrigger>
              <TabsTrigger value="advanced">Avanzado</TabsTrigger>
              <TabsTrigger value="export">Exportar</TabsTrigger>
            </TabsList>

            <TabsContent value="data" className="space-y-6 ">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración básica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="qr-data">Datos del QR</Label>
                    <Input
                      id="qr-data"
                      value={data}
                      onChange={(e) => setData(e.target.value)}
                      placeholder="Ingresa URL, texto, etc."
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Tamaño: {size}px</Label>
                    <Slider
                      value={[size]}
                      onValueChange={([v]) => setSize(v)}
                      min={100}
                      max={1000}
                      step={10}
                      className="w-full"
                    />
                    <p className="text-sm text-muted-foreground">
                      * Vista previa limitada a 400px para mejor visualización
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="style" className="space-y-6">
              {/* Color de fondo */}
              <Card>
                <CardHeader>
                  <CardTitle>Color de fondo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                      {/* Selector de color + input de texto */}
                      <div className="space-y-1">
                        <Label htmlFor="bg-color">Color personalizado</Label>
                        <div className="flex gap-2">
                          <Input
                            id="bg-color"
                            type="color"
                            value={bgColor === "transparent" ? "#ffffff" : bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                            disabled={bgColor === "transparent"}
                            className="w-16 h-10 p-1 border rounded"
                          />
                          <Input
                            type="text"
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                            placeholder="#ffffff o 'transparent'"
                            disabled={bgColor === "transparent"}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      {/* Botón para alternar transparencia */}
                      <div className="space-y-1">
                        <Label className="invisible">Transparente</Label>
                        <Button
                          variant={bgColor === "transparent" ? "secondary" : "outline"}
                          onClick={() => {
                            if (bgColor === "transparent") {
                              setBgColor("#ffffff") // Restaurar valor por defecto
                            } else {
                              setBgColor("transparent")
                            }
                          }}
                          className="w-full"
                        >
                          {bgColor === "transparent" ? "Quitar transparencia" : "Usar transparente"}
                        </Button>
                      </div>
                    </div>

                    {bgColor === "transparent" && (
                      <p className="text-sm text-muted-foreground">
                        El fondo será completamente transparente al exportar (ideal para overlays).
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Estilo de puntos */}
              <Card>
                <CardHeader>
                  <CardTitle>Estilo de puntos</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de punto</Label>
                    <Select value={dotType} onValueChange={(val) => setDotType(val as DotType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="square">Cuadrado</SelectItem>
                        <SelectItem value="dots">Puntos</SelectItem>
                        <SelectItem value="rounded">Redondeado</SelectItem>
                        <SelectItem value="extra-rounded">Extra redondeado</SelectItem>
                        <SelectItem value="classy">Elegante</SelectItem>
                        <SelectItem value="classy-rounded">Elegante redondeado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dot-color">Color de puntos</Label>
                    <div className="flex gap-2">
                      <Input
                        id="dot-color"
                        type="color"
                        value={dotColor}
                        onChange={(e) => setDotColor(e.target.value)}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={dotColor}
                        onChange={(e) => setDotColor(e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Esquinas cuadradas */}
              <Card>
                <CardHeader>
                  <CardTitle>Esquinas cuadradas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Estilo</Label>
                      <Select value={cornerSquareType} onValueChange={(val) => setCornerSquareType(val as CornerStyle)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="square">Cuadrado</SelectItem>
                          <SelectItem value="dot">Punto</SelectItem>
                          <SelectItem value="rounded">Redondeado</SelectItem>
                          <SelectItem value="extra-rounded">Extra redondeado</SelectItem>
                          <SelectItem value="classy">Elegante</SelectItem>
                          <SelectItem value="classy-rounded">Elegante redondeado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="corner-square-color">Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="corner-square-color"
                          type="color"
                          value={cornerSquareColor}
                          onChange={(e) => setCornerSquareColor(e.target.value)}
                          className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                          value={cornerSquareColor}
                          onChange={(e) => setCornerSquareColor(e.target.value)}
                          placeholder="#000000"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Esquinas puntos */}
              <Card>
                <CardHeader>
                  <CardTitle>Esquinas internas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Estilo</Label>
                      <Select value={cornerDotType} onValueChange={(val) => setCornerDotType(val as CornerStyle)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dot">Punto</SelectItem>
                          <SelectItem value="square">Cuadrado</SelectItem>
                          <SelectItem value="rounded">Redondeado</SelectItem>
                          <SelectItem value="extra-rounded">Extra redondeado</SelectItem>
                          <SelectItem value="classy">Elegante</SelectItem>
                          <SelectItem value="classy-rounded">Elegante redondeado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="corner-dot-color">Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="corner-dot-color"
                          type="color"
                          value={cornerDotColor}
                          onChange={(e) => setCornerDotColor(e.target.value)}
                          className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                          value={cornerDotColor}
                          onChange={(e) => setCornerDotColor(e.target.value)}
                          placeholder="#000000"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Logo personalizado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Switch id="show-logo" checked={showLogo} onCheckedChange={setShowLogo} />
                    <Label htmlFor="show-logo">Incluir logo en el centro</Label>
                  </div>

                  {showLogo && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="logo-file">Archivo de logo</Label>
                          <Input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Formatos soportados: SVG, PNG, JPG, WebP</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label>Margen del logo: {logoMargin}px</Label>
                          <Slider
                            value={[logoMargin]}
                            onValueChange={([v]) => setLogoMargin(v)}
                            min={0}
                            max={50}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Configuración técnica</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>Tipo de renderizado</Label>
                    <Select value={qrType} onValueChange={(val) => setQrType(val as QrType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="canvas">Canvas (recomendado)</SelectItem>
                        <SelectItem value="svg">SVG (vectorial)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Canvas ofrece mejor compatibilidad, SVG es escalable
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="export" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Exportar código QR</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Formato de descarga</Label>
                    <Select
                      value={fileExt}
                      onValueChange={(val) => setFileExt(val as FileExt)}
                      disabled={qrType === "svg"}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {qrType === "canvas" ? (
                          <>
                            <SelectItem value="png">PNG (recomendado)</SelectItem>
                            <SelectItem value="jpeg">JPEG</SelectItem>
                            <SelectItem value="webp">WebP</SelectItem>
                          </>
                        ) : (
                          <SelectItem value="svg">SVG</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {qrType === "svg" && (
                      <p className="text-sm text-muted-foreground">El modo SVG solo permite exportar en formato SVG</p>
                    )}
                  </div>

                  <Button onClick={handleDownload} className="w-full" size="lg">
                    Descargar código QR
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Vista previa */}
        <div className="flex-1 lg:max-w-md">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center">Vista previa</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center p-6">
              <div className="relative">
                <div
                  ref={qrRef}
                  style={{
                    width: "400px",
                    height: "400px",
                    transform: size > 400 ? `scale(${400 / size})` : undefined,
                  }}
                  className="flex items-center justify-center"
                />
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-1 mt-4">
            <p className="text-sm font-medium">
              Tamaño real: {size} × {size}px
            </p>
            <p className="text-xs text-muted-foreground">
              {size > 400 ? `Vista previa limitada a 400px` : "Vista previa a tamaño real"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
