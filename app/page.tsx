"use client"

import { motion } from "framer-motion"
import { LiveClock } from "@/components/live-clock"
import { SystemStatus } from "@/components/system-status"
import { TaskTable } from "@/components/task-table"
import { TaskCreator } from "@/components/task-creator"
import { ChaserModal } from "@/components/chaser-modal"
import { Navigation, Logo } from "@/components/navigation"
import { useStore, type Task, getTaskDisplayStatus } from "@/lib/store"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { useState } from "react"

export default function DashboardPage() {
  const { tasks, updateTaskStatus, archiveTask } = useStore()
  const [chaserTask, setChaserTask] = useState<Task | null>(null)

  const activeTasks = tasks.filter((t) => {
    const status = getTaskDisplayStatus(t)
    return status === "pending" || status === "urgent"
  })

  const handleMarkComplete = (taskId: string, isLate: boolean) => {
    const status = isLate ? "late_completed" : "completed"
    updateTaskStatus(taskId, status, new Date())
    toast.success(isLate ? "Task marked as late completed" : "Task completed on time", {
      description: "The task has been moved to archive.",
    })
  }

  const handleArchive = (taskId: string) => {
    archiveTask(taskId)
    toast.info("Task archived", {
      description: "The task has been removed from the dashboard.",
    })
  }

  const handleSendChaser = (data: { to: string[]; cc: string[]; subject: string; body: string }) => {
    toast.success("Chaser email sent", {
      description: `Email sent to ${data.to.join(", ")}`,
    })
  }

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
            <div className="flex items-center gap-4">
              <SystemStatus tasks={tasks} />
              <LiveClock />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Operations Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Active missions requiring attention • Completed tasks auto-archive
              </p>
            </div>
            <TaskCreator />
          </div>

          {/* Task Table - Only showing active tasks */}
          <TaskTable
            tasks={activeTasks}
            onMarkComplete={handleMarkComplete}
            onSendChaser={(task) => setChaserTask(task)}
            onArchive={handleArchive}
          />
        </motion.div>
      </main>

      {/* Chaser Modal */}
      <ChaserModal
        task={chaserTask}
        open={!!chaserTask}
        onClose={() => setChaserTask(null)}
        onSend={handleSendChaser}
      />
    </div>
  )
}
