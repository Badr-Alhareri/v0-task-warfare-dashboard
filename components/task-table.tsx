"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { StatusBadge } from "@/components/status-badge"
import { AvatarStack } from "@/components/avatar-stack"
import { type Task, getTaskDisplayStatus, formatRelativeTime } from "@/lib/store"
import { CheckCircle, Zap, ChevronDown, Clock, AlertTriangle, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface TaskTableProps {
  tasks: Task[]
  onMarkComplete: (taskId: string, isLate: boolean) => void
  onSendChaser: (task: Task) => void
  onArchive: (taskId: string) => void
}

export function TaskTable({ tasks, onMarkComplete, onSendChaser }: TaskTableProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card/50 p-12 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mb-4">
          <CheckCircle className="h-6 w-6 text-success" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">All Clear</h3>
        <p className="text-sm text-muted-foreground">No active tasks requiring attention</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground font-medium w-[35%]">Task</TableHead>
            <TableHead className="text-muted-foreground font-medium">Assignees</TableHead>
            <TableHead className="text-muted-foreground font-medium">Deadline</TableHead>
            <TableHead className="text-muted-foreground font-medium">Status</TableHead>
            <TableHead className="text-muted-foreground font-medium text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => {
              const displayStatus = getTaskDisplayStatus(task)
              const isUrgent = displayStatus === "urgent"

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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{task.title}</span>
                      {task.isGroupTask && task.assignees.length > 1 && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/30 text-primary">
                          <Users className="h-2.5 w-2.5 mr-1" />
                          Group
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <AvatarStack people={task.assignees} />
                  </TableCell>
                  <TableCell>
                    <span className={cn("font-mono text-sm", isUrgent && "text-destructive font-semibold")}>
                      {formatRelativeTime(task.deadline)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={displayStatus} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-primary hover:text-primary hover:bg-primary/10 gap-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Resolve
                            <ChevronDown className="h-3 w-3 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-popover border-border">
                          <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Mark as Complete
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onMarkComplete(task.id, false)}
                            className="gap-2 cursor-pointer"
                          >
                            <Clock className="h-4 w-4 text-success" />
                            <span>On Time</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onMarkComplete(task.id, true)}
                            className="gap-2 cursor-pointer"
                          >
                            <AlertTriangle className="h-4 w-4 text-warning" />
                            <span>Late</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Chaser button only for urgent tasks */}
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
