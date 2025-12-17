"use client"

import { motion } from "framer-motion"
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react"
import type { Task } from "@/lib/store"
import { getTaskDisplayStatus } from "@/lib/store"
import { cn } from "@/lib/utils"

interface SystemStatusProps {
  tasks: Task[]
}

export function SystemStatus({ tasks }: SystemStatusProps) {
  const urgent = tasks.filter((t) => getTaskDisplayStatus(t) === "urgent").length
  const pending = tasks.filter((t) => getTaskDisplayStatus(t) === "pending").length
  const completed = tasks.filter(
    (t) => getTaskDisplayStatus(t) === "completed" || getTaskDisplayStatus(t) === "late_completed",
  ).length

  const statusItems = [
    {
      label: "Critical",
      value: urgent,
      icon: AlertTriangle,
      className: urgent > 0 ? "text-destructive" : "text-muted-foreground",
      bg: urgent > 0 ? "bg-destructive/10" : "bg-secondary",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      className: "text-info",
      bg: "bg-info/10",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      className: "text-success",
      bg: "bg-success/10",
    },
  ]

  return (
    <div className="flex items-center gap-4">
      {statusItems.map((item) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn("flex items-center gap-2 rounded-lg px-3 py-2", item.bg)}
        >
          <item.icon className={cn("h-4 w-4", item.className)} />
          <span className={cn("text-sm font-medium", item.className)}>{item.value}</span>
          <span className="text-xs text-muted-foreground">{item.label}</span>
        </motion.div>
      ))}
    </div>
  )
}
