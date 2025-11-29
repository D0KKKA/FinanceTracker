import type { Transaction, Settings, Category } from "./storage"

export interface AuthResponse {
  id: string
  email: string
  name: string
  token: string
}

export interface RegisterRequest {
  email: string
  name: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export class BackendAPI {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string, token?: string) {
    this.baseUrl = baseUrl
    this.token = token || null
  }

  setToken(token: string): void {
    this.token = token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API error: ${response.status}`)
    }

    return response.json() as Promise<T>
  }

  // Auth endpoints
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getMe(): Promise<{ id: string; email: string; name: string }> {
    return this.request("/api/auth/me", {
      method: "GET",
    })
  }

  // Transaction endpoints
  async createTransaction(transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">): Promise<Transaction> {
    return this.request<Transaction>("/api/transactions", {
      method: "POST",
      body: JSON.stringify(transaction),
    })
  }

  async getTransactions(): Promise<Transaction[]> {
    return this.request<Transaction[]>("/api/transactions", {
      method: "GET",
    })
  }

  async getTransaction(id: string): Promise<Transaction> {
    return this.request<Transaction>(`/api/transactions/${id}`, {
      method: "GET",
    })
  }

  async updateTransaction(
    id: string,
    transaction: Partial<Omit<Transaction, "id" | "createdAt" | "updatedAt">>
  ): Promise<Transaction> {
    return this.request<Transaction>(`/api/transactions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(transaction),
    })
  }

  async deleteTransaction(id: string): Promise<void> {
    return this.request<void>(`/api/transactions/${id}`, {
      method: "DELETE",
    })
  }

  async syncTransactions(transactions: Transaction[]): Promise<void> {
    return this.request<void>("/api/transactions/sync", {
      method: "POST",
      body: JSON.stringify({ transactions }),
    })
  }

  // Category endpoints
  async createCategory(category: Omit<Category, "id" | "createdAt" | "updatedAt">): Promise<Category> {
    return this.request<Category>("/api/categories", {
      method: "POST",
      body: JSON.stringify(category),
    })
  }

  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>("/api/categories", {
      method: "GET",
    })
  }

  async getCategory(id: string): Promise<Category> {
    return this.request<Category>(`/api/categories/${id}`, {
      method: "GET",
    })
  }

  async updateCategory(
    id: string,
    category: Partial<Omit<Category, "id" | "createdAt" | "updatedAt">>
  ): Promise<Category> {
    return this.request<Category>(`/api/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(category),
    })
  }

  async deleteCategory(id: string): Promise<void> {
    return this.request<void>(`/api/categories/${id}`, {
      method: "DELETE",
    })
  }

  async seedDefaultCategories(): Promise<void> {
    return this.request<void>("/api/categories/seed", {
      method: "POST",
    })
  }
}

export function getAPI(baseUrl: string, token?: string): BackendAPI {
  return new BackendAPI(baseUrl, token)
}
