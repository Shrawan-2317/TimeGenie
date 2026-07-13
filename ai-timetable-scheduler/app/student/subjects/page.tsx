"use client"

import { StudentLayout } from "@/components/layouts/student-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Beaker, User } from "lucide-react"

interface Subject {
  code: string
  name: string
  type: "theory" | "lab"
  hoursPerWeek: number
  faculty: string
}

export default function SubjectsPage() {
  const subjects: Subject[] = [
    { code: "CS401", name: "Database Management Systems", type: "theory", hoursPerWeek: 4, faculty: "Dr. A" },
    { code: "CS401L", name: "DBMS Lab", type: "lab", hoursPerWeek: 2, faculty: "Dr. A" },
    { code: "CS402", name: "Software Engineering", type: "theory", hoursPerWeek: 4, faculty: "Dr. C" },
    { code: "CS403", name: "Computer Networks", type: "theory", hoursPerWeek: 4, faculty: "Dr. E" },
    { code: "CS403L", name: "CN Lab", type: "lab", hoursPerWeek: 2, faculty: "Dr. E" },
    { code: "CS404", name: "Theory of Computation", type: "theory", hoursPerWeek: 4, faculty: "Dr. F" },
    { code: "CS405", name: "AI & Machine Learning", type: "theory", hoursPerWeek: 4, faculty: "Dr. G" },
  ]

  const totalTheoryHours = subjects.filter((s) => s.type === "theory").reduce((sum, s) => sum + s.hoursPerWeek, 0)
  const totalLabHours = subjects.filter((s) => s.type === "lab").reduce((sum, s) => sum + s.hoursPerWeek, 0)

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Subjects</h2>
          <p className="text-muted-foreground">Your courses for this semester</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subjects.length}</div>
              <p className="text-xs text-muted-foreground mt-1">This semester</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Theory Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTheoryHours}</div>
              <p className="text-xs text-muted-foreground mt-1">Per week</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Lab Hours</CardTitle>
              <Beaker className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLabHours}</div>
              <p className="text-xs text-muted-foreground mt-1">Per week</p>
            </CardContent>
          </Card>
        </div>

        {/* Subjects List */}
        <div className="grid gap-4 md:grid-cols-2">
          {subjects.map((subject) => (
            <Card key={subject.code} className="border-border bg-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    <CardDescription>{subject.code}</CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      subject.type === "lab"
                        ? "bg-chart-1/20 text-chart-1 border-chart-1"
                        : "bg-chart-2/20 text-chart-2 border-chart-2"
                    }
                  >
                    {subject.type === "lab" ? (
                      <Beaker className="h-3 w-3 mr-1" />
                    ) : (
                      <BookOpen className="h-3 w-3 mr-1" />
                    )}
                    {subject.type === "lab" ? "Lab" : "Theory"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Faculty:</span>
                    <span className="font-medium">{subject.faculty}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Hours per week:</span>
                    <span className="font-medium">{subject.hoursPerWeek}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </StudentLayout>
  )
}
