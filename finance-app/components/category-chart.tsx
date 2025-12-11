"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { DEFAULT_CATEGORIES, type Transaction, getCurrencySymbol } from "@/lib/storage"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { getChartColors, getChartColorPalette } from "@/lib/utils"

interface CategoryChartProps {
  transactions: Transaction[]
  type: "income" | "expense"
  currency?: string
}

export function CategoryChart({ transactions, type, currency = "RUB" }: CategoryChartProps) {
  const [colors, setColors] = useState<string[]>([])
  const [palette, setPalette] = useState(getChartColorPalette())

  useEffect(() => {
    setColors(getChartColors())
    setPalette(getChartColorPalette())
  }, [])

  const categories = DEFAULT_CATEGORIES.filter((c) => c.type === type)

  const data = categories
    .map((category) => {
      const total = transactions
        .filter((t) => t.type === type && t.category === category.name)
        .reduce((sum, t) => sum + t.amount, 0)
      return {
        name: category.name,
        value: total,
        icon: category.icon,
      }
    })
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)

  if (data.length === 0) {
    return (
      <Card className="p-6 border-border/50">
        <h3 className="text-lg font-semibold mb-4">{type === "income" ? "Доходы" : "Расходы"} по категориям</h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground">Нет данных</div>
      </Card>
    )
  }

  return (
    <Card className="p-6 border-border/50 hover:border-primary/30 transition-colors">
      <h3 className="text-lg font-semibold mb-4">{type === "income" ? "Доходы" : "Расходы"} по категориям</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `${value.toFixed(2)} ${getCurrencySymbol(currency)}`}
            contentStyle={{
              backgroundColor: palette.card,
              border: `1px solid ${palette.border}`,
              borderRadius: "8px",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </div>
            <span className="font-mono font-semibold">
              {item.value.toFixed(2)} {getCurrencySymbol(currency)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
