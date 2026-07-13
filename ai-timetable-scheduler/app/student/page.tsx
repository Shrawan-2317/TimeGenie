"use client"

import { useState } from "react"
import { StudentLayout } from "@/components/layouts/student-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TimetableGrid } from "@/components/timetable/timetable-grid"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Download, Bell } from "lucide-react"
import type { TimetableSlot } from "@/lib/types"
import { generateSampleTimetable } from "@/lib/timetable-utils"
import Link from "next/link"

export default function StudentDashboardPage() {
  // Mock student data
  const studentClass = "TY1"
  const studentName = "Student"

  const [timetableSlots] = useState<TimetableSlot[]>(generateSampleTimetable(studentClass))

  // Get today's schedule (mock Monday for demo)
  const today = "Monday"
  const todaySlots = timetableSlots.filter((s) => s.day === today && s.subject)

  // Get next class
  const nextClass = todaySlots[0]

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight gradient-text">Welcome, {studentName}</h2>
            <p className="text-muted-foreground">Your class timetable for {studentClass}</p>
          </div>
          <Link href="/student/export">
            <Button className="gradient-primary text-white border-0 gap-2 hover:opacity-90">
              <Download className="h-4 w-4" />
              Export Timetable
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="gradient-border overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-br from-pink-50 to-white">
              <CardTitle className="text-sm font-medium">Next Class</CardTitle>
              <Bell className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent className="bg-white">
              {nextClass ? (
                <>
                  <div className="text-xl font-bold gradient-text">{nextClass.subject}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {nextClass.slot} • {nextClass.room}
                  </p>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">No classes today</div>
              )}
            </CardContent>
          </Card>

          <Card className="gradient-border overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-br from-orange-50 to-white">
              <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent className="bg-white">
              <div className="text-2xl font-bold gradient-text">{todaySlots.length}</div>
              <p className="text-xs text-muted-foreground mt-1">{today}</p>
            </CardContent>
          </Card>

          <Card className="gradient-border overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-br from-yellow-50 to-white">
              <CardTitle className="text-sm font-medium">Weekly Hours</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent className="bg-white">
              <div className="text-2xl font-bold gradient-text">32</div>
              <p className="text-xs text-muted-foreground mt-1">Including labs</p>
            </CardContent>
          </Card>
        </div>

        <Card className="gradient-border overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-pink-50 via-orange-50 to-yellow-50">
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>{today}, January 15, 2025</CardDescription>
          </CardHeader>
          <CardContent className="bg-white pt-6">
            <div className="space-y-2">
              {todaySlots.length > 0 ? (
                todaySlots.map((slot, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-pink-50 to-orange-50 hover:from-pink-100 hover:to-orange-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <Clock className="h-4 w-4 text-pink-600" />
                      <span className="text-sm font-mono">{slot.slot}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{slot.subject || slot.label}</p>
                      {slot.faculty && <p className="text-xs text-muted-foreground">{slot.faculty}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">{slot.room}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No classes scheduled for today</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Full Week Timetable */}
        <TimetableGrid classId={studentClass} slots={timetableSlots} editable={false} title="Weekly Timetable" />
      </div>
    </StudentLayout>
  )
}
