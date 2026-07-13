"use client"
import { usePathname, useRouter } from "next/navigation"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { Button } from "@/components/ui/button"
import { Calendar, LogOut } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Define SidebarProps interface
interface SidebarProps {
  items: any[]
  role: string
}

export function Sidebar({ items, role }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, setUser } = useAppStore()

  const handleSignOut = () => {
    setUser(null)
    router.push("/")
  }

  return (
    <div className="fixed left-0 top-0 h-screen w-64 border-r border-pink-200 bg-gradient-to-b from-white via-pink-50 to-orange-50 flex flex-col">
      <div className="p-4 border-b border-pink-200 flex items-center justify-between bg-gradient-to-r from-pink-50 to-orange-50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg gradient-primary">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold gradient-text">AI Timetable</h2>
            <p className="text-xs text-muted-foreground capitalize">{role} Portal</p>
          </div>
        </div>
        <NotificationCenter />
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn("w-full justify-start gap-3", isActive && "gradient-primary text-white hover:opacity-90")}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-pink-200 space-y-3 bg-gradient-to-r from-orange-50 to-pink-50">
        {user && (
          <div className="p-3 rounded-lg gradient-border bg-white">
            <p className="text-sm font-medium gradient-text">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        )}
        <Button
          variant="outline"
          className="w-full justify-start gap-2 border-red-200 hover:bg-red-50 bg-transparent"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 text-red-600" />
          <span className="text-red-600">Sign Out</span>
        </Button>
      </div>
    </div>
  )
}
