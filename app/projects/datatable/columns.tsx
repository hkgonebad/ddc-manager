"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { ArrowUpDown, Edit, TrashIcon } from "lucide-react"

import { Project } from "@/types/project"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import DailogForm from "@/app/dashboard/members/components/DialogForm"

import { deleteProject, updateProject } from "../actions"
import AlertDialog from "../components/AlertDialog"
import ProjectDialogForm from "../components/ProjectDialogForm"

type ActionsCellProps = {
  project: Project
  fetchProjects: () => Promise<void>
}

const ActionsCell: React.FC<ActionsCellProps> = ({
  project,
  fetchProjects,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleDelete = async () => {
    try {
      if (project.id) {
        await deleteProject(project.id) // Delete function
        fetchProjects() // Refresh projects after delete
        toast({ title: "Project deleted successfully" })
      } else {
        console.error("Project ID is undefined")
      }
    } catch (error) {
      toast({
        title: "Error deleting project",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
      console.error("Error deleting project:", error)
    }
  }

  const handleEdit = () => setIsDialogOpen(true)

  return (
    <>
      <div className="flex items-center gap-2">
        <DailogForm
          id={`edit-project-${project.id}`}
          title="Edit Project"
          isOpen={isDialogOpen}
          onOpen={setIsDialogOpen}
          Trigger={
            <Button variant="outline" size="icon">
              <Edit size="14" />
            </Button>
          }
          form={
            <ProjectDialogForm project={project} onSuccess={fetchProjects} />
          }
        />

        <AlertDialog
          trigger={
            <Button variant="outline" size="icon">
              <TrashIcon size="14" />
            </Button>
          }
          onConfirm={handleDelete}
          title="Delete Project"
          message="Are you sure you want to delete this project? This cannot be reversed. Please proceed with caution."
        />
      </div>
    </>
  )
}

// Define your columns with additional sortability and actions
export const columns = (
  fetchProjects: () => Promise<void>
): ColumnDef<Project>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Project Name",
    cell: ({ row }) => <div className="">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "manager",
    header: "Project Manager",
    cell: ({ row }) => <div className="">{row.getValue("manager")}</div>,
  },
  {
    accessorKey: "client",
    header: ({ column }) => (
      <span className="flex items-center ">
        Client{" "}
        <ArrowUpDown
          size="14"
          className="ms-2 shrink-0 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      </span>
    ),
    cell: ({ row }) => <div className="">{row.getValue("client")}</div>,
  },
  {
    accessorKey: "coordinator",
    header: ({ column }) => (
      <span className="flex items-center ">
        Coordinator{" "}
        <ArrowUpDown
          size="14"
          className="ms-2 shrink-0 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      </span>
    ),
    cell: ({ row }) => <div className="">{row.getValue("coordinator")}</div>,
  },
  {
    accessorKey: "start_date",
    header: ({ column }) => (
      <span className="flex items-center ">
        Start Date{" "}
        <ArrowUpDown
          size="14"
          className="ms-2  shrink-0 cursor-pointer "
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      </span>
    ),
    cell: ({ row }) => {
      const dateValue = row.getValue("start_date") as string
      return (
        <div className="">
          {dateValue ? format(new Date(dateValue), "dd-MM-yyyy") : ""}
        </div>
      )
    },
  },
  {
    accessorKey: "deadline",
    header: ({ column }) => (
      <span className="flex items-center ">
        Deadline{" "}
        <ArrowUpDown
          size="14"
          className="ms-2 shrink-0 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      </span>
    ),
    cell: ({ row }) => {
      const dateValue = row.getValue("deadline") as string
      return (
        <div className="">
          {dateValue ? format(new Date(dateValue), "dd-MM-yyyy") : ""}
        </div>
      )
    },
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => <div className="">{row.getValue("department")}</div>,
  },
  {
    accessorKey: "team",
    header: "Team Assigned",
    cell: ({ row }) => <div className="">{row.getValue("team")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <div className="">{row.getValue("status")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <ActionsCell project={row.original} fetchProjects={fetchProjects} />
      )
    },
  },
]
