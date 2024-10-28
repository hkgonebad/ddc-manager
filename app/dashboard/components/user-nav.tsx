"use client"

// Ensure this component can use hooks like useEffect and useState
import React, { useEffect, useState } from "react"
import useSupabaseBrowser from "@/utils/supabase-browser"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserNav() {
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")

  const supabase = useSupabaseBrowser()

  useEffect(() => {
    const fetchUserData = async () => {
      // Get the authenticated user
      const {
        data: { user },
        error: sessionError,
      } = await supabase.auth.getUser()

      if (sessionError) {
        console.error("Error fetching session:", sessionError)
        return
      }

      if (user) {
        // Fetch user data from the 'users' table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("name, email")
          .eq("auth_user_id", user.id) // Match the UUID with auth_user_id
          .single() // Get a single user

        if (userError) {
          console.error("Error fetching user data:", userError)
        } else if (userData) {
          setUserName(userData.name || "User") // Fallback to "User" if name is null
          setUserEmail(userData.email || "No email")
        }
      }
    }

    fetchUserData()
  }, [supabase])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative size-8 rounded-full">
          <Avatar className="size-8">
            <AvatarImage src="/avatar.png" alt={userName || "@user"} />
            <AvatarFallback>
              {userName ? userName.charAt(0) : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
