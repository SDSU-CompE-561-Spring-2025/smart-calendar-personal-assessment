'use client'

import { cn }                from "@/lib/utils"
import { API_HOST_BASE_URL } from "@/lib/constants" 
import { Button }            from "@/components/ui/button"
import { Input }             from "@/components/ui/input"
import { Label }             from "@/components/ui/label"
import { toast } from "sonner"
import { AlertCircle } from "lucide-react"

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

      const data = await response.json()
      
      if (!response.ok) {
        // Set specific error messages based on status codes
        if (response.status === 401) {
          throw new Error("Incorrect email or password")
        } else {
          throw new Error(data.detail || response.statusText)
        }
      }
      
      const {access_token} = data
      localStorage.setItem("access_token", access_token)
      
      toast.success("Login successful!", {
        description: "Welcome back to Calendar+"
      })
      
      router.push("/planner") // Redirect to the dashboard after successful login
    }
    catch (error: any) {
      setError(error.message)
      toast.error("Login failed", {
        description: error.message
      })
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
          
          {/* Error message display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={error ? "border-red-400 focus-visible:ring-red-400" : ""}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="*********"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={error ? "border-red-400 focus-visible:ring-red-400" : ""}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-(--accentcolor) text-white hover:bg-(--txtcolor)"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}