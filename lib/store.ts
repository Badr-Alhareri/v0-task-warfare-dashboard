export type TaskStatus = "pending" | "completed" | "late_completed"

export interface Person {
  id: string
  name: string
  email: string
  avatar: string
  department: string
  stats: {
    reliability: number
    avgSpeed: string
    lateRate: number
  }
  taskHistory: { date: string; punctuality: number }[]
}

export interface Task {
  id: string
  title: string
  assignees: Person[]
  deadline: Date
  status: TaskStatus
  completedAt?: Date
  priority: "low" | "medium" | "high" | "critical"
}

// Mock People Database
export const mockPeople: Person[] = [
  {
    id: "1",
    name: "Alex Chen",
    email: "alex.chen@company.com",
    avatar: "/professional-asian-man.png",
    department: "Engineering",
    stats: { reliability: 94, avgSpeed: "1.5h", lateRate: 6 },
    taskHistory: [
      { date: "2025-12-10", punctuality: 100 },
      { date: "2025-12-11", punctuality: 95 },
      { date: "2025-12-12", punctuality: 90 },
      { date: "2025-12-13", punctuality: 100 },
      { date: "2025-12-14", punctuality: 92 },
    ],
  },
  {
    id: "2",
    name: "Sarah Miller",
    email: "sarah.miller@company.com",
    avatar: "/professional-blonde-woman.png",
    department: "Design",
    stats: { reliability: 87, avgSpeed: "2h", lateRate: 13 },
    taskHistory: [
      { date: "2025-12-10", punctuality: 85 },
      { date: "2025-12-11", punctuality: 90 },
      { date: "2025-12-12", punctuality: 88 },
      { date: "2025-12-13", punctuality: 82 },
      { date: "2025-12-14", punctuality: 90 },
    ],
  },
  {
    id: "3",
    name: "James Wilson",
    email: "james.wilson@company.com",
    avatar: "/professional-man-glasses.jpg",
    department: "Product",
    stats: { reliability: 72, avgSpeed: "3h", lateRate: 28 },
    taskHistory: [
      { date: "2025-12-10", punctuality: 70 },
      { date: "2025-12-11", punctuality: 75 },
      { date: "2025-12-12", punctuality: 68 },
      { date: "2025-12-13", punctuality: 72 },
      { date: "2025-12-14", punctuality: 75 },
    ],
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    avatar: "/professional-woman-dark-hair.png",
    department: "Marketing",
    stats: { reliability: 96, avgSpeed: "1h", lateRate: 4 },
    taskHistory: [
      { date: "2025-12-10", punctuality: 98 },
      { date: "2025-12-11", punctuality: 95 },
      { date: "2025-12-12", punctuality: 97 },
      { date: "2025-12-13", punctuality: 94 },
      { date: "2025-12-14", punctuality: 96 },
    ],
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "michael.brown@company.com",
    avatar: "/professional-man-beard.png",
    department: "Engineering",
    stats: { reliability: 65, avgSpeed: "4h", lateRate: 35 },
    taskHistory: [
      { date: "2025-12-10", punctuality: 60 },
      { date: "2025-12-11", punctuality: 65 },
      { date: "2025-12-12", punctuality: 70 },
      { date: "2025-12-13", punctuality: 62 },
      { date: "2025-12-14", punctuality: 68 },
    ],
  },
  {
    id: "6",
    name: "Lisa Wang",
    email: "lisa.wang@company.com",
    avatar: "/professional-asian-woman.png",
    department: "Design",
    stats: { reliability: 91, avgSpeed: "1.8h", lateRate: 9 },
    taskHistory: [
      { date: "2025-12-10", punctuality: 92 },
      { date: "2025-12-11", punctuality: 89 },
      { date: "2025-12-12", punctuality: 93 },
      { date: "2025-12-13", punctuality: 90 },
      { date: "2025-12-14", punctuality: 91 },
    ],
  },
]

// Mock Tasks with various states
const now = new Date()
const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000)
const hoursFromNow = (h: number) => new Date(now.getTime() + h * 60 * 60 * 1000)
const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000)

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Deploy authentication microservice",
    assignees: [mockPeople[0], mockPeople[4]],
    deadline: hoursAgo(48),
    status: "pending",
    priority: "critical",
  },
  {
    id: "2",
    title: "Review Q4 marketing campaign",
    assignees: [mockPeople[3]],
    deadline: hoursAgo(24),
    status: "pending",
    priority: "high",
  },
  {
    id: "3",
    title: "Update design system components",
    assignees: [mockPeople[1], mockPeople[5]],
    deadline: hoursFromNow(2),
    status: "pending",
    priority: "medium",
  },
  {
    id: "4",
    title: "Finalize product roadmap presentation",
    assignees: [mockPeople[2]],
    deadline: hoursFromNow(6),
    status: "pending",
    priority: "high",
  },
  {
    id: "5",
    title: "Complete API documentation",
    assignees: [mockPeople[0]],
    deadline: daysAgo(2),
    status: "completed",
    completedAt: daysAgo(2.5),
    priority: "medium",
  },
  {
    id: "6",
    title: "Security audit remediation",
    assignees: [mockPeople[4], mockPeople[0]],
    deadline: daysAgo(3),
    status: "late_completed",
    completedAt: daysAgo(2),
    priority: "critical",
  },
  {
    id: "7",
    title: "User research synthesis",
    assignees: [mockPeople[1]],
    deadline: daysAgo(1),
    status: "completed",
    completedAt: daysAgo(1.2),
    priority: "low",
  },
  {
    id: "8",
    title: "Database optimization sprint",
    assignees: [mockPeople[0], mockPeople[4]],
    deadline: hoursFromNow(24),
    status: "pending",
    priority: "high",
  },
]

// Helper to determine if a task is urgent (overdue and still pending)
export function isTaskUrgent(task: Task): boolean {
  return task.status === "pending" && new Date() > task.deadline
}

// Helper to get task display status
export function getTaskDisplayStatus(task: Task): "pending" | "urgent" | "completed" | "late_completed" {
  if (task.status === "pending" && new Date() > task.deadline) {
    return "urgent"
  }
  return task.status
}

// Format relative time
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffHours = Math.round(diffMs / (1000 * 60 * 60))
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffMs > 0) {
    if (diffHours < 1) return "in < 1 hour"
    if (diffHours < 24) return `in ${diffHours} hour${diffHours > 1 ? "s" : ""}`
    return `in ${diffDays} day${diffDays > 1 ? "s" : ""}`
  } else {
    const absHours = Math.abs(diffHours)
    const absDays = Math.abs(diffDays)
    if (absHours < 1) return "< 1 hour ago"
    if (absHours < 24) return `${absHours} hour${absHours > 1 ? "s" : ""} ago`
    return `${absDays} day${absDays > 1 ? "s" : ""} ago`
  }
}
