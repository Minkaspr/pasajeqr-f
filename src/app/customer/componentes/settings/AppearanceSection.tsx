"use client"

import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function AppearanceSection() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const dark = localStorage.getItem("theme") === "dark"
    setIsDarkMode(dark)
    document.documentElement.classList.toggle("dark", dark)
  }, [])

  const toggleTheme = (checked: boolean) => {
    setIsDarkMode(checked)
    localStorage.setItem("theme", checked ? "dark" : "light")
    document.documentElement.classList.toggle("dark", checked)
  }

  return (
    <div className="flex items-center justify-between">
      <Label>Modo Oscuro</Label>
      <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
    </div>
  )
}
