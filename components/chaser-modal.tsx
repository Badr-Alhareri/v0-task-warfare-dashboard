"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Send, Terminal, Zap } from "lucide-react"
import { useStore, type Task, type Person } from "@/lib/store"

interface ChaserModalProps {
  task: Task | null
  open: boolean
  onClose: () => void
  onSend: (data: { to: string[]; cc: string[]; subject: string; body: string }) => void
}

export function ChaserModal({ task, open, onClose, onSend }: ChaserModalProps) {
  const { people } = useStore()
  const [recipients, setRecipients] = useState<Person[]>([])
  const [ccRecipients, setCcRecipients] = useState<Person[]>([])
  const [ccSearch, setCcSearch] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")

  useMemo(() => {
    if (task) {
      setRecipients(task.assignees)
      setSubject(`URGENT: ${task.title} is Overdue`)
      setBody(
        `Hi Team,\n\nThis is an urgent follow-up regarding the task "${task.title}" which was due on ${task.deadline.toLocaleDateString()}.\n\nPlease provide a status update at your earliest convenience.\n\nBest regards`,
      )
    }
  }, [task])

  const filteredPeople = people.filter(
    (p) =>
      p.name.toLowerCase().includes(ccSearch.toLowerCase()) &&
      !recipients.some((r) => r.id === p.id) &&
      !ccRecipients.some((c) => c.id === p.id),
  )

  const removeRecipient = (id: string) => {
    setRecipients(recipients.filter((r) => r.id !== id))
  }

  const removeCc = (id: string) => {
    setCcRecipients(ccRecipients.filter((c) => c.id !== id))
  }

  const addCc = (person: Person) => {
    setCcRecipients([...ccRecipients, person])
    setCcSearch("")
  }

  const handleSend = () => {
    onSend({
      to: recipients.map((r) => r.email),
      cc: ccRecipients.map((c) => c.email),
      subject,
      body,
    })
    onClose()
  }

  if (!task) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass max-w-2xl border-border bg-card/95 backdrop-blur-xl">
        <DialogHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-destructive/20">
              <Terminal className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-foreground">Chaser Console</DialogTitle>
              <p className="text-xs text-muted-foreground font-mono">URGENT_DISPATCH_v2.1</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* To Field */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">To</label>
            <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-secondary/30 p-2 min-h-[42px]">
              {recipients.map((person) => (
                <Badge
                  key={person.id}
                  variant="secondary"
                  className="bg-primary/20 text-primary border-primary/30 gap-1"
                >
                  {person.name}
                  <button onClick={() => removeRecipient(person.id)} className="ml-1 hover:text-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* CC Field with Autocomplete */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">CC</label>
            <div className="relative">
              <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-secondary/30 p-2 min-h-[42px]">
                {ccRecipients.map((person) => (
                  <Badge
                    key={person.id}
                    variant="secondary"
                    className="bg-secondary text-foreground border-border gap-1"
                  >
                    {person.name}
                    <button onClick={() => removeCc(person.id)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <Input
                  placeholder="Add recipients..."
                  value={ccSearch}
                  onChange={(e) => setCcSearch(e.target.value)}
                  className="flex-1 min-w-[120px] border-0 bg-transparent p-0 h-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              {ccSearch && filteredPeople.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-border bg-popover shadow-lg z-10">
                  {filteredPeople.slice(0, 5).map((person) => (
                    <button
                      key={person.id}
                      onClick={() => addCc(person)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-secondary/50 transition-colors"
                    >
                      <span className="text-sm">{person.name}</span>
                      <span className="text-xs text-muted-foreground">{person.email}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Subject</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border-border bg-secondary/30 focus-visible:ring-primary"
            />
          </div>

          {/* Body */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Message</label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-[150px] border-border bg-secondary/30 focus-visible:ring-primary font-mono text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2"
            >
              <Zap className="h-4 w-4" />
              Send Chaser
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
