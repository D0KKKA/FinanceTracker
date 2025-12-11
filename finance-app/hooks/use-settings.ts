import { useAuth } from "./use-auth"
import { useState, useCallback, useEffect } from "react"
import type { Settings } from "@/lib/storage"

export function useSettings() {
  const { api } = useAuth()
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load settings
  const loadSettings = useCallback(async () => {
    if (!api) return
    try {
      setLoading(true)
      setError(null)
      const data = await api.getSettings()
      setSettings(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load settings"
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [api])

  // Save settings
  const saveSettings = useCallback(
    async (newSettings: Partial<Omit<Settings, "id" | "createdAt" | "updatedAt">>) => {
      if (!api) return
      try {
        setError(null)
        const updated = await api.updateSettings(newSettings)
        setSettings(updated)
        return updated
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to save settings"
        setError(message)
        throw err
      }
    },
    [api]
  )

  // Load settings on mount
  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  return {
    settings,
    loading,
    error,
    saveSettings,
    refresh: loadSettings,
  }
}
