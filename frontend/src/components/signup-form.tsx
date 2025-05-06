'use client'

import { cn }                from "@/lib/utils"
import { API_HOST_BASE_URL } from "@/lib/constants" 
import { Button }            from "@/components/ui/button"
import { Input }             from "@/components/ui/input"
import { Label }             from "@/components/ui/label"

import { useState }  from "react" 
import { useRouter } from "next/navigation"

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
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

      // Redirect to dashboard or verification page after successful signup
      router.push("/planner")
    }
    catch (err: any) {
      setError(err.message)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit = {handleSubmit} className = "flex flex-col gap-6">
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
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="grid gap-3">
                <Label htmlFor="fname">First Name</Label>
                <Input
                  id="fname"
                  type="text"
                  placeholder="John"
                  required
                  value = {firstName}
                  onChange = {(event) => setFirstName(event.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="lname">Last Name</Label>
                <Input
                  id="lname"
                  type="text"
                  placeholder="Doe"
                  required
                  value = {lastName}
                  onChange = {(event) => setLastName(event.target.value)}
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
            <div className="grid gap-3">
              <Label htmlFor="password">Retype Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="*********"
                required
                value = {confirmPassword}
                onChange = {(event) => setConfirmPassword(event.target.value)}                
              />
            </div>
            <Button type="submit" className="w-full bg-(--accentcolor) text-white hover:bg-(--txtcolor)">
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}