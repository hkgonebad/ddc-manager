import React, { ReactNode } from "react"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { readUserSession } from "@/utils/actions"

import MobileSideNav from "../dashboard/components/MobileSideNav"
import SideNav from "../dashboard/components/SideNav"
import ToggleSidebar from "../dashboard/components/ToggleSidebar"

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects for DDC Manager",
}

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

      <div className="w-full space-y-5 bg-gray-100 p-5 dark:bg-inherit sm:flex-1 sm:p-8">
        <ToggleSidebar />
        {children}
      </div>
    </div>
  )
}
