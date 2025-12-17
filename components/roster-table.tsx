"use client"

import { useState, useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { PersonDrawer } from "@/components/person-drawer"
import { type Person, type Task, getAllTags } from "@/lib/store"
import { cn } from "@/lib/utils"
import { ArrowUpDown, ArrowUp, ArrowDown, Filter, X } from "lucide-react"

interface RosterTableProps {
  people: Person[]
  tasks: Task[]
}

export function RosterTable({ people, tasks }: RosterTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const allTags = useMemo(() => getAllTags(people), [people])

  // Filter data by selected tags
  const filteredData = useMemo(() => {
    if (selectedTags.length === 0) return people
    return people.filter((person) => selectedTags.some((tag) => person.tags.includes(tag)))
  }, [people, selectedTags])

  const columns: ColumnDef<Person>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-border">
              <AvatarImage src={row.original.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-xs">
                {row.original.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{row.original.name}</p>
              <p className="text-xs text-muted-foreground">{row.original.email}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "department",
        header: "Department",
        cell: ({ row }) => (
          <Badge variant="secondary" className="bg-secondary text-muted-foreground">
            {row.original.department}
          </Badge>
        ),
      },
      {
        accessorKey: "tags",
        header: "Tags",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className={cn(
                  "text-[10px] px-1.5 py-0",
                  tag === "Urgent" && "border-destructive/50 text-destructive",
                  tag === "Core" && "border-primary/50 text-primary",
                )}
              >
                {tag}
              </Badge>
            ))}
          </div>
        ),
        filterFn: (row, id, value: string[]) => {
          if (!value || value.length === 0) return true
          return value.some((tag) => row.original.tags.includes(tag))
        },
      },
      {
        accessorKey: "stats.reliability",
        header: ({ column }) => {
          const isSorted = column.getIsSorted()
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="gap-1 -ml-3 hover:bg-transparent hover:text-foreground"
            >
              Reliability
              {isSorted === "asc" ? (
                <ArrowUp className="h-4 w-4 text-primary" />
              ) : isSorted === "desc" ? (
                <ArrowDown className="h-4 w-4 text-primary" />
              ) : (
                <ArrowUpDown className="h-4 w-4 opacity-50" />
              )}
            </Button>
          )
        },
        cell: ({ row }) => {
          const score = row.original.stats.reliability
          return (
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    score >= 90 && "bg-success",
                    score >= 70 && score < 90 && "bg-warning",
                    score < 70 && "bg-destructive",
                  )}
                  style={{ width: `${score}%` }}
                />
              </div>
              <span
                className={cn(
                  "font-mono text-sm font-medium",
                  score >= 90 && "text-success",
                  score >= 70 && score < 90 && "text-warning",
                  score < 70 && "text-destructive",
                )}
              >
                {score}%
              </span>
            </div>
          )
        },
      },
      {
        accessorKey: "stats.avgSpeed",
        header: ({ column }) => {
          const isSorted = column.getIsSorted()
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="gap-1 -ml-3 hover:bg-transparent hover:text-foreground"
            >
              Avg Speed
              {isSorted === "asc" ? (
                <ArrowUp className="h-4 w-4 text-primary" />
              ) : isSorted === "desc" ? (
                <ArrowDown className="h-4 w-4 text-primary" />
              ) : (
                <ArrowUpDown className="h-4 w-4 opacity-50" />
              )}
            </Button>
          )
        },
        cell: ({ row }) => (
          <span className="font-mono text-sm text-muted-foreground">{row.original.stats.avgSpeed}h</span>
        ),
      },
      {
        accessorKey: "stats.lateRate",
        header: ({ column }) => {
          const isSorted = column.getIsSorted()
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="gap-1 -ml-3 hover:bg-transparent hover:text-foreground"
            >
              Late Rate
              {isSorted === "asc" ? (
                <ArrowUp className="h-4 w-4 text-primary" />
              ) : isSorted === "desc" ? (
                <ArrowDown className="h-4 w-4 text-primary" />
              ) : (
                <ArrowUpDown className="h-4 w-4 opacity-50" />
              )}
            </Button>
          )
        },
        cell: ({ row }) => {
          const rate = row.original.stats.lateRate
          return (
            <span
              className={cn(
                "font-mono text-sm",
                rate <= 10 && "text-success",
                rate > 10 && rate <= 25 && "text-warning",
                rate > 25 && "text-destructive",
              )}
            >
              {rate}%
            </span>
          )
        },
      },
    ],
    [],
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  })

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const clearFilters = () => setSelectedTags([])

  return (
    <>
      {/* Filter Controls */}
      <div className="flex items-center gap-2 mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-border bg-secondary/30 gap-2">
              <Filter className="h-4 w-4" />
              Filter by Tags
              {selectedTags.length > 0 && (
                <Badge className="ml-1 bg-primary/20 text-primary">{selectedTags.length}</Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 bg-popover border-border">
            <DropdownMenuLabel className="text-xs text-muted-foreground">Select Tags</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allTags.map((tag) => (
              <DropdownMenuCheckboxItem
                key={tag}
                checked={selectedTags.includes(tag)}
                onCheckedChange={() => toggleTag(tag)}
              >
                {tag}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {selectedTags.length > 0 && (
          <div className="flex items-center gap-2">
            {selectedTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-primary/20 text-primary gap-1">
                {tag}
                <button onClick={() => toggleTag(tag)} className="hover:text-foreground">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-muted-foreground h-7">
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card/50 overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-border hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-muted-foreground font-medium">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-border cursor-pointer hover:bg-secondary/50 transition-colors"
                  onClick={() => setSelectedPerson(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
