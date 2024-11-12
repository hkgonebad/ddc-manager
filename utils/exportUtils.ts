import * as XLSX from "xlsx"

import { Project } from "@/types/project"
import { toast } from "@/components/ui/use-toast"

// Filter projects by date range
const filterByDateRange = (
  projects: Project[],
  startDate?: Date,
  endDate?: Date
): Project[] => {
  return projects.filter((project) => {
    const projectDate = new Date(project.start_date || "")
    return startDate && endDate
      ? projectDate >= startDate && projectDate <= endDate
      : true
  })
}

// Format date to dd-mm-yyyy
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getFullYear()}`
}

// Export filtered projects to Excel
export const exportToExcel = (
  projects: Project[], // All projects
  startDate?: Date,
  endDate?: Date,
  visibleColumns: string[] = [] // Accept visible columns as a parameter
) => {
  // Filter projects based on the date range
  const filteredProjects = filterByDateRange(projects, startDate, endDate)

  // If no visible columns are passed, export all columns (this part can be customized if necessary)
  const columnsToExport = visibleColumns.length
    ? visibleColumns
    : Object.keys(filteredProjects[0] || {})

  // Create export data based on visible columns and filtered projects
  const exportData = filteredProjects.map((project) => {
    const filteredProject: { [key: string]: any } = {}

    // Dynamically handle each visible column
    columnsToExport.forEach((columnId) => {
      // Get the value based on column ID (key should match the project field)
      const projectKey = columnId as keyof Project
      filteredProject[columnId] = project[projectKey] || ""
      // Format date columns if they are part of the columns to export
      if (
        (columnId === "start_date" || columnId === "deadline") &&
        project[columnId]
      ) {
        filteredProject[columnId] = formatDate(project[columnId])
      }
    })

    return filteredProject
  })

  // Create the worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Projects")

  // Generate a dynamic filename with current date and time
  const currentDateTime = new Date()
  const formattedDate = `${currentDateTime.getDate().toString().padStart(2, "0")}-${(
    currentDateTime.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${currentDateTime.getFullYear()}`
  const formattedTime = `${currentDateTime.getHours().toString().padStart(2, "0")}-${currentDateTime
    .getMinutes()
    .toString()
    .padStart(
      2,
      "0"
    )}-${currentDateTime.getSeconds().toString().padStart(2, "0")}`
  const filename = `Projects_${formattedDate}_${formattedTime}.xlsx`

  // Export the Excel file with the dynamic filename
  XLSX.writeFile(workbook, filename)
}

// Export to PDF (still a placeholder)
export const exportToPDF = async (
  projects: Project[],
  startDate?: Date,
  endDate?: Date
) => {
  toast({ title: "Coming Soon..." })
}
