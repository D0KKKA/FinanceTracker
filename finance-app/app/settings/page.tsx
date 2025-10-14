"use client"

import { useState, useEffect } from "react"
import { LocalStorage, type Settings, CURRENCIES, getCurrencySymbol } from "@/lib/storage"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<Settings>({
    currency: "RUB",
    syncEnabled: false,
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSettings(LocalStorage.getSettings())
  }, [])

  const handleSave = () => {
    LocalStorage.saveSettings(settings)
    router.push("/")
  }

  if (!mounted) return null

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
            <Select value={settings.currency} onValueChange={(value) => setSettings({ ...settings, currency: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите валюту" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-lg font-semibold">Синхронизация с бэкендом</h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="sync">Включить синхронизацию</Label>
              <Switch
                id="sync"
                checked={settings.syncEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, syncEnabled: checked })}
              />
            </div>

            {settings.syncEnabled && (
              <div className="space-y-2">
                <Label htmlFor="backend">URL бэкенда</Label>
                <Input
                  id="backend"
                  value={settings.backendUrl || ""}
                  onChange={(e) => setSettings({ ...settings, backendUrl: e.target.value })}
                  placeholder="https://api.example.com"
                />
                <p className="text-sm text-muted-foreground">
                  Укажите URL вашего бэкенд-сервера для синхронизации данных
                </p>
              </div>
            )}
          </div>

          <Button onClick={handleSave} className="w-full glow" size="lg">
            Сохранить настройки
          </Button>
        </Card>
      </div>
    </div>
  )
}
