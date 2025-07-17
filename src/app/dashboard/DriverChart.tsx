'use client'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { DriverStatus, DriverStatusCountRS } from './dashboard';
import { ApiResponse } from '@/types/api-response';
import { useState, useEffect } from 'react';
import { fetchDriverStatusSummary } from './api';

// Etiquetas y colores para cada estado de conductor
const driverStatusLabels: Record<DriverStatus, { label: string; color: string }> = {
  AVAILABLE: { label: 'Disponible', color: '#10b981' },
  ON_SERVICE: { label: 'En servicio', color: '#3b82f6' },
  OFF_DUTY: { label: 'Libre', color: '#f59e0b' },
  SICK_LEAVE: { label: 'Baja médica', color: '#ef4444' },
}

export function DriverChart() {
  const [data, setData] = useState<DriverStatusCountRS[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const response: ApiResponse<DriverStatusCountRS[]> = await fetchDriverStatusSummary()
        setData(response.data ?? [])
      } catch (error) {
        console.error("Error al cargar el resumen de conductores:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const driverChartData = data.map((item) => ({
    name: driverStatusLabels[item.status].label,
    value: item.count,
    color: driverStatusLabels[item.status].color,
  }))

  if (loading) {
    return (
      <ChartContainer config={driverStatusLabels} className="h-[300px] w-full flex items-center justify-center">
        <span className="text-gray-500">Cargando resumen de conductores...</span>
      </ChartContainer>
    )
  }

  return (
    <ChartContainer config={driverStatusLabels} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={driverChartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {driverChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>

          <ChartTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                const total = driverChartData.reduce((a, b) => a + b.value, 0)
                const percent = ((data.value / total) * 100).toFixed(1)

                return (
                  <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900">{data.name}</p>
                    <p className="text-sm text-gray-600">{data.value} conductores</p>
                    <p className="text-xs text-gray-500">{percent}%</p>
                  </div>
                )
              }
              return null
            }}
          />

          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: entry.color, fontWeight: 500 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
