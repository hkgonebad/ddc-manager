"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { exportToExcel, exportToPDF } from "@/utils/exportUtils"
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { isWithinInterval } from "date-fns"
import { DateRange } from "react-day-picker"
import { AiFillFileExcel, AiFillFilePdf } from "react-icons/ai"

import { Project } from "@/types/project"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CalendarDateRangePicker } from "@/app/dashboard/components/date-range-picker"

import { columns } from "../datatable/columns"
import {
  ColumnVisibilityDropdown,
  PaginationControls,
  SearchInput,
} from "./ProjectsTableControls"

interface ProjectsTableProps {
  projects: Project[]
  fetchProjects: () => Promise<void>
}

export function ProjectsTable({ projects, fetchProjects }: ProjectsTableProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined) // No date range set initially

  // const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects)

  const filteredProjects = useMemo(() => {
    if (dateRange?.from && dateRange?.to) {
      return projects.filter((project) => {
        const projectDate = new Date(project.start_date || "")
        return (
          dateRange.from &&
          dateRange.to &&
          isWithinInterval(projectDate, {
            start: dateRange.from,
            end: dateRange.to,
          })
        )
      })
    }
    return projects // Return all projects if no date range is selected
  }, [dateRange, projects])

  const tableColumns = columns(fetchProjects)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({})

  const table = useReactTable({
    data: filteredProjects,
    columns: tableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // Filter projects based on the selected date range only if explicitly changed
  // useEffect(() => {
  //   if (dateRange?.from && dateRange?.to) {
  //     setFilteredProjects(
  //       projects.filter((project) => {
  //         const projectDate = new Date(project.start_date || "")
  //         return (
  //           dateRange.from &&
  //           dateRange.to &&
  //           isWithinInterval(projectDate, {
  //             start: dateRange.from,
  //             end: dateRange.to,
  //           })
  //         )
  //       })
  //     )
  //   } else {
  //     setFilteredProjects(projects) // Show all projects if no date range is selected
  //   }
  // }, [dateRange, projects])

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <SearchInput table={table} />
        <ColumnVisibilityDropdown table={table} />
        <CalendarDateRangePicker onSelect={setDateRange} />

        <Button
          onClick={() => {
            const visibleColumns = table
              .getAllColumns()
              .filter(
                (column) =>
                  column.getIsVisible() &&
                  column.id !== "select" &&
                  column.id !== "actions"
              ) // Exclude 'checkbox' and 'actions' columns
              .map((column) => column.id)

            exportToExcel(
              filteredProjects,
              dateRange?.from,
              dateRange?.to,
              visibleColumns // Pass the filtered visible columns to the export function
            )
          }}
          variant="outline"
          size="icon"
        >
          <AiFillFileExcel />
        </Button>

        <Button
          onClick={() =>
            exportToPDF(filteredProjects, dateRange?.from, dateRange?.to)
          }
          variant="outline"
          size="icon"
        >
          <AiFillFilePdf />
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {filteredProjects.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationControls table={table} />
    </div>
  )
}

export default ProjectsTable
