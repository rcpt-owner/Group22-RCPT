import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import type { ColumnDef, ColumnFiltersState, VisibilityState, SortingState } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react"

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

// StaffCostsDataTable: presentational table for staff cost rows.
// - Exports StaffCost as the source-of-truth type.
// - Accepts data via props; no internal seed data.
// - Currency uses AUD/en-AU. Year headers driven by yearLabels prop.

export type StaffCost = {
  role: string
  employmentType: "Full-Time" | "Part-Time" | "Casual"
  category: "Academic" | "Professional" | "Research"
  employmentClassification: string
  fteType: "FTE" | "Daily" | "Hourly"
  year1: number
  year2: number
  year3: number
}

// AUD formatter (fix invalid locale and align with the rest of the app)
const fmtCurrency = (n: number) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n)

interface StaffCostsDataTableProps {
  data: StaffCost[]
  onEdit?: (row: StaffCost) => void
  onDelete?: (row: StaffCost) => void
  yearLabels?: [string, string, string]
}

export function StaffCostsDataTable({
  data,
  onEdit,
  onDelete,
  yearLabels = ["Year 1", "Year 2", "Year 3"],
}: StaffCostsDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({ role: true })
  const [columnsMenuOpen, setColumnsMenuOpen] = React.useState(false)

  // Define columns here so we can use props (yearLabels, onEdit/onDelete)
  const columns: ColumnDef<StaffCost>[] = [
    {
      accessorKey: "role",
      header: "Role",
      enableSorting: false,
      enableHiding: false,
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
          {yearLabels[0]}
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
          {yearLabels[1]}
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
          {yearLabels[2]}
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
              <DropdownMenuItem onClick={() => onEdit?.(staff)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete?.(staff)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

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
        <DropdownMenu open={columnsMenuOpen} onOpenChange={setColumnsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns {columnsMenuOpen ? <ChevronUp /> : <ChevronDown />}
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

      {/* Horizontal-only scroll for many columns */}
      <div className="rounded-md border">
        <Table containerClassName="w-full overflow-x-auto overflow-y-visible" className="w-full min-w-max">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
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
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
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

