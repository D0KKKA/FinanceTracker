export interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  description: string
  date: string
  createdAt: string
}

export interface Currency {
  code: string
  symbol: string
  name: string
}

export const CURRENCIES: Currency[] = [
  { code: "RUB", symbol: "₽", name: "Российский рубль" },
  { code: "KZT", symbol: "₸", name: "Казахстанский тенге" },
  { code: "USD", symbol: "$", name: "Доллар США" }
]

export function getCurrencySymbol(currencyCode: string): string {
  const currency = CURRENCIES.find(c => c.code === currencyCode)
  return currency?.symbol || "₽"
}

export function getCurrencyName(currencyCode: string): string {
  const currency = CURRENCIES.find(c => c.code === currencyCode)
  return currency?.name || "Российский рубль"
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

// Default categories - used as reference only
export const DEFAULT_CATEGORIES: Category[] = [
  { id: "1", name: "Зарплата", type: "income", icon: "💰", color: "chart-2" },
  { id: "2", name: "Фриланс", type: "income", icon: "💻", color: "chart-2" },
  { id: "3", name: "Инвестиции", type: "income", icon: "📈", color: "chart-2" },
  { id: "4", name: "Продукты", type: "expense", icon: "🛒", color: "chart-3" },
  { id: "5", name: "Транспорт", type: "expense", icon: "🚗", color: "chart-3" },
  { id: "6", name: "Развлечения", type: "expense", icon: "🎮", color: "chart-3" },
  { id: "7", name: "Здоровье", type: "expense", icon: "🏥", color: "chart-3" },
  { id: "8", name: "Образование", type: "expense", icon: "📚", color: "chart-3" },
]

// LocalStorage is deprecated - use API through useAuth hook instead
export class LocalStorage {
  static getTransactions(): Transaction[] {
    console.warn("LocalStorage.getTransactions() is deprecated. Use API through useAuth hook.")
    return []
  }

  static saveTransaction(transaction: Omit<Transaction, "id" | "createdAt">): Transaction {
    throw new Error("LocalStorage.saveTransaction() is deprecated. Use API through useAuth hook.")
  }

  static deleteTransaction(id: string): void {
    throw new Error("LocalStorage.deleteTransaction() is deprecated. Use API through useAuth hook.")
  }

  static getCategories(): Category[] {
    return DEFAULT_CATEGORIES
  }

  static saveCategories(categories: Category[]): void {
    throw new Error("LocalStorage.saveCategories() is deprecated. Use API through useAuth hook.")
  }

  static getSettings(): Settings {
    return { currency: "RUB", syncEnabled: false }
  }

  static saveSettings(settings: Settings): void {
    throw new Error("LocalStorage.saveSettings() is deprecated. Use API through useAuth hook.")
  }
}
