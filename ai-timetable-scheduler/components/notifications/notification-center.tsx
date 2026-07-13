"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, X, Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { Notification } from "@/lib/types"
import Link from "next/link"

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "info",
      title: "New Timetable Version",
      message: "Version v1.2 has been published for review",
      timestamp: "2025-01-16T10:30:00Z",
      read: false,
      actionUrl: "/admin/versions",
    },
    {
      id: "2",
      type: "success",
      title: "Timetable Approved",
      message: "Dr. A has approved the timetable for TY1",
      timestamp: "2025-01-16T09:15:00Z",
      read: false,
    },
    {
      id: "3",
      type: "warning",
      title: "Approval Deadline",
      message: "3 days left to approve the proposed timetable",
      timestamp: "2025-01-15T14:00:00Z",
      read: true,
    },
    {
      id: "4",
      type: "error",
      title: "Conflict Detected",
      message: "Room S403 has overlapping bookings on Monday 10:50-11:45",
      timestamp: "2025-01-15T11:20:00Z",
      read: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-chart-1" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-chart-2" />
      case "error":
        return <XCircle className="h-5 w-5 text-destructive" />
      default:
        return <Info className="h-5 w-5 text-chart-4" />
    }
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-white text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md bg-background border-border">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>Stay updated with the latest changes</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" size="sm" className="w-full gap-2 bg-transparent">
              <Check className="h-4 w-4" />
              Mark all as read
            </Button>
          )}

          <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
            {notifications.length === 0 ? (
              <Card className="border-border bg-card">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No notifications</p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`border-border ${notification.read ? "bg-card" : "bg-muted/50"}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 flex-1">
                        {getIcon(notification.type)}
                        <div className="flex-1 space-y-1">
                          <CardTitle className="text-sm font-semibold">{notification.title}</CardTitle>
                          <CardDescription className="text-xs">{notification.message}</CardDescription>
                          <p className="text-xs text-muted-foreground">{getTimeAgo(notification.timestamp)}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {notification.actionUrl && (
                    <CardContent className="pt-0">
                      <Link href={notification.actionUrl}>
                        <Button variant="outline" size="sm" className="w-full text-xs bg-transparent">
                          View Details
                        </Button>
                      </Link>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
