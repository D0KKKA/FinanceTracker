"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LocalStorage } from "@/lib/storage"
import { Card } from "@/components/ui/card"

interface TransactionFormProps {
  onSuccess: () => void
}

export function TransactionForm({ onSuccess }: TransactionFormProps) {
  const [type, setType] = useState<"income" | "expense">("expense")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  const categories = LocalStorage.getCategories().filter((c) => c.type === type)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !category) return

    LocalStorage.saveTransaction({
      type,
      amount: Number.parseFloat(amount),
      category,
      description,
      date,
    })

    setAmount("")
    setCategory("")
    setDescription("")
    setDate(new Date().toISOString().split("T")[0])
    onSuccess()
  }

  return (
    <Card className="p-6 glow border-primary/20">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Button
            type="button"
            variant={type === "expense" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setType("expense")}
          >
            Расход
          </Button>
          <Button
            type="button"
            variant={type === "income" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setType("income")}
          >
            Доход
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Сумма</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="text-2xl font-mono"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Категория</Label>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger id="category">
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  <span className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Описание</Label>
          <Input
            id="description"
            placeholder="Необязательно"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Дата</Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <Button type="submit" className="w-full glow" size="lg">
          Добавить транзакцию
        </Button>
      </form>
    </Card>
  )
}
