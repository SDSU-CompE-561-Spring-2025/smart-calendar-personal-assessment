'use client'

import { cn }                from "@/lib/utils"
import { API_HOST_BASE_URL } from "@/lib/constants" 
import { Button }            from "@/components/ui/button"
import { Input }             from "@/components/ui/input"
import { Label }             from "@/components/ui/label"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { AlertCircle } from "lucide-react"

import { useState }  from "react" 
import { useRouter } from "next/navigation"

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const { login } = useAuth()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Function to log in the user after successful registration
  const loginAfterSignup = async () => {
    try {
      const body = new URLSearchParams()
      body.append("username", email)
      body.append("password", password)
      body.append("grant_type", "password")

      const response = await fetch(`${API_HOST_BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.detail || response.statusText)
      }
      
      const { access_token } = data
      login(access_token) // Use the useAuth hook to set the token and update state
      toast.success("Account created successfully!")
      router.push("/planner") // Redirect to the dashboard after successful login
    } catch (error: any) {
      console.error("Auto-login error:", error)
      // If auto-login fails, redirect to login page
      toast.error("Account created, please log in.")
      router.push("/signin")
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_HOST_BASE_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || "Failed to create user")
      }

      // User was created successfully, now automatically log them in
      await loginAfterSignup()
    }
    catch (err: any) {
      setError(err.message)
      toast.error("Registration failed", {
        description: err.message,
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
            <h1 className="text-xl font-bold">Sign up for <span className="text-(--accentcolor) text-2xl">Calendar</span><span className="text-(--accentcolor2) text-2xl">+</span></h1>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <a href="/signin" className="underline underline-offset-4">
                Sign in
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
            <div className="grid grid-cols-2 gap-6">
              <div className="grid gap-3">
                <Label htmlFor="fname">First Name</Label>
                <Input
                  id="fname"
                  type="text"
                  placeholder="John"
                  required
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="lname">Last Name</Label>
                <Input
                  id="lname"
                  type="text"
                  placeholder="Doe"
                  required
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                />
              </div>
            </div>
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
                className={error && error.includes("password") ? "border-red-400 focus-visible:ring-red-400" : ""}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="confirmPassword">Retype Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="*********"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className={error && error.includes("match") ? "border-red-400 focus-visible:ring-red-400" : ""}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-(--accentcolor) text-white hover:bg-black"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
