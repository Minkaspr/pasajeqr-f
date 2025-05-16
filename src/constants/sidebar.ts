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
      { title: "Administradores", url: "#" },
      { title: "Pasajeros", url: "#" },
      { title: "Conductores", url: "#" },
    ],
  },
  {
    title: "Buses",
    url: "#",
    icon: BusFront,
  },
  {
    title: "Paraderos",
    url: "#",
    icon: MapPin,
  },
  {
    title: "Tarifas",
    url: "#",
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
