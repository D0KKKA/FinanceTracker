"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { AuthForm } from "@/components/auth-form"

export default function AuthPage() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()
  const [mode, setMode] = useState<"login" | "register">("login")

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/")
    }
  }, [loading, isAuthenticated, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <AuthForm mode={mode} onModeChange={setMode} />
    </div>
  )
}
