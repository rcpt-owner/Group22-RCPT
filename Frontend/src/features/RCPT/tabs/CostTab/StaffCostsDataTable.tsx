import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import type { ColumnDef, ColumnFiltersState, VisibilityState, SortingState } from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Replace Payment with StaffCost to align with the Add Staff Member form fields
export type StaffCost = {
  role: string
  employmentType: "Full-Time" | "Part-Time" | "Casual"
  category: "Academic" | "Professional" | "Research"
  employmentClassification: string // e.g. "Level A"–"Level E", "HEW 6", etc.
  fteType: "FTE" | "Daily" | "Hourly"
  year1: number
  year2: number
  year3: number
}

// Seed example rows mirroring realistic form options and Year 1–3 amounts
const demoData: StaffCost[] = [
  {
    role: "Lecturer",
    employmentType: "Full-Time",
    category: "Academic",
    employmentClassification: "Level B",
    fteType: "FTE",
    year1: 95000,
    year2: 98000,
    year3: 101000,
  },
  {
    role: "Senior Lecturer",
    employmentType: "Full-Time",
    category: "Academic",
    employmentClassification: "Level C",
    fteType: "FTE",
    year1: 118000,
    year2: 121500,
    year3: 125000,
  },
  {
    role: "Research Assistant",
    employmentType: "Part-Time",
    category: "Research",
    employmentClassification: "Level A",
    fteType: "Hourly",
    year1: 30000,
    year2: 32000,
    year3: 34000,
  },
  {
    role: "Professional Officer",
    employmentType: "Full-Time",
    category: "Professional",
    employmentClassification: "HEW 7",
    fteType: "FTE",
    year1: 88000,
    year2: 90500,
    year3: 93000,
  },
  {
    role: "Casual Tutor",
    employmentType: "Casual",
    category: "Academic",
    employmentClassification: "Level A",
    fteType: "Hourly",
    year1: 18000,
    year2: 18500,
    year3: 19000,
  },
]

// Helper to format year amounts as currency (adjust locale/currency if needed)
const fmtCurrency = (n: number) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n)

// Define staff cost columns; keep actions fixed (non-hideable)
export const columns: ColumnDef<StaffCost>[] = [
  {
    accessorKey: "role",
    header: "Role",
    enableSorting: false,
    enableHiding: false, // keep Role always visible
    cell: ({ row }) => <div className="capitalize">{row.getValue("role")}</div>,
  },
  {
    accessorKey: "employmentType",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Employment Type
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("employmentType")}</div>,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Category
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("category")}</div>,
  },
  {
    accessorKey: "employmentClassification",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Classification
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("employmentClassification")}</div>,
  },
  {
    accessorKey: "fteType",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        FTE Type
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("fteType")}</div>,
  },
  {
    accessorKey: "year1",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="ml-auto flex w-full justify-end"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Year 1
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const v = Number(row.getValue("year1"))
      return <div className="text-right font-medium">{fmtCurrency(v)}</div>
    },
  },
  {
    accessorKey: "year2",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="ml-auto flex w-full justify-end"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Year 2
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const v = Number(row.getValue("year2"))
      return <div className="text-right font-medium">{fmtCurrency(v)}</div>
    },
  },
  {
    accessorKey: "year3",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="ml-auto flex w-full justify-end"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Year 3
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const v = Number(row.getValue("year3"))
      return <div className="text-right font-medium">{fmtCurrency(v)}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => {
      const staff = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => console.log("Edit", staff)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => console.log("Delete", staff)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function StaffCostsTable(props: { data?: StaffCost[] } = {}) {
  const data = React.useMemo(() => props.data ?? demoData, [props.data])

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({ role: true })

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: { sorting, columnFilters, columnVisibility },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by role..."
          value={(table.getColumn("role")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("role")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

