"use client"
import { motion } from "framer-motion"
import { LiveClock } from "@/components/live-clock"
import { Navigation, Logo } from "@/components/navigation"
import { RosterView } from "@/components/roster-view"
import { mockPeople, mockTasks } from "@/lib/store"
import { Toaster } from "@/components/ui/sonner"
import { Trophy } from "lucide-react"

export default function RosterPage() {
  return (
    <div className="min-h-screen bg-background">
      <Toaster theme="dark" position="bottom-right" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Logo />
              <Navigation />
            </div>
            <LiveClock />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20 border border-warning/30">
              <Trophy className="h-5 w-5 text-warning" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Team Roster & Leaderboard</h1>
              <p className="text-sm text-muted-foreground">Track reliability scores and team performance metrics</p>
            </div>
          </div>

          {/* Roster Grid */}
          <RosterView people={mockPeople} tasks={mockTasks} />
        </motion.div>
      </main>
    </div>
  )
}
