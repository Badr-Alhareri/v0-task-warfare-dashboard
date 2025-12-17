"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Plus, CalendarIcon, X, Target, Users, User } from "lucide-react"
import { useStore, type Person } from "@/lib/store"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { toast } from "sonner"

export function TaskCreator() {
  const { people, addTask } = useStore()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [deadline, setDeadline] = useState<Date>()
  const [time, setTime] = useState("12:00")
  const [message, setMessage] = useState("")
  const [assignees, setAssignees] = useState<Person[]>([])
  const [search, setSearch] = useState("")
  const [isGroupTask, setIsGroupTask] = useState(false)

  const filteredPeople = people.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) && !assignees.some((a) => a.id === p.id),
  )

  const addAssignee = (person: Person) => {
    setAssignees([...assignees, person])
    setSearch("")
  }

  const removeAssignee = (id: string) => {
    setAssignees(assignees.filter((a) => a.id !== id))
  }

  const handleCreate = () => {
    if (!title || !deadline || assignees.length === 0) return

    const [hours, minutes] = time.split(":").map(Number)
    const fullDeadline = new Date(deadline)
    fullDeadline.setHours(hours, minutes)

    addTask({
      title,
      deadline: fullDeadline,
      assignees,
      status: "pending",
      message,
      isGroupTask,
    })

    const taskCount = isGroupTask ? 1 : assignees.length
    toast.success(`${taskCount} task${taskCount > 1 ? "s" : ""} created`, {
      description: isGroupTask
        ? `Group task "${title}" assigned to ${assignees.length} people`
        : `Individual tasks created for ${assignees.length} assignees`,
    })

    // Reset form
    setTitle("")
    setDeadline(undefined)
    setTime("12:00")
    setMessage("")
    setAssignees([])
    setIsGroupTask(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="glass max-w-lg border-border bg-card/95 backdrop-blur-xl">
        <DialogHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/20">
              <Target className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-foreground">Mission Control</DialogTitle>
              <p className="text-xs text-muted-foreground font-mono">CREATE_TASK_v2.0</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Task Title</Label>
            <Input
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-border bg-secondary/30 focus-visible:ring-primary"
            />
          </div>

          {/* Deadline */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Deadline Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-border bg-secondary/30",
                      !deadline && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover border-border">
                  <Calendar mode="single" selected={deadline} onSelect={setDeadline} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="border-border bg-secondary/30 focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Message (Optional)
            </Label>
            <Textarea
              placeholder="Additional instructions or context..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border-border bg-secondary/30 focus-visible:ring-primary resize-none h-20"
            />
          </div>

          {/* Assignees */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Assignees</Label>
            <div className="relative">
              <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-secondary/30 p-2 min-h-[42px]">
                {assignees.map((person) => (
                  <Badge
                    key={person.id}
                    variant="secondary"
                    className="bg-primary/20 text-primary border-primary/30 gap-2"
                  >
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={person.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-[8px]">{person.name[0]}</AvatarFallback>
                    </Avatar>
                    {person.name}
                    <button onClick={() => removeAssignee(person.id)} className="hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <Input
                  placeholder="Search team..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 min-w-[120px] border-0 bg-transparent p-0 h-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              {search && filteredPeople.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-border bg-popover shadow-lg z-10 max-h-48 overflow-auto">
                  {filteredPeople.map((person) => (
                    <button
                      key={person.id}
                      onClick={() => addAssignee(person)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-secondary/50 transition-colors"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={person.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">{person.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <span className="text-sm">{person.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">{person.department}</span>
                      </div>
                      <div className="flex gap-1">
                        {person.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[10px] px-1 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {assignees.length > 1 && (
            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/20 p-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded",
                    isGroupTask ? "bg-primary/20" : "bg-muted",
                  )}
                >
                  {isGroupTask ? (
                    <Users className="h-4 w-4 text-primary" />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {isGroupTask ? "Group Task" : "Individual Tasks"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isGroupTask ? "Single task shared by all assignees" : `Creates ${assignees.length} separate tasks`}
                  </p>
                </div>
              </div>
              <Switch
                checked={isGroupTask}
                onCheckedChange={setIsGroupTask}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!title || !deadline || assignees.length === 0}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <Plus className="h-4 w-4" />
              Create {isGroupTask || assignees.length <= 1 ? "Task" : `${assignees.length} Tasks`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
