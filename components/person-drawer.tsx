"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ReliabilityRing } from "@/components/reliability-ring"
import { StatusBadge } from "@/components/status-badge"
import type { Person, Task } from "@/lib/store"
import { getTaskDisplayStatus } from "@/lib/store"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { Clock, TrendingUp, AlertTriangle } from "lucide-react"

interface PersonDrawerProps {
  person: Person | null
  open: boolean
  onClose: () => void
  tasks: Task[]
}

export function PersonDrawer({ person, open, onClose, tasks }: PersonDrawerProps) {
  if (!person) return null

  const personTasks = tasks.filter((t) => t.assignees.some((a) => a.id === person.id)).slice(0, 5)

  const getReliabilityColor = (val: number) => {
    if (val >= 90) return "text-success"
    if (val >= 70) return "text-warning"
    return "text-destructive"
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="glass border-border bg-card/95 backdrop-blur-xl w-[400px] sm:w-[450px]">
        <SheetHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src={person.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-lg">
                {person.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle className="text-xl text-foreground">{person.name}</SheetTitle>
              <Badge variant="secondary" className="mt-1">
                {person.department}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">{person.email}</p>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-border bg-secondary/30 p-3 text-center">
              <ReliabilityRing value={person.stats.reliability} size={50} />
              <p className="text-xs text-muted-foreground mt-2">Reliability</p>
            </div>
            <div className="rounded-lg border border-border bg-secondary/30 p-3 text-center">
              <div className="flex items-center justify-center h-[50px]">
                <Clock className="h-5 w-5 text-info mr-1" />
                <span className="text-lg font-bold text-info">{person.stats.avgSpeed}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Avg Speed</p>
            </div>
            <div className="rounded-lg border border-border bg-secondary/30 p-3 text-center">
              <div className="flex items-center justify-center h-[50px]">
                <AlertTriangle className="h-5 w-5 text-warning mr-1" />
                <span className="text-lg font-bold text-warning">{person.stats.lateRate}%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Late Rate</p>
            </div>
          </div>

          {/* Punctuality Trend */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Punctuality Trend</h3>
            </div>
            <div className="rounded-lg border border-border bg-secondary/30 p-4 h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={person.taskHistory}>
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "oklch(0.65 0.01 260)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => new Date(v).toLocaleDateString("en", { day: "numeric" })}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: "oklch(0.65 0.01 260)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.15 0.01 260)",
                      border: "1px solid oklch(0.28 0.01 260)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "oklch(0.65 0.01 260)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="punctuality"
                    stroke="oklch(0.75 0.2 145)"
                    strokeWidth={2}
                    dot={{ fill: "oklch(0.75 0.2 145)", r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recent Tasks</h3>
            <div className="space-y-2">
              {personTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
                >
                  <span className="text-sm truncate max-w-[200px]">{task.title}</span>
                  <StatusBadge status={getTaskDisplayStatus(task)} />
                </div>
              ))}
              {personTasks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No tasks assigned</p>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
