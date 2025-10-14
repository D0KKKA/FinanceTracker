import type { Transaction, Settings } from "./storage"

export class BackendAPI {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async syncTransactions(transactions: Transaction[]): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/transactions/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactions }),
      })
      if (!response.ok) throw new Error("Sync failed")
    } catch (error) {
      console.error("[v0] Backend sync error:", error)
      throw error
    }
  }

  async fetchTransactions(): Promise<Transaction[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/transactions`)
      if (!response.ok) throw new Error("Fetch failed")
      return await response.json()
    } catch (error) {
      console.error("[v0] Backend fetch error:", error)
      throw error
    }
  }
}

export function getAPI(settings: Settings): BackendAPI | null {
  if (!settings.syncEnabled || !settings.backendUrl) return null
  return new BackendAPI(settings.backendUrl)
}
