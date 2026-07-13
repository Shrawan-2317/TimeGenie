"use client"

import { StudentLayout } from "@/components/layouts/student-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin } from "lucide-react"

interface Faculty {
  name: string
  email: string
  phone: string
  office: string
  subjects: string[]
}

export default function FacultyPage() {
  const faculties: Faculty[] = [
    {
      name: "Dr. A",
      email: "dr.a@university.edu",
      phone: "+91 98765 43210",
      office: "Room 301, CS Block",
      subjects: ["DBMS", "Database Systems"],
    },
    {
      name: "Dr. C",
      email: "dr.c@university.edu",
      phone: "+91 98765 43212",
      office: "Room 303, CS Block",
      subjects: ["Software Engineering"],
    },
    {
      name: "Dr. E",
      email: "dr.e@university.edu",
      phone: "+91 98765 43214",
      office: "Room 305, CS Block",
      subjects: ["Computer Networks"],
    },
    {
      name: "Dr. F",
      email: "dr.f@university.edu",
      phone: "+91 98765 43215",
      office: "Room 306, CS Block",
      subjects: ["Theory of Computation"],
    },
    {
      name: "Dr. G",
      email: "dr.g@university.edu",
      phone: "+91 98765 43216",
      office: "Room 307, CS Block",
      subjects: ["AI & Machine Learning"],
    },
  ]

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Faculty</h2>
          <p className="text-muted-foreground">Contact information for your instructors</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {faculties.map((faculty) => (
            <Card key={faculty.name} className="border-border bg-card">
              <CardHeader>
                <CardTitle>{faculty.name}</CardTitle>
                <CardDescription>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {faculty.subjects.map((subject) => (
                      <Badge key={subject} variant="secondary" className="bg-chart-2/20 text-chart-2 border-chart-2">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${faculty.email}`} className="text-primary hover:underline">
                    {faculty.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{faculty.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{faculty.office}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </StudentLayout>
  )
}
