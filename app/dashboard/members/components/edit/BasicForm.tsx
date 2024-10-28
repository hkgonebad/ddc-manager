"use client"

import { useEffect, useState } from "react"
import useSupabaseBrowser from "@/utils/supabase-browser"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
})

export default function BasicForm() {
  const supabase = useSupabaseBrowser()
  const [loading, setLoading] = useState(false)
  const [initialName, setInitialName] = useState<string | null>(null) // Hold initial name state

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  })

  // Fetch user’s current name on component mount
  useEffect(() => {
    async function fetchUserData() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        toast({
          title: "Authentication Error",
          description: "Unable to fetch user data.",
          variant: "destructive",
        })
        return
      }

      // Get the user's name from the `users` table
      const { data: userData, error } = await supabase
        .from("users")
        .select("name")
        .eq("auth_user_id", user.id)
        .single()

      if (error) {
        toast({
          title: "Error Fetching Profile",
          description: "Unable to retrieve your profile information.",
          variant: "destructive",
        })
      } else {
        const name = userData?.name || "Enter name to update"
        setInitialName(name)
        form.reset({ name }) // Set initial form value
      }
    }

    fetchUserData()
  }, [supabase, form])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)
    const { name } = data

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      setLoading(false)
      toast({
        title: "Authentication Error",
        description: "Unable to authenticate user.",
        variant: "destructive",
      })
      return
    }

    // Step 1: Update the display name in Supabase Auth
    const { error: authUpdateError } = await supabase.auth.updateUser({
      data: { display_name: name }, // Update display_name in Auth
    })

    if (authUpdateError) {
      setLoading(false)
      toast({
        title: "Update Failed",
        description: "There was an error updating your display name in Auth.",
        variant: "destructive",
      })
      return
    }

    // Step 2: Update the display name in the users table
    const { error } = await supabase
      .from("users")
      .update({ name })
      .eq("auth_user_id", user.id) // Match `auth_user_id` to update the correct row

    setLoading(false)
    if (error) {
      toast({
        title: "Update Failed",
        description:
          "There was an error updating your profile in the database.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Profile Updated",
        description: "Your display name has been successfully updated.",
      })
      form.reset({ name })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your Name"
                  {...field}
                  defaultValue={initialName || ""} // Use initial name or empty string
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="flex w-full items-center gap-2"
          variant="outline"
          disabled={loading}
        >
          Update{" "}
          {loading && (
            <AiOutlineLoading3Quarters className="ml-2 animate-spin" />
          )}
        </Button>
      </form>
    </Form>
  )
}
