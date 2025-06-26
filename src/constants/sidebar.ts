import {
  BusFront,
  MapPin,
  BadgeDollarSign,
  QrCode,
  Wallet,

  Users,
  Truck 
} from "lucide-react"

export const titleNavMain = "Panel de Gestión"

export const navMainData = [
  {
    title: "Usuarios",
    url: "#",
    icon: Users,
    items: [
      {
        title: "Pasajeros",
        url: "/dashboard/user/passenger",
        description: "Lista de pasajeros registrados en la plataforma",
      },
      {
        title: "Conductores",
        url: "/dashboard/user/driver",
        description: "Listado y gestión de conductores",
      },
      {
        title: "Administradores",
        url: "/dashboard/user/admin",
        description: "Gestión de administradores del sistema",
      },
    ],
  },
  {
    title: "Buses",
    url: "/dashboard/bus",
    icon: BusFront,
    description: "Administración de flota de buses",
  },
  {
    title: "Paraderos",
    url: "/dashboard/stop",
    icon: MapPin,
    description: "Ubicación y administración de paraderos",
  },
  {
    title: "Servicios",
    url: "/dashboard/service",
    icon: Truck, 
    description: "Servicios de transporte",
  },
  {
    title: "Tarifas",
    url: "/dashboard/fare",
    icon: BadgeDollarSign,
    description: "Gestión de tarifas para los servicios",
  },
  {
    title: "Operaciones QR",
    url: "/dashboard/qr-operations",
    icon: QrCode,
    items: [
      {
        title: "Generar QR",
        url: "/dashboard/qr-operations/generate",
        description: "Crea códigos QR personalizados para el sistema",
      },
      {
        title: "Escanear QR",
        url: "/dashboard/qr-operations/scan",
        description: "Escanea códigos QR desde la cámara o una imagen",
      },
    ],
  },
  {
    title: "Recargas",
    url: "/dashboard/balance-recharge",
    icon: Wallet,
    description: "Gestión de recargas para tarjetas o cuentas",
  }
]

/**
 *   CreditCard,
  History,
 * {
    title: "Pagos",
    url: "#",
    icon: CreditCard,
    description: "Registro y gestión de pagos",
  },
  {
    title: "Historial de Servicios",
    url: "#",
    icon: History,
    description: "Historial de viajes y servicios prestados",
  },
 */