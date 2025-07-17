"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Car, MapPin, CreditCard } from "lucide-react";
import { DashboardStatsRS } from "./dashboard";
import { useEffect, useState } from "react";
import { getUserDashboardStats } from "./api";
import { TransactionChart } from "./transaction-chart";
import { DriverChart } from "./DriverChart";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStatsRS | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getUserDashboardStats()
        setStats(response.data)
      } catch (error) {
        console.error("Error al cargar estadísticas del dashboard:", error)
      }
    }

    fetchStats()
  }, [])
  const passengerGrowth = stats?.passengerGrowth ?? 0
  const driverGrowth = stats?.driverGrowth ?? 0
  const vehicleGrowth = stats?.vehicleGrowth ?? 0;
  const stopGrowth = stats?.stopGrowth ?? 0;

  return (
    <div className="h-full p-2 md:p-4 lg:p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Métricas principales */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-600 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Pasajeros Registrados</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {stats?.totalPassengers.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500">
                {stats?.todayPassengers ?? 0} registrados hoy,&nbsp;
              </p>
              <p>
                {passengerGrowth > 0 ? (
                  <span className="text-green-600 font-medium">
                    {passengerGrowth.toFixed(1)}% más que ayer
                  </span>
                ) : passengerGrowth < 0 ? (
                  <span className="text-red-600 font-medium">
                    {Math.abs(passengerGrowth).toFixed(1)}% menos que ayer
                  </span>
                ) : (
                  <span className="text-slate-500 font-medium">igual que ayer</span>
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-600 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Conductores Registrados</CardTitle>
              <Users className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats?.totalDrivers.toLocaleString()}</div>
              <p className="text-xs text-slate-500">
                {stats?.todayDrivers ?? 0} registrados hoy,&nbsp;
              </p>
              <p>
                {driverGrowth > 0 ? (
                  <span className="text-green-600 font-medium">
                    {driverGrowth.toFixed(1)}% más que ayer
                  </span>
                ) : driverGrowth < 0 ? (
                  <span className="text-red-600 font-medium">
                    {Math.abs(driverGrowth).toFixed(1)}% menos que ayer
                  </span>
                ) : (
                  <span className="text-slate-500 font-medium">igual que ayer</span>
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-600 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Vehículos Registrados</CardTitle>
              <Car className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {stats?.totalVehicles.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500">
                {stats?.todayVehicles ?? 0} registrados hoy,&nbsp;
              </p>
              <p>
                {vehicleGrowth > 0 ? (
                  <span className="text-green-600 font-medium">
                    {vehicleGrowth.toFixed(1)}% más que ayer
                  </span>
                ) : vehicleGrowth < 0 ? (
                  <span className="text-red-600 font-medium">
                    {Math.abs(vehicleGrowth).toFixed(1)}% menos que ayer
                  </span>
                ) : (
                  <span className="text-slate-500 font-medium">igual que ayer</span>
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-600 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Paraderos Autorizados</CardTitle>
              <MapPin className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {stats?.totalStops.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500">
                {stats?.todayStops ?? 0} registrados hoy,&nbsp;
              </p>
              <p>
                {stopGrowth > 0 ? (
                  <span className="text-green-600 font-medium">
                    {stopGrowth.toFixed(1)}% más que ayer
                  </span>
                ) : stopGrowth < 0 ? (
                  <span className="text-red-600 font-medium">
                    {Math.abs(stopGrowth).toFixed(1)}% menos que ayer
                  </span>
                ) : (
                  <span className="text-slate-500 font-medium">igual que ayer</span>
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos principales */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Actividad de Recargas y Pagos (Últimos 7 días)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionChart />
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-600" />
                Estado Actual de los Conductores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DriverChart />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
