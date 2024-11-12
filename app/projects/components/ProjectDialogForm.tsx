"use client"

import { useEffect, useState } from "react"
import useSupabaseBrowser from "@/utils/supabase-browser"

import { Project } from "@/types/project"
import { toast } from "@/components/ui/use-toast"

import { createProject, updateProject } from "../actions"

interface ProjectDialogFormProps {
  onSuccess: () => void
  project?: Project
}

const ProjectDialogForm = ({ onSuccess, project }: ProjectDialogFormProps) => {
  const supabase = useSupabaseBrowser()
  const isEdit = !!project
  const [formData, setFormData] = useState({
    id: project?.id || "",
    user_id: "",
    name: project?.name || "",
    client: project?.client || "",
    departments: project?.departments || "",
    deadline: project?.deadline || "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch user_id from Supabase session if not in edit mode
  useEffect(() => {
    if (!isEdit) {
      const getUserId = async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          setFormData((prevData) => ({
            ...prevData,
            user_id: session.user.id,
          }))
        }
      }

      getUserId()
    } else {
      // For editing, set the existing project user_id
      setFormData((prevData) => ({
        ...prevData,
        user_id: project?.user_id || "",
      }))
    }
  }, [supabase, isEdit, project])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isEdit && project) {
        // Update project if in edit mode
        await updateProject(formData.id, formData)
        toast({ title: "Project updated successfully" })
      } else {
        // Create project if not in edit mode
        const { id, ...newProjectData } = formData // Exclude the id from the formData for new projects
        await createProject(newProjectData)
        toast({ title: "Project created successfully" })
      }
      onSuccess()
    } catch (error) {
      console.error("Error:", error)
      setError(isEdit ? "Failed to update project" : "Failed to create project")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        {/* <h1 className="text-2xl font-semibold">
          {isEdit ? "Edit Project" : "New Project"}
        </h1> */}
      </div>

      {/* Project Name, Project Manager, Client (from clients table/ or add option for new client), Coordinator (Select: only two), Start Date (dd-mm-yyy), End Date/Deadline (dd-mm-yyy), Department (Select: UI/UX, Visual Studio, Audio, etc), Team (Members Dropdown/Add New Team Member), Status (Select: Planning, Ongoing, Completed) */}

      <form onSubmit={handleSubmit}>
        <div className="mt-4 flex flex-col">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Project Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 rounded-md border border-gray-300 p-2"
          />
        </div>
        <div className="mt-4 flex flex-col">
          <label htmlFor="client" className="text-sm font-medium text-gray-700">
            Client
          </label>
          <input
            type="text"
            id="client"
            name="client"
            value={formData.client}
            onChange={handleChange}
            className="mt-1 rounded-md border border-gray-300 p-2"
          />
        </div>
        <div className="mt-4 flex flex-col">
          <label
            htmlFor="departments"
            className="text-sm font-medium text-gray-700"
          >
            Departments
          </label>
          <input
            type="text"
            id="departments"
            name="departments"
            value={formData.departments}
            onChange={handleChange}
            className="mt-1 rounded-md border border-gray-300 p-2"
          />
        </div>
        <div className="mt-4 flex flex-col">
          <label
            htmlFor="deadline"
            className="text-sm font-medium text-gray-700"
          >
            Deadline
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="mt-1 rounded-md border border-gray-300 p-2"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="rounded-md bg-blue-500 px-4 py-2 text-white"
            disabled={loading}
          >
            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
                ? "Update Project"
                : "Create Project"}
          </button>
        </div>
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </form>
    </>
  )
}

export default ProjectDialogForm
