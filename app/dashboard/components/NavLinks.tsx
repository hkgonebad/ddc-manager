"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CrumpledPaperIcon, PersonIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"

export default function NavLinks() {
  const pathname = usePathname()

  const links = [
    {
      href: "/dashboard/members",
      text: "Members",
      Icon: PersonIcon,
    },
  ]

  return (
    <div className="space-y-5">
      {links.map((link, index) => {
        const Icon = link.Icon
        return (
          <Link
            onClick={() => document.getElementById("sidebar-close")?.click()}
            href={link.href}
            key={index}
            className={cn("flex items-center gap-2 rounded-sm p-2", {
              " bg-gray-500 dark:bg-gray-700 text-white ":
                pathname === link.href,
            })}
          >
            <Icon />
            {link.text}
          </Link>
        )
      })}
    </div>
  )
}
