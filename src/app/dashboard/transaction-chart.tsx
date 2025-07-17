"use client"

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { subDays, format, isSameDay, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { useEffect, useState } from "react"
import { getTransactionSummaryLast7Days } from "./api"
import { TransactionSummaryItem } from "./dashboard"
import { ApiResponse } from "@/types/api-response"

const chartConfig = {
  recargas: {
    label: "Recargas",
    color: "#3b82f6", // azul
  },
  pagos: {
    label: "Pagos",
    color: "#10b981", // verde
  },
  total: {
    label: "Total",
    color: "#8b5cf6", // violeta
  },
}

export function TransactionChart() {
  const [chartData, setChartData] = useState<TransactionSummaryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: ApiResponse<{ data: TransactionSummaryItem[] }> =
          await getTransactionSummaryLast7Days()

        const rawData = res.data?.data
        const today = new Date()
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = subDays(today, 6 - i)
          return {
            date: format(date, "yyyy-MM-dd"),
            day: format(date, "EEE dd", { locale: es }),
            recargas: 0,
            pagos: 0,
            total: 0,
          }
        })

        const mergedData = last7Days.map((day) => {
          const match = rawData?.find((entry) =>
            isSameDay(parseISO(entry.date), parseISO(day.date))
          )
          if (match) {
            return {
              ...day,
              recargas: match.recargas,
              pagos: match.pagos,
              total: match.recargas + match.pagos,
            }
          }
          return day
        })

        setChartData(mergedData)
      } catch (err) {
        console.log("Error al obtener datos del backend:", err)
        setError("Error al obtener los datos del backend")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <p className="text-sm text-gray-500">Cargando gráfico...</p>
  if (error) return <p className="text-sm text-red-500">{error}</p>

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="day"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="recargas" fill={chartConfig.recargas.color} radius={[4, 4, 0, 0]} />
          <Bar dataKey="pagos" fill={chartConfig.pagos.color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
