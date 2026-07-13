"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { Calendar, LayoutDashboard, Upload, Send, Download, Bell, User, LogOut, Clock , UserCircleIcon} from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  children: ReactNode
}

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Create Timetable", href: "/admin/create-timetable", icon: Upload },
  { name: "Generate", href: "/admin/generate", icon: Calendar },
  { name: "Publish", href: "/admin/publish", icon: Send },
  { name: "Exports", href: "/admin/exports", icon: Download },
  { name: "Versions", href: "/admin/versions", icon: Clock },
  {
    name: "Faculty Timetables",
    href: "/admin/faculty-timetable",
    icon: UserCircleIcon
  },
]

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, setUser, notifications } = useAppStore()

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleSignOut = () => {
    setUser(null)
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-pink-200 bg-gradient-to-r from-pink-50 via-orange-50 to-yellow-50 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg gradient-primary">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold gradient-text">AI Timetable Scheduler</h1>
            <span className="px-2 py-1 text-xs font-medium gradient-primary text-white rounded">Admin</span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-pink-100"
              onClick={() => router.push("/admin/notifications")}
            >
              <Bell className="h-5 w-5 text-pink-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full gradient-primary text-xs flex items-center justify-center text-white font-medium">
                  {unreadCount}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-orange-100"
              onClick={() => router.push("/admin/profile")}
            >
              <User className="h-5 w-5 text-orange-600" />
            </Button>

            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2 hover:bg-red-100">
              <LogOut className="h-4 w-4 text-red-600" />
              <span className="text-red-600">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-pink-200 bg-gradient-to-b from-white to-pink-50 min-h-[calc(100vh-4rem)] p-4">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3",
                      isActive && "gradient-primary text-white hover:opacity-90",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {user && (
            <div className="mt-8 p-4 rounded-lg gradient-border bg-white">
              <p className="text-sm font-medium gradient-text">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
