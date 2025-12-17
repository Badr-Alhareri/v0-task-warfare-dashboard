"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, UserPlus, X } from "lucide-react"
import { useStore } from "@/lib/store"
import { toast } from "sonner"

const DEPARTMENTS = ["Engineering", "Design", "Product", "Marketing", "Sales", "Operations"]
const AVAILABLE_TAGS = [
  "Dev",
  "Design",
  "Core",
  "Urgent",
  "Backend",
  "Frontend",
  "UI",
  "Product",
  "Strategy",
  "Marketing",
]

export function AddPersonModal() {
  const { addPerson } = useStore()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [department, setDepartment] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleCreate = () => {
    if (!name || !email || !department) return

    addPerson({
      name,
      email,
      department,
      tags: selectedTags,
      avatar: `/placeholder.svg?height=40&width=40&query=${encodeURIComponent(name)}`,
    })

    toast.success("Team member added", {
      description: `${name} has been added to the roster.`,
    })

    // Reset form
    setName("")
    setEmail("")
    setDepartment("")
    setSelectedTags([])
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <UserPlus className="h-4 w-4" />
          Add Person
        </Button>
      </DialogTrigger>
      <DialogContent className="glass max-w-md border-border bg-card/95 backdrop-blur-xl">
        <DialogHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/20">
              <UserPlus className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-foreground">Add Team Member</DialogTitle>
              <p className="text-xs text-muted-foreground font-mono">PERSONNEL_ADD_v1.0</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Name */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name</Label>
            <Input
              placeholder="Enter full name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-border bg-secondary/30 focus-visible:ring-primary"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</Label>
            <Input
              type="email"
              placeholder="email@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-border bg-secondary/30 focus-visible:ring-primary"
            />
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="border-border bg-secondary/30">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tags</Label>
            <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-border bg-secondary/20">
              {AVAILABLE_TAGS.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={
                    selectedTags.includes(tag)
                      ? "bg-primary/20 text-primary border-primary/30 cursor-pointer"
                      : "border-border text-muted-foreground cursor-pointer hover:border-primary/50 hover:text-primary"
                  }
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                  {selectedTags.includes(tag) && <X className="h-3 w-3 ml-1" />}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!name || !email || !department}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Person
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
