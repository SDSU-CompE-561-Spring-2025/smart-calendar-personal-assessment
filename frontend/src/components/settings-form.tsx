import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import { XIcon } from "lucide-react"

export function SettingsForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div>
      <a href="/planner">
        <Button className="absolute left-5 top-17 rounded-md opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" variant="ghost">
          <XIcon className="h-50 w-50"/>
        </Button>
      </a>
      
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <form>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-xl font-bold">Settings</h1>
              <div className="text-center text-sm">Manage your settings and themes preferences.</div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                  <Label htmlFor="theme">Theme</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="calendar-start">Calendar Start</Label>
                    <Select>
                        <SelectTrigger className="w-full">
                        <SelectValue placeholder="Calendar Start" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="sunday">Sunday</SelectItem>
                        <SelectItem value="monday">Monday</SelectItem>
                        <SelectItem value="tuesday">Tuesday</SelectItem>
                        <SelectItem value="wednesday">Wednesday</SelectItem>
                        <SelectItem value="thursday">Thursday</SelectItem>
                        <SelectItem value="friday">Friday</SelectItem>
                        <SelectItem value="saturday">Saturday</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="timezone">Time Zone</Label>
                    <Select>
                        <SelectTrigger className="w-full">
                        <SelectValue placeholder="Time Zone" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="pst">PST</SelectItem>
                        <SelectItem value="est">EST</SelectItem>
                        <SelectItem value="cst">CST</SelectItem>
                        <SelectItem value="mst">MST</SelectItem>
                        </SelectContent>
                    </Select>
                </div>  
              <Button type="submit" className="w-full bg-(--accentcolor) text-white hover:bg-(--txtcolor)">
                Save Settings
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
    
  )
}
