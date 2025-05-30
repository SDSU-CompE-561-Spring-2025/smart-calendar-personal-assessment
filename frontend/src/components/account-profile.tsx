'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { XIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import { useState, useEffect } from "react"
import { API_HOST_BASE_URL } from "@/lib/constants"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { useRouter } from "next/navigation"

export function AccountForm({
  className, 
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  });

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          router.push('/signin');
          return;
        }

        const response = await fetch(`${API_HOST_BASE_URL}/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 404) {
          toast.error("User not found");
          localStorage.removeItem('access_token');
          router.push('/signin');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          password: ""
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load account details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/signin');
        return;
      }

      // Validate inputs
      if (!userData.first_name || !userData.last_name || !userData.email) {
        toast.error("Please fill in all required fields");
        setSaving(false);
        return;
      }

      const response = await fetch(`${API_HOST_BASE_URL}/user/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          ...(userData.password ? { password: userData.password } : {})
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update user data');
      }

      toast.success("Account details updated successfully");

    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Failed to update account details");
    } finally {
      setSaving(false);
    }
  };

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
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-xl font-bold">Account</h1>
              <div className="text-center text-sm">
                Manage your account details.
              </div>
              <Avatar className="w-24 h-24 rounded-[50] border-4 border-gray-200 overflow-hidden flex items-center justify-center">
                <AvatarImage src="/images/defaultusericon.png" alt="User Avatar" />
                <AvatarFallback>{userData.first_name ? userData.first_name[0] : 'U'}</AvatarFallback>
              </Avatar>

            </div>

            {loading ? (
              <div className="flex justify-center py-6">
                <p>Loading account details...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="fname">First Name</Label>
                    <Input
                      id="fname"
                      type="text"
                      placeholder="John"
                      required
                      value={userData.first_name}
                      onChange={(e) => setUserData({ ...userData, first_name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="lname">Last Name</Label>
                    <Input
                      id="lname"
                      type="text"
                      placeholder="Doe"
                      required
                      value={userData.last_name}
                      onChange={(e) => setUserData({ ...userData, last_name: e.target.value })}
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
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password (leave blank to keep current)</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="*********"
                    value={userData.password}
                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full text-white hover:opacity-90"
                  style={{ backgroundColor: 'var(--accentcolor)' }}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Update Account Details"}
                </Button>
              </div>
            )}
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
}