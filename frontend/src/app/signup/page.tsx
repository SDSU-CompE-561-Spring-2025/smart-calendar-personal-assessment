import { SignUpForm } from "@/components/signup-form"
import { Headerinstance } from "@/components/header"
import { Toaster } from "@/components/ui/sonner"

export default function SignUpPage() {
  return (
    <div>
      <Headerinstance />
      <div className="flex flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SignUpForm />
          <Toaster/>
        </div>
      </div>
    </div>
  )
}