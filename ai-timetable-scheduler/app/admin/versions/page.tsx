"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TimetableGrid } from "@/components/timetable/timetable-grid"
import { History, Eye, Download, GitBranch, CheckCircle, Clock, Archive } from "lucide-react"
import type { TimetableVersion } from "@/lib/types"
import { generateSampleTimetable } from "@/lib/timetable-utils"

export default function VersionsPage() {
  const [versions] = useState<TimetableVersion[]>([
    {
      id: "1",
      version: "v1.2",
      created_at: "2025-01-16T10:30:00Z",
      created_by: "Admin",
      status: "active",
      changes: "Updated room assignments for TY1, resolved conflicts",
      slots: generateSampleTimetable("TY1"),
    },
    {
      id: "2",
      version: "v1.1",
      created_at: "2025-01-15T14:20:00Z",
      created_by: "Admin",
      status: "archived",
      changes: "Added lab sessions for DBMS",
      slots: generateSampleTimetable("TY1"),
    },
    {
      id: "3",
      version: "v1.0",
      created_at: "2025-01-14T09:00:00Z",
      created_by: "Admin",
      status: "archived",
      changes: "Initial timetable generation",
      slots: generateSampleTimetable("TY1"),
    },
  ])

  const [selectedVersion, setSelectedVersion] = useState<TimetableVersion | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const getStatusBadge = (status: TimetableVersion["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-chart-1/20 text-chart-1 border-chart-1">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-chart-2/20 text-chart-2 border-chart-2">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "draft":
        return (
          <Badge className="bg-chart-4/20 text-chart-4 border-chart-4">
            <GitBranch className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        )
      case "archived":
        return (
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            <Archive className="h-3 w-3 mr-1" />
            Archived
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Version History</h2>
            <p className="text-muted-foreground">Track and manage timetable versions</p>
          </div>
          <Button className="bg-primary text-primary-foreground gap-2">
            <GitBranch className="h-4 w-4" />
            Create New Version
          </Button>
        </div>

        {/* Version Timeline */}
        <div className="space-y-4">
          {versions.map((version, index) => (
            <Card key={version.id} className="border-border bg-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <History className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-xl">Version {version.version}</CardTitle>
                      {getStatusBadge(version.status)}
                    </div>
                    <CardDescription>
                      Created by {version.created_by} on {new Date(version.created_at).toLocaleString()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent"
                      onClick={() => {
                        setSelectedVersion(version)
                        setShowDetails(!showDetails || selectedVersion?.id !== version.id)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                      {showDetails && selectedVersion?.id === version.id ? "Hide" : "View"}
                    </Button>
                    {version.status === "active" && (
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Download className="h-4 w-4" />
                        Export
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <p className="text-sm text-muted-foreground">Changes:</p>
                    <p className="text-sm font-medium">{version.changes}</p>
                  </div>

                  {showDetails && selectedVersion?.id === version.id && (
                    <div className="pt-4 border-t border-border">
                      <TimetableGrid
                        classId={`version-${version.version}`}
                        slots={version.slots}
                        editable={false}
                        title={`Timetable - ${version.version}`}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Version Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Versions</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{versions.length}</div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <CheckCircle className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{versions.filter((v) => v.status === "active").length}</div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{versions.filter((v) => v.status === "pending").length}</div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Archived</CardTitle>
              <Archive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{versions.filter((v) => v.status === "archived").length}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
