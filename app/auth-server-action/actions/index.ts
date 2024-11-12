"use server"

import { redirect } from "next/navigation"
import { createSupbaseServerClient } from "@/utils/supaone"

export async function signUpWithEmailAndPassword(data: {
  email: string
  password: string
  confirm: string
}) {
  const supabase = await createSupbaseServerClient()

  // const result = await supabase.auth.signUp(data);
  // return JSON.stringify(result);

  const { data: authUser, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  })

  if (error) {
    return { error: error.message }
  }

  // Insert user with id but without a role.
  const { error: dbError } = await supabase.from("employees").insert([
    {
      id: authUser.user?.id,
      email: data.email,
      role: null, // Role will be assigned later by an admin
    },
  ])

  if (dbError) {
    return { error: dbError.message }
  }

  return { user: authUser.user }
}

export async function logout() {
  const supabase = await createSupbaseServerClient()
  await supabase.auth.signOut()
  redirect("/auth")
}
