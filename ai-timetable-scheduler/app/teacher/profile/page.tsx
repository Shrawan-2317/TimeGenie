"use client"

import { TeacherLayout } from "@/components/layouts/teacher-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, BookOpen, Clock, MapPin, Edit } from "lucide-react"

export default function ProfilePage() {
  const teacherProfile = {
    name: "Dr. A",
    email: "dr.a@university.edu",
    phone: "+91 98765 43210",
    department: "Computer Science",
    designation: "Associate Professor",
    subjects: ["DBMS", "Database Systems", "SQL"],
    maxHoursPerDay: 6,
    preferredRooms: ["S403", "LAB1"],
    unavailableSlots: ["Wednesday 13:40-14:35", "Friday 15:40-16:30"],
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
            <p className="text-muted-foreground">Your personal information and preferences</p>
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your basic details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{teacherProfile.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{teacherProfile.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{teacherProfile.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium">{teacherProfile.department}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Teaching Preferences</CardTitle>
                <CardDescription>Your scheduling preferences and constraints</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Max Hours Per Day</p>
                    <p className="font-medium">{teacherProfile.maxHoursPerDay} hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Preferred Rooms</p>
                    <div className="flex flex-wrap gap-2">
                      {teacherProfile.preferredRooms.map((room) => (
                        <Badge key={room} variant="secondary" className="bg-chart-2/20 text-chart-2 border-chart-2">
                          {room}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Unavailable Slots</p>
                    <div className="space-y-1">
                      {teacherProfile.unavailableSlots.map((slot) => (
                        <p key={slot} className="text-sm font-medium">
                          {slot}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Subjects</CardTitle>
                <CardDescription>Courses you teach</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {teacherProfile.subjects.map((subject) => (
                    <div key={subject} className="flex items-center gap-2 p-2 rounded-lg bg-chart-2/10">
                      <BookOpen className="h-4 w-4 text-chart-2" />
                      <span className="text-sm font-medium">{subject}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Weekly Hours</span>
                  <span className="text-sm font-bold">18</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Classes</span>
                  <span className="text-sm font-bold">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pending Approvals</span>
                  <span className="text-sm font-bold text-chart-2">1</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TeacherLayout>
  )
}
