"use client"

import { LocalStorage, type Transaction, getCurrencySymbol } from "@/lib/storage"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface TransactionListProps {
  transactions: Transaction[]
  onDelete: () => void
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const categories = LocalStorage.getCategories()
  const settings = LocalStorage.getSettings()

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName)
    return category?.icon || "💸"
  }

  const handleDelete = (id: string) => {
    LocalStorage.deleteTransaction(id)
    onDelete()
  }

  const formatAmount = (amount: number, type: "income" | "expense") => {
    const sign = type === "income" ? "+" : "-"
    return `${sign}${amount.toFixed(2)} ${getCurrencySymbol(settings.currency)}`
  }

  if (transactions.length === 0) {
    return (
      <Card className="p-8 text-center border-border/50">
        <p className="text-muted-foreground">Нет транзакций</p>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => (
        <Card
          key={transaction.id}
          className="p-4 flex items-center justify-between hover:border-primary/30 transition-colors"
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="text-3xl">{getCategoryIcon(transaction.category)}</div>
            <div className="flex-1">
              <div className="font-medium">{transaction.category}</div>
              {transaction.description && (
                <div className="text-sm text-muted-foreground">{transaction.description}</div>
              )}
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(transaction.date).toLocaleDateString("ru-RU")}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div
              className={`text-lg font-mono font-semibold ${
                transaction.type === "income" ? "text-accent" : "text-destructive"
              }`}
            >
              {formatAmount(transaction.amount, transaction.type)}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(transaction.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
