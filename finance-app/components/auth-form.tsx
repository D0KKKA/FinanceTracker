"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface AuthFormProps {
  mode: "login" | "register"
  onModeChange: (mode: "login" | "register") => void
}

export function AuthForm({ mode, onModeChange }: AuthFormProps) {
  const router = useRouter()
  const { login, register } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === "login") {
        if (!formData.email || !formData.password) {
          toast({
            title: "Ошибка",
            description: "Заполните все поля",
            variant: "destructive",
          })
          setLoading(false)
          return
        }

        await login({
          email: formData.email,
          password: formData.password,
        })

        toast({
          title: "Успешный вход",
          description: "Добро пожаловать!",
        })

        router.push("/")
      } else {
        if (!formData.email || !formData.password || !formData.name) {
          toast({
            title: "Ошибка",
            description: "Заполните все поля",
            variant: "destructive",
          })
          setLoading(false)
          return
        }

        await register({
          email: formData.email,
          name: formData.name,
          password: formData.password,
        })

        toast({
          title: "Регистрация успешна",
          description: "Добро пожаловать!",
        })

        router.push("/")
      }
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Что-то пошло не так",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-center mb-6">
          {mode === "login" ? "Вход" : "Регистрация"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Ваше имя"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Загрузка..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            {mode === "login"
              ? "Нет аккаунта? "
              : "Уже есть аккаунт? "}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onModeChange(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Зарегистрироваться" : "Войти"}
          </Button>
        </div>
      </div>
    </div>
  )
}
