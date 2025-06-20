"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Recharge } from "@/app/customer/ClientInterface"

type Props = {
  rechargeHistory: Recharge[]
  isDarkMode: boolean
}

export function RechargeHistoryCard({ rechargeHistory, isDarkMode }: Props) {
  return (
    <Card className={`${isDarkMode ? "dark:bg-gray-800" : "bg-white"}`}>
      <CardHeader>
        <CardTitle>Historial de Recargas</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full table-auto text-sm">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Método</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {rechargeHistory.map((r) => (
              <tr key={r.id}>
                <td>{r.date}</td>
                <td>{r.method}</td>
                <td>${r.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
