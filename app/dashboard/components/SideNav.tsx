import React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

import NavLinks from "./NavLinks"
import SignOut from "./SignOut"

export default function SideNav() {
  return <SideBar className=" dark:bg-gradient-dark hidden flex-1 lg:block" />
}

export const SideBar = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <div
        className={cn(
          "lg:w-75 flex size-full flex-col space-y-5 lg:border-r lg:p-6"
        )}
      >
        <div className="flex-1 space-y-5">
          <div className="flex flex-1 items-center gap-2">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <ThemeToggle />
          </div>

          <NavLinks />
        </div>

        <div className="">
          <SignOut />
        </div>
      </div>
    </div>
  )
}
