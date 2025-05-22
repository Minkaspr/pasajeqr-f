import {
  BusFront,
  MapPin,
  BadgeDollarSign,
  QrCode,
  Wallet,
  CreditCard,
  History,
  Users,
} from "lucide-react"

export const titleNavMain = "Panel de Gestión"

export const navMainData = [
  {
    title: "Usuarios",
    url: "#",
    icon: Users,
    items: [
      { title: "Administradores", url: "/dashboard/user/admin" },
      { title: "Pasajeros", url: "/dashboard/user/passenger" },
      { title: "Conductores", url: "/dashboard/user/driver" },
    ],
  },
  {
    title: "Buses",
    url: "/dashboard/bus",
    icon: BusFront,
  },
  {
    title: "Paraderos",
    url: "/dashboard/stop",
    icon: MapPin,
  },
  {
    title: "Tarifas",
    url: "/dashboard/fare",
    icon: BadgeDollarSign,
  },
  {
    title: "Operaciones QR",
    url: "#",
    icon: QrCode,
    items: [
      { title: "Generar QR", url: "#" },
      { title: "Escanear QR", url: "#" },
    ],
  },
  {
    title: "Recargas",
    url: "#",
    icon: Wallet,
  },
  {
    title: "Pagos",
    url: "#",
    icon: CreditCard,
  },
  {
    title: "Historial de Servicios",
    url: "#",
    icon: History,
  },
]
