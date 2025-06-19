import html2canvas from "html2canvas"

interface ReceiptData {
  transactionId: string
  userName: string
  userDni: string
  userEmail: string
  date: Date
  previousBalance: number
  rechargeAmount: number
  newBalance: number
}

export const useReceiptDownload = () => {
  const downloadReceipt = async (data: ReceiptData) => {
    try {
      // Crear contenedor temporal completamente aislado
      const tempContainer = document.createElement("div")
      tempContainer.style.position = "fixed"
      tempContainer.style.top = "-9999px"
      tempContainer.style.left = "-9999px"
      tempContainer.style.width = "400px"
      tempContainer.style.backgroundColor = "#ffffff"
      tempContainer.style.zIndex = "-1000"

      // Crear el HTML del comprobante
      tempContainer.innerHTML = createReceiptHTML(data)

      // Agregar al DOM temporalmente
      document.body.appendChild(tempContainer)

      // Esperar renderizado
      await new Promise((resolve) => setTimeout(resolve, 200))

      // Configuración específica para evitar errores de color
      const canvas = await html2canvas(tempContainer.firstElementChild as HTMLElement, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false, // Evita problemas con estilos modernos
        ignoreElements: (element) => {
          // Ignorar elementos que puedan tener estilos problemáticos
          return element.tagName === "SCRIPT" || element.tagName === "STYLE"
        },
        onclone: (clonedDoc) => {
          // Limpiar estilos que puedan causar problemas
          const styles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]')
          styles.forEach((style) => style.remove())
        },
      })

      // Limpiar elemento temporal
      document.body.removeChild(tempContainer)

      // Convertir a blob y descargar
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/png", 0.95)
      })

      if (!blob) throw new Error("Error al generar el blob del recibo")

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `comprobante-${data.transactionId}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Fallo al generar el comprobante:", err)
      throw err
    }
  }

  const createReceiptHTML = (data: ReceiptData): string => {
    const formatCurrency = (amount: number) =>
      new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(amount)

    const formatDate = (date: Date) =>
      new Intl.DateTimeFormat("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(date)

    // Usar solo colores hexadecimales para evitar problemas con oklch
    return `
      <div style="
        width: 380px;
        background: #ffffff;
        padding: 24px;
        font-family: Arial, sans-serif;
        border: 2px solid #10b981;
        border-radius: 8px;
        color: #1f2937;
        box-sizing: border-box;
      ">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="
            width: 60px;
            height: 60px;
            background: #d1fae5;
            border-radius: 50%;
            margin: 0 auto 12px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            font-family: Arial, sans-serif;
          ">
            <span style="position: relative; top: -15px;">✔</span>
          </div>
          <h2 style="
            font-size: 18px;
            font-weight: bold;
            color: #047857;
            margin: 0 0 8px 0;
            font-family: Arial, sans-serif;
          ">COMPROBANTE DE RECARGA</h2>
          <p style="
            font-family: monospace;
            font-size: 12px;
            color: #10b981;
            margin: 0;
          ">#${data.transactionId}</p>
        </div>

        <!-- Divider -->
        <hr style="
          margin: 20px 0;
          border: none;
          border-top: 1px solid #d1fae5;
        " />

        <!-- User Information -->
        <div style="margin-bottom: 20px;">
          <div style="margin-bottom: 8px;">
            <span style="color: #6b7280; font-size: 14px;">Usuario:</span>
            <span style="font-weight: bold; margin-left: 8px;">${data.userName}</span>
          </div>
          <div style="margin-bottom: 8px;">
            <span style="color: #6b7280; font-size: 14px;">DNI:</span>
            <span style="font-weight: bold; margin-left: 8px;">${data.userDni}</span>
          </div>
          <div style="margin-bottom: 8px;">
            <span style="color: #6b7280; font-size: 14px;">Email:</span>
            <span style="font-weight: bold; margin-left: 8px; font-size: 12px;">${data.userEmail}</span>
          </div>
          <div style="margin-bottom: 8px;">
            <span style="color: #6b7280; font-size: 14px;">Fecha:</span>
            <span style="font-weight: bold; margin-left: 8px;">${formatDate(data.date)}</span>
          </div>
        </div>

        <!-- Financial Summary -->
        <div style="
          background: #f0fdf4;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 1px solid #d1fae5;
        ">
          <div style="margin-bottom: 12px;">
            <span style="color: #6b7280; font-size: 14px;">Saldo Anterior:</span>
            <span style="font-weight: bold; float: right;">${formatCurrency(data.previousBalance)}</span>
            <div style="clear: both;"></div>
          </div>
          <div style="margin-bottom: 12px;">
            <span style="color: #6b7280; font-size: 14px;">Monto Recargado:</span>
            <span style="font-weight: bold; color: #10b981; float: right; font-size: 16px;">+${formatCurrency(data.rechargeAmount)}</span>
            <div style="clear: both;"></div>
          </div>
          <hr style="
            margin: 12px 0;
            border: none;
            border-top: 1px solid #d1fae5;
          " />
          <div>
            <span style="color: #047857; font-weight: bold;">Nuevo Saldo:</span>
            <span style="font-weight: bold; color: #047857; float: right; font-size: 18px;">${formatCurrency(data.newBalance)}</span>
            <div style="clear: both;"></div>
          </div>
        </div>

        <!-- Success Message -->
        <div style="text-align: center;">
          <p style="
            color: #10b981;
            font-size: 12px;
            margin: 0;
            font-weight: 500;
          ">✓ Recarga procesada exitosamente</p>
          <p style="
            color: #6b7280;
            font-size: 11px;
            margin: 4px 0 0 0;
          ">Conserve este comprobante para sus registros</p>
        </div>

        <!-- Footer -->
        <div style="
          text-align: center;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid #d1fae5;
        ">
          <p style="
            color: #047857;
            font-size: 12px;
            font-weight: bold;
            margin: 0 0 4px 0;
          ">Santa Catalina S.A.</p>
          <p style="
            color: #6b7280;
            font-size: 10px;
            font-family: monospace;
            margin: 0;
          ">ID: ${data.transactionId}</p>
        </div>
      </div>
    `
  }

  return { downloadReceipt }
}
