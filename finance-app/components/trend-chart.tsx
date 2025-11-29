"use client"

import { Card } from "@/components/ui/card"
import { type Transaction, getCurrencySymbol } from "@/lib/storage"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface TrendChartProps {
  transactions: Transaction[]
  currency?: string
}

export function TrendChart({ transactions, currency = "RUB" }: TrendChartProps) {

  // Group transactions by month
  const monthlyData = transactions.reduce(
    (acc, transaction) => {
      const date = new Date(transaction.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, income: 0, expense: 0 }
      }

      if (transaction.type === "income") {
        acc[monthKey].income += transaction.amount
      } else {
        acc[monthKey].expense += transaction.amount
      }

      return acc
    },
    {} as Record<string, { month: string; income: number; expense: number }>,
  )

  const data = Object.values(monthlyData)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6) // Last 6 months
    .map((item) => ({
      ...item,
      month: new Date(item.month + "-01").toLocaleDateString("ru-RU", {
        month: "short",
        year: "numeric",
      }),
    }))

  if (data.length === 0) {
    return (
      <Card className="p-6 border-border/50">
        <h3 className="text-lg font-semibold mb-4">Динамика доходов и расходов</h3>
        <div className="h-80 flex items-center justify-center text-muted-foreground">Нет данных</div>
      </Card>
    )
  }

  return (
    <Card className="p-6 border-border/50 hover:border-primary/30 transition-colors">
      <h3 className="text-lg font-semibold mb-4">Динамика доходов и расходов</h3>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" style={{ fontSize: "12px" }} />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: "12px" }}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            formatter={(value: number) => `${value.toFixed(2)} ${getCurrencySymbol(currency)}`}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            stroke="hsl(var(--chart-2))"
            strokeWidth={3}
            name="Доходы"
            dot={{ fill: "hsl(var(--chart-2))", r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="hsl(var(--chart-3))"
            strokeWidth={3}
            name="Расходы"
            dot={{ fill: "hsl(var(--chart-3))", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
