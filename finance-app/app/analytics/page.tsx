"use client"

import { useState, useEffect } from "react"
import { type Transaction, getCurrencySymbol } from "@/lib/storage"
import { CategoryChart } from "@/components/category-chart"
import { TrendChart } from "@/components/trend-chart"
import { StatsCard } from "@/components/stats-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, TrendingDown, PieChart, Calendar } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { useSettings } from "@/hooks/use-settings"

export default function AnalyticsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [period, setPeriod] = useState<"week" | "month" | "year" | "all">("month")
  const [mounted, setMounted] = useState(false)
  const { api, isAuthenticated } = useAuth()
  const { settings } = useSettings()
  const { toast } = useToast()
  const currency = settings?.currency ?? "RUB"

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!api || !isAuthenticated) return
    loadTransactions()
  }, [api, isAuthenticated])

  const loadTransactions = async () => {
    if (!api || !isAuthenticated) {
      toast({
        title: "Ошибка",
        description: "Требуется авторизация",
        variant: "destructive",
      })
      return
    }
    try {
      const data = await api.getTransactions()
      setTransactions(data)
    } catch (error: any) {
      console.error("Failed to load transactions:", error)
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось загрузить транзакции",
        variant: "destructive",
      })
    }
  }

  if (!mounted) return null

  // Filter transactions by period
  const now = new Date()
  const filteredTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date)
    if (period === "all") return true

    const diffTime = now.getTime() - transactionDate.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)

    if (period === "week") return diffDays <= 7
    if (period === "month") return diffDays <= 30
    if (period === "year") return diffDays <= 365
    return true
  })

  const income = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const expenses = filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const avgExpense = expenses / (filteredTransactions.filter((t) => t.type === "expense").length || 1)
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold glow-text mb-2">Аналитика</h1>
              <p className="text-muted-foreground">Детальная статистика ваших финансов</p>
            </div>
            <Select value={period} onValueChange={(v: any) => setPeriod(v)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Неделя</SelectItem>
                <SelectItem value="month">Месяц</SelectItem>
                <SelectItem value="year">Год</SelectItem>
                <SelectItem value="all">Все время</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Общий доход"
            value={`${income.toFixed(2)} ${getCurrencySymbol(currency)}`}
            icon={TrendingUp}
            trend={`${filteredTransactions.filter((t) => t.type === "income").length} транзакций`}
          />
          <StatsCard
            title="Общие расходы"
            value={`${expenses.toFixed(2)} ${getCurrencySymbol(currency)}`}
            icon={TrendingDown}
            trend={`${filteredTransactions.filter((t) => t.type === "expense").length} транзакций`}
          />
          <StatsCard title="Средний расход" value={`${avgExpense.toFixed(2)} ${getCurrencySymbol(currency)}`} icon={PieChart} />
          <StatsCard
            title="Норма сбережений"
            value={`${savingsRate.toFixed(1)}%`}
            icon={Calendar}
            trend={savingsRate > 20 ? "Отлично!" : "Можно лучше"}
          />
        </div>

        <div className="mb-8">
          <TrendChart transactions={filteredTransactions} currency={currency} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CategoryChart transactions={filteredTransactions} type="expense" currency={currency} />
          <CategoryChart transactions={filteredTransactions} type="income" currency={currency} />
        </div>
      </div>
    </div>
  )
}
