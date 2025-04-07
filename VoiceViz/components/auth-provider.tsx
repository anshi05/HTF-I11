"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  name: string
  email: string
} | null

type AuthContextType = {
  user: User
  isLoading: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
      if (isLoggedIn) {
        const userData = JSON.parse(localStorage.getItem("currentUser") || "null")
        setUser(userData)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  // Redirect unauthenticated users from protected routes
  useEffect(() => {
    if (!isLoading) {
      const isLoggedIn = !!user
      const isAuthRoute = pathname === "/login" || pathname === "/signup"

      if (!isLoggedIn && !isAuthRoute && pathname !== "/") {
        router.push("/login")
      }

      // Redirect logged in users away from auth pages
      if (isLoggedIn && isAuthRoute) {
        router.push("/")
      }
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const foundUser = users.find((u: any) => u.email === email && u.password === password)

      if (!foundUser) {
        setIsLoading(false)
        return false
      }

      // Set logged in state
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          name: foundUser.name,
          email: foundUser.email,
        }),
      )

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email)
      } else {
        localStorage.removeItem("rememberedEmail")
      }

      setUser({
        name: foundUser.name,
        email: foundUser.email,
      })

      setIsLoading(false)
      return true
    } catch (error) {
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("currentUser")
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

