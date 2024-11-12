export interface Project {
  id?: string
  name: string
  client: string
  manager_id?: number
  manager?: string
  coordinator_id?: number
  coordinator?: string
  start_date?: string
  departments?: string | string[]
  team?: string | string[]
  created_at?: string
  user_id: string
  deadline?: string
  status?: "planning" | "in-progress" | "completed" | "cancelled"
}
