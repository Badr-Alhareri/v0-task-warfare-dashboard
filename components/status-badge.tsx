"use client"

import { cn } from "@/lib/utils"
import { Clock, CheckCircle, AlertTriangle, AlertOctagon } from "lucide-react"
import { motion } from "framer-motion"

type StatusType = "pending" | "urgent" | "completed" | "late_completed"

const statusConfig: Record<
  StatusType,
  {
    label: string
    icon: typeof Clock
    className: string
  }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-info/20 text-info border-info/30",
  },
  urgent: {
    label: "OVERDUE",
    icon: AlertOctagon,
    className: "bg-destructive/20 text-destructive border-destructive/30 animate-pulse-soft",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    className: "bg-success/20 text-success border-success/30",
  },
  late_completed: {
    label: "Late",
    icon: AlertTriangle,
    className: "bg-warning/20 text-warning border-warning/30",
  },
}

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        config.className,
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </motion.div>
  )
}
