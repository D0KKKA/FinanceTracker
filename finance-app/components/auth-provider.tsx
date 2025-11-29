"use client"

import { AuthProvider as ContextAuthProvider } from "@/context/auth-context"
import { AuthGuard } from "@/components/auth-guard"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ContextAuthProvider>
      <AuthGuard>{children}</AuthGuard>
    </ContextAuthProvider>
  )
}
