"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { AuthTokenResponse } from "@supabase/supabase-js"
import { useForm } from "react-hook-form"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

import { loginWithEmailAndPassword } from "../actions"

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password can not be empty" }),
})

export default function AuthForm() {
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const router = useRouter()

  function onSubmit(data: z.infer<typeof LoginSchema>) {
    startTransition(async () => {
      const { error, session } = await loginWithEmailAndPassword(data)

      if (error) {
        toast({
          title: "Login Error",
          description: error, // Show the actual error message from Supabase
        })
      } else {
        // Redirect to Dashboard upon successful login
        router.push("/dashboard") // Adjust the path according to your routing structure
        toast({
          title: "Successfully logged in 🎉",
        })
      }
    })
  }

  return (
    <div className="w-96">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@ril.com" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="password" {...field} type="password" />
                </FormControl>
                <FormDescription>
                  {"Forget password? Please contact your admin for assistance."}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="flex w-full items-center gap-2" variant="outline">
            Log In{" "}
            <AiOutlineLoading3Quarters
              className={cn(" animate-spin", { hidden: !isPending })}
            />
          </Button>
        </form>
      </Form>
    </div>
  )
}
