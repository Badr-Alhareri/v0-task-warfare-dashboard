"use client"

import { useState, useEffect } from "react"
import { Activity } from "lucide-react"

export function LiveClock() {
  const [time, setTime] = useState<Date | null>(null)

  useEffect(() => {
    setTime(new Date())
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  if (!time) return null

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-primary">
        <Activity className="h-4 w-4 animate-pulse-soft" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Live Ops</span>
      </div>
      <div className="font-mono text-lg font-semibold tracking-tight text-foreground">
        {time.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })}
      </div>
      <div className="text-xs text-muted-foreground">
        {time.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })}
      </div>
    </div>
  )
}
