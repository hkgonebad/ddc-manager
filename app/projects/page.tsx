"use client"

import { useEffect, useState } from "react"
import useSupabaseBrowser from "@/utils/supabase-browser"
import { Plus } from "lucide-react"

import { Project } from "@/types/project"
import { Button } from "@/components/ui/button"

import DailogForm from "../dashboard/members/components/DialogForm"
import ProjectDialogForm from "./components/ProjectDialogForm"
import ProjectsTable from "./components/ProjectsTable"

const Projects = () => {
  const supabase = useSupabaseBrowser()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Fetch all projects from Supabase on component mount
  const fetchProjects = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from("projects").select("*")

      if (error) throw error

      if (data) {
        setProjects(data as Project[])
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  // Refresh and close dialog function
  const handleProjectAdded = () => {
    fetchProjects()
    setIsDialogOpen(false) // Close the dialog after adding project
  }

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-medium">Projects</h3>

        <DailogForm
          id="add-project"
          title="Add New Project"
          isOpen={isDialogOpen}
          onOpen={setIsDialogOpen}
          Trigger={
            <Button variant="outline">
              <Plus size="sm" className="me-2" /> New Project
            </Button>
          }
          form={<ProjectDialogForm onSuccess={handleProjectAdded} />}
        />
      </div>

      <ProjectsTable
        projects={filteredProjects}
        fetchProjects={fetchProjects}
      />
    </>
  )
}

export default Projects
