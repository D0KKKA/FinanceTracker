"use client"

import { useState, useEffect } from "react"
import { TransactionForm } from "@/components/transaction-form"
import { TransactionList } from "@/components/transaction-list"
import { StatsCard } from "@/components/stats-card"
import { LocalStorage, type Transaction } from "@/lib/storage"
import { TrendingUp, TrendingDown, Wallet, Settings, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadTransactions()
  }, [])

  const loadTransactions = () => {
    setTransactions(LocalStorage.getTransactions())
  }

  if (!mounted) return null

  const settings = LocalStorage.getSettings()

  const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const expenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const balance = income - expenses

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold glow-text mb-2">FinanceTracker</h1>
            <p className="text-muted-foreground">Управление личными финансами</p>
          </div>
          <div className="flex gap-2">
            <Link href="/analytics">
              <Button variant="outline" size="icon" className="glow bg-transparent">
                <BarChart3 className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline" size="icon" className="glow bg-transparent">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Баланс"
            value={`${balance.toFixed(2)} ${settings.currency}`}
            icon={Wallet}
            className="glow"
          />
          <StatsCard title="Доходы" value={`${income.toFixed(2)} ${settings.currency}`} icon={TrendingUp} />
          <StatsCard title="Расходы" value={`${expenses.toFixed(2)} ${settings.currency}`} icon={TrendingDown} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-semibold mb-4">Новая транзакция</h2>
            <TransactionForm onSuccess={loadTransactions} />
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">История транзакций</h2>
            <TransactionList transactions={transactions} onDelete={loadTransactions} />
          </div>
        </div>
      </div>
    </div>
  )
}
