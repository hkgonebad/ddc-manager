import React, { ReactNode } from "react"
import { redirect } from "next/navigation"
import { readUserSession } from "@/utils/actions"

import MobileSideNav from "./components/MobileSideNav"
import SideNav from "./components/SideNav"
import ToggleSidebar from "./components/ToggleSidebar"

export default async function Layout({ children }: { children: ReactNode }) {
  const { data: userSession } = await readUserSession()

  if (!userSession.session) {
    return redirect("/auth")
  }
  return (
    <div className="flex w-full ">
      <div className="flex h-screen flex-col">
        <SideNav />
        <MobileSideNav />
      </div>

      <div className="w-full space-y-5 bg-gray-100 p-5 dark:bg-inherit sm:flex-1 sm:p-10">
        <ToggleSidebar />
        {children}
      </div>
    </div>
  )
}
