"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ReliabilityRing } from "@/components/reliability-ring"
import { PersonDrawer } from "@/components/person-drawer"
import type { Person, Task } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Medal, TrendingUp, Clock } from "lucide-react"

interface RosterViewProps {
  people: Person[]
  tasks: Task[]
}

export function RosterView({ people, tasks }: RosterViewProps) {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const sortedPeople = [...people].sort((a, b) => b.stats.reliability - a.stats.reliability)

  const getMedalColor = (index: number) => {
    if (index === 0) return "text-yellow-500"
    if (index === 1) return "text-gray-400"
    if (index === 2) return "text-amber-600"
    return "text-transparent"
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedPeople.map((person, index) => (
          <motion.div
            key={person.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className={cn(
                "group relative cursor-pointer overflow-hidden border-border bg-card/50 p-4 transition-all hover:bg-secondary/50",
                person.stats.reliability >= 90 && "hover:glow-success",
                person.stats.reliability >= 70 && person.stats.reliability < 90 && "hover:glow-warning",
                person.stats.reliability < 70 && "hover:glow-danger",
              )}
              onClick={() => setSelectedPerson(person)}
            >
              {/* Rank Medal */}
              {index < 3 && <Medal className={cn("absolute top-3 right-3 h-5 w-5", getMedalColor(index))} />}

              <div className="flex items-center gap-4">
                <ReliabilityRing value={person.stats.reliability} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={person.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {person.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-foreground truncate">{person.name}</h3>
                      <Badge variant="secondary" className="text-xs bg-secondary text-muted-foreground">
                        {person.department}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Avg: {person.stats.avgSpeed}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  <span>Late: {person.stats.lateRate}%</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <PersonDrawer
        person={selectedPerson}
        open={!!selectedPerson}
        onClose={() => setSelectedPerson(null)}
        tasks={tasks}
      />
    </>
  )
}
