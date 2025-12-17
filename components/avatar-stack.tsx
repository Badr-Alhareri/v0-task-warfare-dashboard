"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Person } from "@/lib/store"
import { cn } from "@/lib/utils"

interface AvatarStackProps {
  people: Person[]
  max?: number
  className?: string
}

export function AvatarStack({ people, max = 3, className }: AvatarStackProps) {
  const displayed = people.slice(0, max)
  const remaining = people.length - max

  return (
    <TooltipProvider>
      <div className={cn("flex -space-x-2", className)}>
        {displayed.map((person) => (
          <Tooltip key={person.id}>
            <TooltipTrigger asChild>
              <Avatar className="h-8 w-8 border-2 border-background ring-1 ring-border transition-transform hover:z-10 hover:scale-110">
                <AvatarImage src={person.avatar || "/placeholder.svg"} alt={person.name} />
                <AvatarFallback className="bg-secondary text-xs">
                  {person.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="top" className="glass border-border bg-popover">
              <p className="font-medium">{person.name}</p>
              <p className="text-xs text-muted-foreground">{person.department}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        {remaining > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-8 w-8 border-2 border-background ring-1 ring-border">
                <AvatarFallback className="bg-secondary text-xs">+{remaining}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="top" className="glass border-border bg-popover">
              {people.slice(max).map((p) => (
                <p key={p.id} className="text-sm">
                  {p.name}
                </p>
              ))}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  )
}
