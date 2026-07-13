"use client"

import type { ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"
import { Calendar, Download, BookOpen, Users } from "lucide-react"

interface StudentLayoutProps {
  children: ReactNode
}

export function StudentLayout({ children }: StudentLayoutProps) {
  const studentNavItems = [
    { href: "/student", label: "My Timetable", icon: Calendar },
    { href: "/student/export", label: "Export", icon: Download },
    { href: "/student/subjects", label: "Subjects", icon: BookOpen },
    { href: "/student/faculty", label: "Faculty", icon: Users },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar items={studentNavItems} role="student" />
      <main className="flex-1 p-8 ml-64">{children}</main>
    </div>
  )
}
