// app/(qr)/generate/page.tsx
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

type DotType = "dots" | "rounded" | "classy" | "square"
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
  }, [qrType, size, data, dotColor, dotType, bgColor, showLogo, logoFile, logoMargin])

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
      image: imageUrl,
      imageOptions: { crossOrigin: "anonymous", margin: logoMargin }
    })
  }, [data, dotColor, bgColor, dotType, size, showLogo, logoFile, logoMargin, qrCode])

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
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Generar QR Personalizado</h1>

      <Tabs defaultValue="data" className="space-y-6">
        <TabsList>
          <TabsTrigger value="data">Datos</TabsTrigger>
          <TabsTrigger value="style">Estilo</TabsTrigger>
          <TabsTrigger value="advanced">Avanzado</TabsTrigger>
          <TabsTrigger value="export">Exportar</TabsTrigger>
        </TabsList>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <TabsContent value="data" className="space-y-4">
              <div>
                <Label>Datos del QR</Label>
                <Input value={data} onChange={(e) => setData(e.target.value)} />
              </div>

              <div>
                <Label>Tamaño (px): {size}</Label>
                <Slider value={[size]} onValueChange={([v]) => setSize(v)} min={100} max={1000} step={10} />
                <p className="text-sm text-muted-foreground">* Límite visual hasta 400px</p>
              </div>
            </TabsContent>

            <TabsContent value="style" className="space-y-4">
              <div>
                <Label>Color de puntos</Label>
                <Input type="color" value={dotColor} onChange={(e) => setDotColor(e.target.value)} />
              </div>

              <div>
                <Label>Color de fondo</Label>
                <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
              </div>

              <div>
                <Label>Tipo de punto</Label>
                <Select value={dotType} onValueChange={(val) => setDotType(val as DotType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rounded">Redondeado</SelectItem>
                    <SelectItem value="dots">Puntos</SelectItem>
                    <SelectItem value="classy">Elegante</SelectItem>
                    <SelectItem value="square">Cuadrado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="flex items-center gap-4">
                <Switch checked={showLogo} onCheckedChange={setShowLogo} />
                <Label>Incluir logo</Label>
              </div>

              {showLogo && (
                <>
                  <div>
                    <Label>Archivo de logo</Label>
                    <Input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
                  </div>

                  <div>
                    <Label>Margen del logo: {logoMargin}</Label>
                    <Slider value={[logoMargin]} onValueChange={([v]) => setLogoMargin(v)} min={0} max={50} />
                  </div>
                </>
              )}

              <div>
                <Label>Tipo de QR</Label>
                <Select value={qrType} onValueChange={(val) => setQrType(val as QrType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="canvas">Canvas</SelectItem>
                    <SelectItem value="svg">SVG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="export" className="space-y-4">
              <div>
                <Label>Formato de descarga</Label>
                <Select
                  value={fileExt}
                  onValueChange={(val) => setFileExt(val as FileExt)}
                  disabled={qrType === "svg"}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {qrType === "canvas" ? (
                      <>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="jpeg">JPEG</SelectItem>
                        <SelectItem value="webp">WEBP</SelectItem>
                      </>
                    ) : (
                      <SelectItem value="svg">SVG</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {qrType === "svg" && (
                  <p className="text-sm text-muted-foreground mt-1">
                    SVG solo permite exportar como formato <strong>SVG</strong>.
                  </p>
                )}
              </div>

              <Button onClick={handleDownload}>Descargar QR</Button>
            </TabsContent>
          </div>

          <div className="flex justify-center items-center">
            <div
              ref={qrRef}
              style={{
                width: Math.min(size, 400),
                height: Math.min(size, 400),
              }}
            />
          </div>
        </div>
      </Tabs>
    </div>
  )
}
