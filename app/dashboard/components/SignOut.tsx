"use client"

import React, { useTransition } from "react"
import { AiOutlineLoading3Quarters } from "react-icons/ai"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/auth/actions"

export default function SignOut() {
  const [isPending, startTransition] = useTransition()
  //   const onSubmit = async () => {
  //     startTransition(async () => {
  //       await logout()
  //     })
  //   }

  const handleSignOut = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault() // Prevent the default form submission behavior
    startTransition(async () => {
      await logout()
    })
  }

  return (
    <form onSubmit={handleSignOut}>
      <Button className="flex w-full items-center gap-2" variant="outline">
        SignOut{" "}
        <AiOutlineLoading3Quarters
          className={cn(" animate-spin", { hidden: !isPending })}
        />
      </Button>
    </form>
  )
}
