import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  // getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import type { ColumnDef, /* ColumnFiltersState, */ VisibilityState, SortingState } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Check, Minus, ChevronDown, ChevronUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type NonStaffCost = {
  category: string
  subcategory: string
  description?: string
  inKind: boolean
  years: Record<string, number>
}

const fmtCurrency = (n: number) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n)

interface NonStaffCostsDataTableProps {
  data: NonStaffCost[]
  onEdit?: (row: NonStaffCost) => void
  onDelete?: (row: NonStaffCost) => void
  yearLabels?: string[]
}

export function NonStaffCostsDataTable({
  data,
  onEdit,
  onDelete,
  yearLabels,
}: NonStaffCostsDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  // const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnsMenuOpen, setColumnsMenuOpen] = React.useState(false)

  const staticColumns: ColumnDef<NonStaffCost>[] = [
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
      accessorKey: "subcategory",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Subcategory
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div className="capitalize">{row.getValue("subcategory")}</div>,
    },
    {
      accessorKey: "description",
      header: "Description",
      enableSorting: false,
      cell: ({ row }) => <div>{row.getValue("description") || "-"}</div>,
    },
    {
      accessorKey: "inKind",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          In Kind
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => {
        const v = Boolean(row.getValue("inKind"))
        return (
          <div className="flex justify-center">
            {v ? <Check className="text-green-600 h-4 w-4" /> : <Minus className="text-muted-foreground h-4 w-4" />}
          </div>
        )
      },
      sortingFn: (a, b, id) => Number(a.getValue(id)) - Number(b.getValue(id)),
    },
  ]

  const yearColumns: ColumnDef<NonStaffCost>[] = (yearLabels ?? []).map((year) => ({
    id: `year-${year}`,
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="ml-auto flex w-full justify-end"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {year}
        <ArrowUpDown />
      </Button>
    ),
    accessorFn: (row) => row.years?.[year] ?? 0,
    cell: ({ row }) => {
      const v = Number(row.original.years?.[year] ?? 0)
      return <div className="text-right font-medium">{fmtCurrency(v)}</div>
    },
    sortingFn: (a, b, id) => {
      const va = a.original.years?.[year] ?? 0
      const vb = b.original.years?.[year] ?? 0
      return Number(va) - Number(vb)
    },
    enableHiding: true,
  }))

  const actionsColumn: ColumnDef<NonStaffCost> = {
    id: "actions",
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => {
      const item = row.original
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
            <DropdownMenuItem onClick={() => onEdit?.(item)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete?.(item)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }

  const columns: ColumnDef<NonStaffCost>[] = [
    ...staticColumns,
    ...yearColumns,
    actionsColumn,
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    // onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: { sorting, /* columnFilters, */ columnVisibility },
  })

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 py-4">
        {/* Removed search filters */}
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
