"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import { BackendAPI, AuthResponse, RegisterRequest, LoginRequest } from "@/lib/api"

const STORAGE_TOKEN_KEY = "finance_token"
const STORAGE_USER_KEY = "finance_user"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  isAuthenticated: boolean
  login: (data: LoginRequest) => Promise<AuthResponse>
  register: (data: RegisterRequest) => Promise<AuthResponse>
  logout: () => void
  api: BackendAPI | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [api, setApi] = useState<BackendAPI>(() => new BackendAPI(API_BASE_URL))

  const checkAuth = useCallback(async () => {
    setLoading(true)
    try {
      const storedToken = typeof window !== "undefined" ? localStorage.getItem(STORAGE_TOKEN_KEY) : null

      if (storedToken) {
        const apiClient = new BackendAPI(API_BASE_URL, storedToken)
        try {
          const profile = await apiClient.getMe()
          setToken(storedToken)
          setUser({
            id: profile.id,
            email: profile.email,
            name: profile.name,
          })
          setApi(apiClient)
        } catch (error) {
          console.error("Stored token invalid, clearing session:", error)
          localStorage.removeItem(STORAGE_TOKEN_KEY)
          localStorage.removeItem(STORAGE_USER_KEY)
          setUser(null)
          setToken(null)
          setApi(new BackendAPI(API_BASE_URL))
        }
      } else {
        const defaultApi = new BackendAPI(API_BASE_URL)
        setApi(defaultApi)
        setUser(null)
        setToken(null)
      }
    } catch (error) {
      console.error("Failed to check auth:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Check authentication on mount
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = useCallback(async (data: LoginRequest): Promise<AuthResponse> => {
    const apiClient = new BackendAPI(API_BASE_URL)
    const response = await apiClient.login(data)

    // Store token in memory and create authenticated API client
    setToken(response.token)
    setUser({
      id: response.id,
      email: response.email,
      name: response.name,
    })
    localStorage.setItem(STORAGE_TOKEN_KEY, response.token)
    localStorage.setItem(
      STORAGE_USER_KEY,
      JSON.stringify({ id: response.id, email: response.email, name: response.name })
    )

    const authenticatedApi = new BackendAPI(API_BASE_URL, response.token)
    setApi(authenticatedApi)

    return response
  }, [])

  const register = useCallback(async (data: RegisterRequest): Promise<AuthResponse> => {
    const apiClient = new BackendAPI(API_BASE_URL)
    const response = await apiClient.register(data)

    // Store token in memory and create authenticated API client
    setToken(response.token)
    setUser({
      id: response.id,
      email: response.email,
      name: response.name,
    })
    localStorage.setItem(STORAGE_TOKEN_KEY, response.token)
    localStorage.setItem(
      STORAGE_USER_KEY,
      JSON.stringify({ id: response.id, email: response.email, name: response.name })
    )

    const authenticatedApi = new BackendAPI(API_BASE_URL, response.token)
    setApi(authenticatedApi)

    return response
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_TOKEN_KEY)
      localStorage.removeItem(STORAGE_USER_KEY)
    }
    setApi(new BackendAPI(API_BASE_URL))
  }, [])

  const value: AuthContextType = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    api,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}
