"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Bell } from "lucide-react"

export default function NotificationsManagementPage() {
  const [notificationType, setNotificationType] = useState<string>("info")
  const [recipient, setRecipient] = useState<string>("all")
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)

  const handleSend = () => {
    if (!title.trim() || !message.trim()) {
      alert("Please fill in all fields")
      return
    }

    // In real app, this would send to backend
    console.log({ type: notificationType, recipient, title, message })
    setSent(true)

    setTimeout(() => {
      setSent(false)
      setTitle("")
      setMessage("")
    }, 3000)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Send Notifications</h2>
          <p className="text-muted-foreground">Broadcast messages to users</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Compose Notification</CardTitle>
                <CardDescription>Send updates to teachers and students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="notification-type">Type</Label>
                    <Select value={notificationType} onValueChange={setNotificationType}>
                      <SelectTrigger id="notification-type" className="bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Information</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipients</Label>
                    <Select value={recipient} onValueChange={setRecipient}>
                      <SelectTrigger id="recipient" className="bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="teachers">Teachers Only</SelectItem>
                        <SelectItem value="students">Students Only</SelectItem>
                        <SelectItem value="ty1">TY1 Class</SelectItem>
                        <SelectItem value="ty2">TY2 Class</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Notification title..."
                    className="bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Notification message..."
                    className="bg-background border-border min-h-[150px]"
                  />
                </div>

                {sent ? (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-chart-1/10 text-chart-1">
                    <Bell className="h-4 w-4" />
                    <span className="text-sm font-medium">Notification sent successfully!</span>
                  </div>
                ) : (
                  <Button onClick={handleSend} className="bg-primary text-primary-foreground gap-2">
                    <Send className="h-4 w-4" />
                    Send Notification
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Users</span>
                  <span className="text-sm font-bold">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Teachers</span>
                  <span className="text-sm font-bold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Students</span>
                  <span className="text-sm font-bold">144</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base">Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <Bell className="h-4 w-4 text-chart-2 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">Timetable Update</p>
                    <p className="text-xs text-muted-foreground">Sent 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Bell className="h-4 w-4 text-chart-1 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">Approval Reminder</p>
                    <p className="text-xs text-muted-foreground">Sent 1 day ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
