"use client"

import { useCallback, useEffect, useState } from "react"
import useSupabaseBrowser from "@/utils/supabase-browser"
import { type User } from "@supabase/supabase-js"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

import Avatar from "./avatar"

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = useSupabaseBrowser()
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from("users")
        .select(`name, avatar_url, email`)
        .eq("auth_user_id", user?.id as string)
        .single()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setFullname(data.name)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert("Error loading user data!")
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile({
    fullname,
    avatar_url,
  }: {
    fullname: string | null
    avatar_url: string | null
  }) {
    try {
      setLoading(true)

      // Prepare the data to be updated, excluding email and auth_user_id
      const updatedData = {
        name: fullname,
        avatar_url,
        updated_at: new Date().toISOString(),
      }

      // Only perform the update if there are fields to update
      if (fullname || avatar_url) {
        const { error } = await supabase
          .from("users")
          .update(updatedData) // Use update instead of upsert
          .eq("auth_user_id", user?.id as string) // Identify the record to update

        if (error) throw error
        alert("Account updated!")
      }
    } catch (error) {
      alert("Error updating the data!")
      console.error(error) // Log the error for further debugging
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full space-y-8 px-2 py-8">
      <Avatar
        uid={user?.id ?? null}
        url={avatar_url}
        size={144}
        onUpload={(url) => {
          setAvatarUrl(url)
          updateProfile({ fullname, avatar_url: url })
        }}
      />
      <div className="flex flex-col">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="email"
        >
          Email
        </label>
        <input
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          )}
          id="email"
          type="text"
          value={user?.email}
          disabled
        />
      </div>
      <div className="flex flex-col">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="fullName"
        >
          Full Name
        </label>
        <input
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          )}
          id="fullName"
          type="text"
          value={fullname || ""}
          onChange={(e) => setFullname(e.target.value)}
        />
      </div>

      <div className="grid w-full grid-cols-1 justify-evenly">
        <button
          className={buttonVariants({ variant: "outline" })}
          onClick={() => updateProfile({ fullname, avatar_url })}
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update Account"}
        </button>
      </div>

      <div className="mb-2 flex w-full flex-col">
        <form
          className="items-center space-y-8"
          action="/auth/signout"
          method="post"
        >
          <button
            className={buttonVariants({ variant: "outline" })}
            type="submit"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}
