
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form className = "flex flex-col gap-6">
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
                  //value = {fname}
                  //onChange = {(event) => createfname(event.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="lname">Last Name</Label>
                <Input
                  id="lname"
                  type="text"
                  placeholder="Doe"
                  required
                  //value = {lname}
                  //onChange = {(event) => setLname(event.target.value)}
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
                //value = {email}
                //onChange = {(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="*********"
                required
                //value = {password}
                //onChange = {(event) => setPassword(event.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Retype Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="*********"
                required
                
              />
            </div>
            <Button type="submit" className="w-full bg-(--accentcolor) text-white hover:bg-(--txtcolor)">
              Sign Up
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}