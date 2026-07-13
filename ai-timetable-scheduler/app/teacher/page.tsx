"use client"

import { useState } from "react"
import { TeacherLayout } from "@/components/layouts/teacher-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TimetableGrid } from "@/components/timetable/timetable-grid"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, BookOpen } from "lucide-react"
import type { TimetableSlot } from "@/lib/types"

export default function TeacherDashboardPage() {
  // Mock teacher data - in real app, this would come from auth context
  const teacherName = "Dr. A"
  const teacherSubjects = ["DBMS", "Database Systems"]

  // Mock teacher's timetable
  const [teacherSlots] = useState<TimetableSlot[]>([
    { day: "Monday", slot: "08:45-09:40", subject: "DBMS", faculty: "Dr. A", room: "S403", type: "theory" },
    { day: "Monday", slot: "09:40-10:35", subject: "DBMS", faculty: "Dr. A", room: "S403", type: "theory" },
    { day: "Tuesday", slot: "09:40-10:35", subject: "DBMS", faculty: "Dr. A", room: "S403", type: "theory" },
    { day: "Tuesday", slot: "10:50-11:45", subject: "DBMS_LAB", faculty: "Dr. A", room: "LAB1", type: "lab" },
    { day: "Tuesday", slot: "11:45-12:40", subject: "DBMS_LAB", faculty: "Dr. A", room: "LAB1", type: "lab" },
    { day: "Wednesday", slot: "08:45-09:40", subject: "DBMS", faculty: "Dr. A", room: "Online", type: "online" },
    { day: "Thursday", slot: "13:40-14:35", subject: "DBMS", faculty: "Dr. A", room: "S403", type: "theory" },
    { day: "Friday", slot: "13:40-14:35", subject: "DBMS", faculty: "Dr. A", room: "S403", type: "theory" },
  ])

  const weeklyStats = {
    totalHours: 18,
    theoryHours: 12,
    labHours: 6,
    classes: ["TY1", "TY2"],
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight gradient-text">Welcome, {teacherName}</h2>
          <p className="text-muted-foreground">Your weekly teaching schedule</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="gradient-border overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-br from-pink-50 to-white">
              <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
              <Clock className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent className="bg-white">
              <div className="text-2xl font-bold gradient-text">{weeklyStats.totalHours}</div>
              <p className="text-xs text-muted-foreground mt-1">Per week</p>
            </CardContent>
          </Card>

          <Card className="gradient-border overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-br from-orange-50 to-white">
              <CardTitle className="text-sm font-medium">Theory Classes</CardTitle>
              <BookOpen className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent className="bg-white">
              <div className="text-2xl font-bold gradient-text">{weeklyStats.theoryHours}</div>
              <p className="text-xs text-muted-foreground mt-1">Hours per week</p>
            </CardContent>
          </Card>

          <Card className="gradient-border overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-br from-yellow-50 to-white">
              <CardTitle className="text-sm font-medium">Lab Sessions</CardTitle>
              <MapPin className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent className="bg-white">
              <div className="text-2xl font-bold gradient-text">{weeklyStats.labHours}</div>
              <p className="text-xs text-muted-foreground mt-1">Hours per week</p>
            </CardContent>
          </Card>

          <Card className="gradient-border overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-br from-red-50 to-white">
              <CardTitle className="text-sm font-medium">Classes</CardTitle>
              <Calendar className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent className="bg-white">
              <div className="text-2xl font-bold gradient-text">{weeklyStats.classes.length}</div>
              <p className="text-xs text-muted-foreground mt-1">{weeklyStats.classes.join(", ")}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="gradient-border overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-orange-50">
            <CardTitle>Your Subjects</CardTitle>
            <CardDescription>Courses you are teaching this semester</CardDescription>
          </CardHeader>
          <CardContent className="bg-white pt-6">
            <div className="flex flex-wrap gap-2">
              {teacherSubjects.map((subject) => (
                <Badge key={subject} className="gradient-secondary text-white border-0">
                  {subject}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Timetable */}
        <TimetableGrid classId="teacher-view" slots={teacherSlots} editable={false} title="Your Weekly Schedule" />

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="gradient-border overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Monday, January 15, 2025</CardDescription>
            </CardHeader>
            <CardContent className="bg-white pt-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-pink-50 to-orange-50">
                  <Clock className="h-4 w-4 text-pink-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">08:45 - 09:40</p>
                    <p className="text-xs text-muted-foreground">DBMS - TY1 - Room S403</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-orange-50 to-yellow-50">
                  <Clock className="h-4 w-4 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">09:40 - 10:35</p>
                    <p className="text-xs text-muted-foreground">DBMS - TY1 - Room S403</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-border overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-red-50 to-pink-50">
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Important dates and deadlines</CardDescription>
            </CardHeader>
            <CardContent className="bg-white pt-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50">
                  <Calendar className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Timetable Approval Due</p>
                    <p className="text-xs text-muted-foreground">January 20, 2025</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-pink-50 to-red-50">
                  <Calendar className="h-4 w-4 text-pink-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Mid-Semester Exams</p>
                    <p className="text-xs text-muted-foreground">February 10-15, 2025</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TeacherLayout>
  )
}
