"use client"

import { useAuthContext } from "@/context/auth-context"

// Re-export from auth context
export function useAuth() {
  return useAuthContext()
}
