"use client"
import { motion } from "framer-motion"
import { LiveClock } from "@/components/live-clock"
import { Navigation, Logo } from "@/components/navigation"
import { RosterTable } from "@/components/roster-table"
import { AddPersonModal } from "@/components/add-person-modal"
import { useStore } from "@/lib/store"
import { Toaster } from "@/components/ui/sonner"
import { Users } from "lucide-react"

export default function RosterPage() {
  const { people, tasks } = useStore()

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 border border-primary/30">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Personnel Roster</h1>
                <p className="text-sm text-muted-foreground">
                  {people.length} team members • Sort by reliability to find worst performers
                </p>
              </div>
            </div>
            <AddPersonModal />
          </div>

          {/* Roster Table with TanStack */}
          <RosterTable people={people} tasks={tasks} />
        </motion.div>
      </main>
    </div>
  )
}
