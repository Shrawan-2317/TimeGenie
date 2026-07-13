"use client"

import type { ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"
import { Calendar, MessageSquare, Bell, User } from "lucide-react"

interface TeacherLayoutProps {
  children: ReactNode
}

export function TeacherLayout({ children }: TeacherLayoutProps) {
  const teacherNavItems = [
    { href: "/teacher", label: "My Timetable", icon: Calendar },
    { href: "/teacher/approvals", label: "Pending Approvals", icon: Bell },
    { href: "/teacher/feedback", label: "Submit Feedback", icon: MessageSquare },
    { href: "/teacher/profile", label: "Profile", icon: User },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar items={teacherNavItems} role="teacher" />
      <main className="flex-1 p-8 ml-64">{children}</main>
    </div>
  )
}
