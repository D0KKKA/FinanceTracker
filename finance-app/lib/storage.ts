export interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  description: string
  date: string
  createdAt: string
}

export interface Category {
  id: string
  name: string
  type: "income" | "expense"
  icon: string
  color: string
}

export interface Settings {
  currency: string
  backendUrl?: string
  syncEnabled: boolean
}

const STORAGE_KEYS = {
  TRANSACTIONS: "finance_transactions",
  CATEGORIES: "finance_categories",
  SETTINGS: "finance_settings",
}

// Default categories
const DEFAULT_CATEGORIES: Category[] = [
  { id: "1", name: "Зарплата", type: "income", icon: "💰", color: "chart-2" },
  { id: "2", name: "Фриланс", type: "income", icon: "💻", color: "chart-2" },
  { id: "3", name: "Инвестиции", type: "income", icon: "📈", color: "chart-2" },
  { id: "4", name: "Продукты", type: "expense", icon: "🛒", color: "chart-3" },
  { id: "5", name: "Транспорт", type: "expense", icon: "🚗", color: "chart-3" },
  { id: "6", name: "Развлечения", type: "expense", icon: "🎮", color: "chart-3" },
  { id: "7", name: "Здоровье", type: "expense", icon: "🏥", color: "chart-3" },
  { id: "8", name: "Образование", type: "expense", icon: "📚", color: "chart-3" },
]

export class LocalStorage {
  static getTransactions(): Transaction[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)
    return data ? JSON.parse(data) : []
  }

  static saveTransaction(transaction: Omit<Transaction, "id" | "createdAt">): Transaction {
    const transactions = this.getTransactions()
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    transactions.unshift(newTransaction)
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions))
    return newTransaction
  }

  static deleteTransaction(id: string): void {
    const transactions = this.getTransactions().filter((t) => t.id !== id)
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions))
  }

  static getCategories(): Category[] {
    if (typeof window === "undefined") return DEFAULT_CATEGORIES
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
    return data ? JSON.parse(data) : DEFAULT_CATEGORIES
  }

  static saveCategories(categories: Category[]): void {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
  }

  static getSettings(): Settings {
    if (typeof window === "undefined") return { currency: "₽", syncEnabled: false }
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    return data ? JSON.parse(data) : { currency: "₽", syncEnabled: false }
  }

  static saveSettings(settings: Settings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
  }
}
