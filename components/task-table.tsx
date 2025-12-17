"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { AvatarStack } from "@/components/avatar-stack"
import { type Task, getTaskDisplayStatus, formatRelativeTime } from "@/lib/store"
import { CheckCircle, Zap, Archive, Flag } from "lucide-react"
import { cn } from "@/lib/utils"

interface TaskTableProps {
  tasks: Task[]
  onMarkComplete: (taskId: string) => void
  onSendChaser: (task: Task) => void
  onArchive: (taskId: string) => void
}

const priorityConfig = {
  low: { label: "Low", className: "text-muted-foreground" },
  medium: { label: "Med", className: "text-info" },
  high: { label: "High", className: "text-warning" },
  critical: { label: "Critical", className: "text-destructive" },
}

export function TaskTable({ tasks, onMarkComplete, onSendChaser, onArchive }: TaskTableProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="rounded-lg border border-border bg-card/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground font-medium w-[30%]">Task</TableHead>
            <TableHead className="text-muted-foreground font-medium">Assignees</TableHead>
            <TableHead className="text-muted-foreground font-medium">Deadline</TableHead>
            <TableHead className="text-muted-foreground font-medium">Priority</TableHead>
            <TableHead className="text-muted-foreground font-medium">Status</TableHead>
            <TableHead className="text-muted-foreground font-medium text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => {
              const displayStatus = getTaskDisplayStatus(task)
              const isUrgent = displayStatus === "urgent"
              const priority = priorityConfig[task.priority]

              return (
                <motion.tr
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.2 }}
                  onMouseEnter={() => setHoveredId(task.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={cn(
                    "border-border transition-all duration-200",
                    isUrgent && "bg-destructive/5 border-l-2 border-l-destructive",
                    hoveredId === task.id && "bg-secondary/50",
                  )}
                >
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    <AvatarStack people={task.assignees} />
                  </TableCell>
                  <TableCell>
                    <span className={cn("font-mono text-sm", isUrgent && "text-destructive font-semibold")}>
                      {formatRelativeTime(task.deadline)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Flag className={cn("h-3 w-3", priority.className)} />
                      <span className={cn("text-sm", priority.className)}>{priority.label}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={displayStatus} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {displayStatus === "pending" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-primary hover:text-primary hover:bg-primary/10"
                          onClick={() => onMarkComplete(task.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                      )}
                      {isUrgent && (
                        <Button
                          size="sm"
                          className="h-8 bg-destructive/20 text-destructive hover:bg-destructive/30 border border-destructive/30 animate-pulse-soft"
                          onClick={() => onSendChaser(task)}
                        >
                          <Zap className="h-4 w-4 mr-1" />
                          Email Team
                        </Button>
                      )}
                      {(displayStatus === "completed" || displayStatus === "late_completed") && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-muted-foreground hover:text-foreground"
                          onClick={() => onArchive(task.id)}
                        >
                          <Archive className="h-4 w-4 mr-1" />
                          Archive
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </motion.tr>
              )
            })}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  )
}
