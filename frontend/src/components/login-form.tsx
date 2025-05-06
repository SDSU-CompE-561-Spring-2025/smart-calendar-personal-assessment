'use client'

import { cn }                from "@/lib/utils"
import { API_HOST_BASE_URL } from "@/lib/constants" 
import { Button }            from "@/components/ui/button"
import { Input }             from "@/components/ui/input"
import { Label }             from "@/components/ui/label"

import { useState }  from "react" 
import { useRouter } from "next/navigation"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>){
    event.preventDefault()
    setLoading(true)
    setError(null)

    const body = new URLSearchParams()
    body.append("username", email)
    body.append("password", password)
    body.append("grant_type", "password")

    try {
      const response = await fetch(`${API_HOST_BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || response.statusText)
      }

      const {access_token} = await response.json()
      localStorage.setItem("access_token", access_token)
      router.push("/planner") // Redirect to the dashboard after successful login
    }
    catch (error: any) {
      setError(error.message)
    }
    finally {
      setLoading(false)
    }
  }
  //

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit = {handleSubmit} className = "flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-xl font-bold">Welcome to <span className="text-(--accentcolor) text-2xl">Calendar</span><span className="text-(--accentcolor2) text-2xl">+</span></h1>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                required
                value = {email}
                onChange = {(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="*********"
                required
                value = {password}
                onChange = {(event) => setPassword(event.target.value)}
              />
            </div>
            <Button type="submit" className="w-full bg-(--accentcolor) text-white hover:bg-(--txtcolor)">
              Sign In
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
