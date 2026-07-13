"use client"

import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { TrendingUp, Users, Clock, AlertTriangle } from "lucide-react"

export default function AnalyticsPage() {
  const facultyWorkloadData = [
    { name: "Dr. A", hours: 18 },
    { name: "Dr. B", hours: 16 },
    { name: "Dr. C", hours: 20 },
    { name: "Dr. D", hours: 15 },
    { name: "Dr. E", hours: 19 },
    { name: "Dr. F", hours: 17 },
    { name: "Dr. G", hours: 18 },
    { name: "Dr. H", hours: 14 },
  ]

  const roomUtilizationData = [
    { day: "Mon", utilization: 85 },
    { day: "Tue", utilization: 92 },
    { day: "Wed", utilization: 65 },
    { day: "Thu", utilization: 88 },
    { day: "Fri", utilization: 90 },
    { day: "Sat", utilization: 70 },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">Insights and metrics for your timetable system</p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Faculty Load</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">17.1 hrs</div>
              <p className="text-xs text-muted-foreground mt-1">Per week</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Room Utilization</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">82%</div>
              <p className="text-xs text-muted-foreground mt-1">Average across week</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Peak Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10-12 AM</div>
              <p className="text-xs text-muted-foreground mt-1">Highest utilization</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Conflicts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-1">0</div>
              <p className="text-xs text-muted-foreground mt-1">In current version</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Faculty Workload Distribution</CardTitle>
              <CardDescription>Hours per week for each faculty member</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={facultyWorkloadData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="hours" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Room Utilization by Day</CardTitle>
              <CardDescription>Percentage of room usage throughout the week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={roomUtilizationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line type="monotone" dataKey="utilization" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
            <CardDescription>AI-generated recommendations for optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-chart-1/10">
                <TrendingUp className="h-5 w-5 text-chart-1 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Balanced Faculty Load</p>
                  <p className="text-xs text-muted-foreground">
                    Faculty workload is well-distributed with minimal variance. Dr. C has slightly higher load (20 hrs)
                    - consider redistributing if possible.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-chart-2/10">
                <Clock className="h-5 w-5 text-chart-2 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Wednesday Underutilization</p>
                  <p className="text-xs text-muted-foreground">
                    Wednesday shows 65% room utilization due to online classes. Consider scheduling special activities
                    or workshops.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-chart-4/10">
                <Users className="h-5 w-5 text-chart-4 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Peak Hour Optimization</p>
                  <p className="text-xs text-muted-foreground">
                    10-12 AM shows highest utilization. Ensure adequate resources and avoid scheduling maintenance
                    during this window.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
