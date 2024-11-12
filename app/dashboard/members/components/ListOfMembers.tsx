"use client"

import React, { useEffect, useState } from "react"
import useSupabaseBrowser from "@/utils/supabase-browser"
import { TrashIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Import Supabase client
import EditMember from "./edit/EditMember"

export default function ListOfMembers() {
  const supabase = useSupabaseBrowser()
  interface Member {
    name: string
    role: string
    created_at: string
    status?: string
  }

  const [members, setMembers] = useState<Member[]>([])

  // Fetch users from Supabase on component mount
  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from("employees")
        .select("name, role, created_at, status") // Adjust fields as per your table

      if (error) {
        console.error("Error fetching members:", error)
      } else {
        setMembers(data || []) // Set fetched data or an empty array
      }
    }

    fetchMembers()
  }, [supabase])

  return (
    <div className="mx-2 rounded-sm bg-white dark:bg-inherit">
      {members.map((member, index) => (
        <div
          className="grid grid-cols-5 rounded-sm p-3 align-middle font-normal"
          key={index}
        >
          <h1>{member.name || "Unnamed"}</h1>
          <div>
            <span
              className={cn(
                "rounded-full border-[.5px] px-2 py-1 text-sm capitalize shadow dark:bg-zinc-800",
                {
                  "border-green-500 text-green-600 bg-green-200":
                    member.role === "admin",
                  "border-zinc-300 dark:text-yellow-300 dark:border-yellow-700 px-4 bg-yellow-50":
                    member.role === "user",
                }
              )}
            >
              {member.role || "No role"}
            </span>
          </div>
          <h1>{new Date(member.created_at).toDateString()}</h1>
          <div>
            <span
              className={cn(
                "rounded-full border border-zinc-300 px-2 py-1 text-sm capitalize dark:bg-zinc-800",
                {
                  "text-green-600 px-4 dark:border-green-400 bg-green-200":
                    member.status === "active",
                  "text-red-500 bg-red-100 dark:text-red-300 dark:border-red-400":
                    member.status === "resigned",
                }
              )}
            >
              {member.status || "No status"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <TrashIcon />
            </Button>
            <EditMember />
          </div>
        </div>
      ))}
    </div>
  )
}
