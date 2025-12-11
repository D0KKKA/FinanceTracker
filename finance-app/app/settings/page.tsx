"use client"

import { useState, useEffect } from "react"
import { CURRENCIES } from "@/lib/storage"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, Check, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useSettings } from "@/hooks/use-settings"

export default function SettingsPage() {
  const { settings, loading, error, saveSettings } = useSettings()
  const [currency, setCurrency] = useState("RUB")
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (settings?.currency) {
      setCurrency(settings.currency)
    }
  }, [settings])

  const handleCurrencyChange = async (newCurrency: string) => {
    setCurrency(newCurrency)
    setSaveSuccess(false)
    setIsSaving(true)
    try {
      await saveSettings({ currency: newCurrency })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    } catch (err) {
      // Error is handled by the hook
    } finally {
      setIsSaving(false)
    }
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
          </Link>
          <h1 className="text-4xl font-bold glow-text">Настройки</h1>
        </div>

        <Card className="p-6 space-y-6 glow border-primary/20">
          <div className="space-y-2">
            <Label htmlFor="currency">Валюта</Label>
            <Select value={currency} onValueChange={handleCurrencyChange} disabled={isSaving}>
              <SelectTrigger disabled={isSaving}>
                <SelectValue placeholder="Выберите валюту" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>
                    {curr.symbol} {curr.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-600">Настройки сохранены</p>
            </div>
          )}

          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Настройки синхронизируются с бэкендом автоматически. Все данные хранятся на сервере.
            </p>
          </div>

          <Link href="/">
            <Button className="w-full glow" size="lg">
              Вернуться на главную
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}
