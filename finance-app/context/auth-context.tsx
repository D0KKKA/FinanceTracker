"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import { BackendAPI, AuthResponse, RegisterRequest, LoginRequest } from "@/lib/api"

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
  const [api, setApi] = useState<BackendAPI | null>(null)

  // Check authentication on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = useCallback(async () => {
    setLoading(true)
    try {
      // Try to get the stored token from a cookie or session
      // For now, we'll assume no token on initial load
      const defaultApi = new BackendAPI(API_BASE_URL)
      setApi(defaultApi)
    } catch (error) {
      console.error("Failed to check auth:", error)
    } finally {
      setLoading(false)
    }
  }, [])

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

    const authenticatedApi = new BackendAPI(API_BASE_URL, response.token)
    setApi(authenticatedApi)

    return response
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
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
    api: api || new BackendAPI(API_BASE_URL),
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
