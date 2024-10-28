"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createSupbaseServerClient } from "@/utils/supaone"

export async function signUpWithEmailAndPassword(data: {
  email: string
  password: string
  confirm: string
}) {
  const supabase = await createSupbaseServerClient()

  const result = await supabase.auth.signUp(data)
  return JSON.stringify(result)
}

export async function loginWithEmailAndPassword(data: {
  email: string
  password: string
}) {
  const supabase = await createSupbaseServerClient()

  const { data: session, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  // Log session user ID for debugging
  console.log("Session User ID:", session.user.id)

  // Fetch user information after sign-in
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("auth_user_id", session.user.id) // Assuming `id` is the user's UUID

  // Log the raw userData for debugging
  console.log("User Data Returned:", userData)

  // Handle potential multiple rows or no rows
  if (userError) {
    return { error: userError.message }
  }

  if (!userData || userData.length === 0) {
    return { error: "No user data found." }
  } else if (userData.length > 1) {
    return { error: "Multiple user records found. Please check your database." }
  }

  // If there's exactly one record, return the first one
  return { session, userData: userData[0] }
}

// export async function signInWithGoogle() {
//   const supabase = await createSupbaseServerClient()

//   supabase.auth.onAuthStateChange((event, session) => {
//     if (session && session.provider_token) {
//       window.localStorage.setItem(
//         "oauth_provider_token",
//         session.provider_token
//       )
//     }

//     if (session && session.provider_refresh_token) {
//       window.localStorage.setItem(
//         "oauth_provider_refresh_token",
//         session.provider_refresh_token
//       )
//     }

//     if (event === "SIGNED_OUT") {
//       window.localStorage.removeItem("oauth_provider_token")
//       window.localStorage.removeItem("oauth_provider_refresh_token")
//     }
//   })
//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider: "google",
//     options: {
//       redirectTo: "/auth/callback",
//     },
//   })

//   if (data.url) {
//     redirect(data.url)
//   }
// }

export async function logout() {
  const supabase = await createSupbaseServerClient()
  await supabase.auth.signOut()
  redirect("/auth")
}
