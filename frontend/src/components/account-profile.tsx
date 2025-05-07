'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { XIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"

  export function AccountForm({
    className, 
    ...props
  }: React.ComponentProps<"div">) {
    return (
      <div>
        <div>
        <a href="/planner">
          <Button className="absolute left-5 top-17 rounded-md opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" variant="ghost">
            <XIcon className="h-50 w-50"/>
          </Button>
        </a>
      </div>

    <div className={cn("flex flex-col gap-6", className)} {...props}>
    <form className = "flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-xl font-bold">Account</h1>
          <div className="text-center text-sm">
            Manage your account details.
          </div>
          <Avatar className="w-24 h-24 rounded-[50] border-4 border-gray-200 overflow-hidden flex items-center justify-center">
            <AvatarImage src="/potthing.jpg" alt="User Avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
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
          <Button type="submit" className="w-full bg-(--accentcolor) text-white hover:bg-(--txtcolor)">
            Change Account Details
          </Button>
        </div>
      </div>
    </form>
    </div>
      </div>
      
    )
  }


/*   return (
    <div className="w-full">
      <div className="overflow-hidden">
        
        <div className=" p-8">
          <div className="flex flex-col items-center">
            
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-blue-300 border-4 border-gray-200 overflow-hidden flex items-center justify-center">
                <img src="/api/placeholder/100/100" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>

            
            <div className="w-full max-w-md">
              <div className="flex flex-wrap -mx-3 mb-4">
                <div className="w-1/2 px-3">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full border-b-2 border-gray-400 bg-transparent pb-1 focus:outline-none focus:border-teal-500"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="w-1/2 px-3">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Birthday</label>
                  <input
                    type="text"
                    className="w-full border-b-2 border-gray-400 bg-transparent pb-1 focus:outline-none focus:border-teal-500"
                    value={formData.birthday}
                    onChange={(e) => setFormData({...formData, birthday: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border-b-2 border-gray-400 bg-transparent pb-1 focus:outline-none focus:border-teal-500"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                <input
                  type="password"
                  className="w-full border-b-2 border-gray-400 bg-transparent pb-1 focus:outline-none focus:border-teal-500"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={handleUpdateProfile}
                  className="bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600 transition-colors"
                >
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> */
