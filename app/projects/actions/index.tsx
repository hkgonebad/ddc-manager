"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

import { Project } from "@/types/project"

const supabase = createClient()

// Fetch all projects from Supabase
export async function getProjects() {
  const { data, error } = await supabase.from("projects").select("*")

  if (error) {
    console.error("Error fetching projects:", error)
    throw new Error(error.message)
  }

  return data
}

// Create a new project
export async function createProject(projectData: Project) {
  const { data, error } = await supabase.from("projects").insert(projectData)

  if (error) {
    console.error("Error adding project:", error)
    throw new Error(error.message)
  }

  console.log("Project added successfully:", data)
  return data
}

// Update a project
export async function updateProject(projectId: string, projectData: Project) {
  const { data, error } = await supabase
    .from("projects")
    .update(projectData)
    .match({ id: projectId }) // Use the id to update the correct project

  if (error) {
    console.error("Error updating project:", error)
    throw new Error(error.message)
  }

  console.log("Project updated successfully:", data)
  return data
}

// Delete a project
export async function deleteProject(projectId: string) {
  const { data, error } = await supabase
    .from("projects")
    .delete()
    .match({ id: projectId })

  if (error) {
    console.error("Error deleting project:", error)
    throw new Error(error.message)
  }

  console.log("Project deleted successfully:", data)
  return data
}

// Optional Export to PDF or Excel functions for future implementation
// export function exportToPDF(projectData: Project) {
//   // Implement PDF export logic here
//   console.log("Exporting to PDF:", projectData);
// }

// export function exportToExcel(projectData: Project) {
//   // Implement Excel export logic here
//   console.log("Exporting to Excel:", projectData);
// }
