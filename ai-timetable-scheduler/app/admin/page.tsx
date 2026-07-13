"use client"

import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { Calendar, Users, BookOpen, DoorOpen, Sparkles, FileText, Clock, TrendingUp } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function AdminDashboardPage() {
  const { inputData, draftVersion } = useAppStore()

  const stats = {
    classes: inputData ? Object.keys(inputData.classes).length : 2,
    subjects: inputData ? Object.keys(inputData.subjects).length : 5,
    faculties: inputData ? Object.keys(inputData.faculties).length : 8,
    rooms: inputData ? Object.keys(inputData.rooms).length : 6,
  }

  const recentActivity = [
    {
      id: 1,
      action: "Timetable Generated",
      description: "TY1 timetable v1.0 created",
      time: "2 hours ago",
      icon: Sparkles,
      color: "text-pink-600",
    },
    {
      id: 2,
      action: "Draft Saved",
      description: "TY2 timetable draft updated",
      time: "5 hours ago",
      icon: FileText,
      color: "text-orange-600",
    },
    {
      id: 3,
      action: "Data Updated",
      description: "Faculty preferences modified",
      time: "1 day ago",
      icon: Users,
      color: "text-yellow-600",
    },
    {
      id: 4,
      action: "Version Published",
      description: "TY1 timetable v0.9 published",
      time: "2 days ago",
      icon: Calendar,
      color: "text-red-600",
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight gradient-text">Admin Dashboard</h2>
          <p className="text-muted-foreground">Overview of your timetable management system</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="gradient-border overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-br from-pink-50 to-white">
              <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
              <Calendar className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent className="bg-white">
              <div className="text-2xl font-bold gradient-text">{stats.classes}</div>
              <p className="text-xs text-muted-foreground mt-1">Active sections</p>
            </CardContent>
          </Card>

          <Card className="gradient-border overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-br from-orange-50 to-white">
              <CardTitle className="text-sm font-medium">Subjects</CardTitle>
              <BookOpen className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent className="bg-white">
              <div className="text-2xl font-bold gradient-text">{stats.subjects}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all classes</p>
            </CardContent>
          </Card>

          <Card className="gradient-border overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-br from-yellow-50 to-white">
              <CardTitle className="text-sm font-medium">Faculties</CardTitle>
              <Users className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent className="bg-white">
              <div className="text-2xl font-bold gradient-text">{stats.faculties}</div>
              <p className="text-xs text-muted-foreground mt-1">Teaching staff</p>
            </CardContent>
          </Card>

          <Card className="gradient-border overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-br from-red-50 to-white">
              <CardTitle className="text-sm font-medium">Rooms</CardTitle>
              <DoorOpen className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent className="bg-white">
              <div className="text-2xl font-bold gradient-text">{stats.rooms}</div>
              <p className="text-xs text-muted-foreground mt-1">Available spaces</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Quick Actions */}
          <Card className="gradient-border overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 bg-white pt-6">
              <Link href="/admin/create-timetable">
                <Button className="w-full justify-start gap-2 gradient-primary text-white border-0 hover:opacity-90 transition-opacity">
                  <Sparkles className="h-4 w-4" />
                  Create New Timetable
                </Button>
              </Link>
              <Link href="/admin/generate">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 bg-gradient-to-r from-orange-50 to-pink-50 border-orange-200 hover:border-orange-300"
                >
                  <Calendar className="h-4 w-4" />
                  Generate Timetable
                </Button>
              </Link>
              {/* ✅ NEW: Faculty Timetables Button */}
              <Link href="/admin/faculty-timetable">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:border-green-300"
                >
                  <Users className="h-4 w-4" />
                  Faculty Timetables
                </Button>
              </Link>
              <Link href="/admin/versions">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:border-yellow-300"
                >
                  <FileText className="h-4 w-4" />
                  View All Versions
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 bg-gradient-to-r from-red-50 to-pink-50 border-red-200 hover:border-red-300"
                >
                  <TrendingUp className="h-4 w-4" />
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="gradient-border overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and changes</CardDescription>
            </CardHeader>
            <CardContent className="bg-white pt-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon
                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={cn("mt-0.5", activity.color)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Draft Status */}
                  
          {draftVersion && (
            <Card className="gradient-border overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-pink-50 via-orange-50 to-yellow-50">
                <CardTitle>Current Draft</CardTitle>
                <CardDescription>Work in progress timetable</CardDescription>
              </CardHeader>
              <CardContent className="bg-white pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Version: {draftVersion.version}</p>
                    <p className="text-xs text-muted-foreground">
                      Status: <span className="capitalize">{draftVersion.status}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Classes: {draftVersion.class_timelines ? Object.keys(draftVersion.class_timelines).join(", ") : "N/A"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/admin/generate">
                      <Button variant="outline" className="bg-gradient-to-r from-orange-50 to-pink-50 border-orange-200">
                        Continue Editing
                      </Button>
                    </Link>
                    <Button className="gradient-primary text-white border-0">Publish Draft</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        {/* System Health */}
        <Card className="gradient-border overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50">
            <CardTitle>System Health</CardTitle>
            <CardDescription>Current system status and metrics</CardDescription>
          </CardHeader>
          <CardContent className="bg-white pt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Data Quality</span>
                  <span className="text-sm font-medium text-pink-600">Excellent</span>
                </div>
                <div className="h-2 bg-pink-100 rounded-full overflow-hidden">
                  <div className="h-full gradient-primary" style={{ width: "95%" }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Constraint Satisfaction</span>
                  <span className="text-sm font-medium text-orange-600">Good</span>
                </div>
                <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
                  <div className="h-full gradient-secondary" style={{ width: "87%" }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Faculty Satisfaction</span>
                  <span className="text-sm font-medium text-yellow-600">Very Good</span>
                </div>
                <div className="h-2 bg-yellow-100 rounded-full overflow-hidden">
                  <div className="h-full gradient-accent" style={{ width: "92%" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
