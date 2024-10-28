import Link from "next/link"
import { redirect } from "next/navigation"
import { readUserSession } from "@/utils/actions"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"

export default async function IndexPage() {
  const { data: userSession } = await readUserSession()

  if (userSession.session) {
    return redirect("/dashboard")
  }

  return redirect("/auth")
}
