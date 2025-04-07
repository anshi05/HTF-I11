"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "../../components/app-sidebar"
import { VoiceInput } from "../../components/voice-input"
import  VisualizationPanel from "../../components/visualization-panel"
import { SidebarInset } from "../../components/ui/sidebar"
import { useAuth } from "@/components/auth-provider"
import { motion } from "framer-motion"

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <SidebarInset>
        <main className="flex flex-col lg:flex-row w-full p-4 gap-4">
          <motion.div
            className="flex-1 flex flex-col gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <VoiceInput />
          </motion.div>
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <VisualizationPanel />
          </motion.div>
        </main>
      </SidebarInset>
    </div>
  )
}

