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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ToastAction } from "@/components/ui/toast"
import { toast } from "@/components/ui/use-toast"
import { loginWithEmailAndPassword } from "@/app/auth/actions"

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
})

export default function SignInForm() {
  const [isPending, startTransition] = useTransition()
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const router = useRouter()

  const onSignInSubmit = async (data: z.infer<typeof SignInSchema>) => {
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
    <Form {...form}>
      <form
        className="w-full space-y-6"
        onSubmit={form.handleSubmit((data) => onSignInSubmit(data))}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="example@gmail.com"
                  {...field}
                  type="email"
                  onChange={field.onChange}
                />
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
                <Input
                  placeholder="password"
                  {...field}
                  type="password"
                  onChange={field.onChange}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="flex w-full items-center gap-2" variant="outline">
          Sign In{" "}
          <AiOutlineLoading3Quarters
            className={cn(" animate-spin", { hidden: !isPending })}
          />
        </Button>
      </form>
    </Form>
  )
}
