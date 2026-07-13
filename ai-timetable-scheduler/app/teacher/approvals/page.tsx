"use client"

import { useState } from "react"
import { TeacherLayout } from "@/components/layouts/teacher-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { TimetableGrid } from "@/components/timetable/timetable-grid"
import { CheckCircle, XCircle, Eye, Clock, AlertCircle } from "lucide-react"
import type { TimetableSlot } from "@/lib/types"
import { generateSampleTimetable } from "@/lib/timetable-utils"

interface PendingApproval {
  id: string
  version: string
  created_at: string
  deadline: string
  status: "pending" | "approved" | "rejected"
  slots: TimetableSlot[]
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<PendingApproval[]>([
    {
      id: "1",
      version: "v1.1-draft",
      created_at: "2025-01-16T09:15:00Z",
      deadline: "2025-01-20T23:59:59Z",
      status: "pending",
      slots: generateSampleTimetable("TY1").filter((s) => s.faculty === "Dr. A"),
    },
  ])

  const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null)
  const [feedback, setFeedback] = useState("")
  const [showDetails, setShowDetails] = useState(false)

  const handleApprove = (id: string) => {
    setApprovals(approvals.map((a) => (a.id === id ? { ...a, status: "approved" as const } : a)))
    setShowDetails(false)
    setFeedback("")
  }

  const handleReject = (id: string) => {
    if (!feedback.trim()) {
      alert("Please provide feedback for rejection")
      return
    }
    setApprovals(approvals.map((a) => (a.id === id ? { ...a, status: "rejected" as const } : a)))
    setShowDetails(false)
    setFeedback("")
  }

  const getStatusBadge = (status: PendingApproval["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-chart-1/20 text-chart-1 border-chart-1">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-destructive/20 text-destructive border-destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-chart-2/20 text-chart-2 border-chart-2">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
    }
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pending Approvals</h2>
          <p className="text-muted-foreground">Review and approve proposed timetables</p>
        </div>

        {approvals.length === 0 ? (
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Pending Approvals</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                You have no timetables waiting for your approval at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {approvals.map((approval) => {
              const daysLeft = getDaysUntilDeadline(approval.deadline)
              return (
                <Card key={approval.id} className="border-border bg-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-xl">Timetable {approval.version}</CardTitle>
                          {getStatusBadge(approval.status)}
                        </div>
                        <CardDescription>
                          Created on {new Date(approval.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      {approval.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-transparent"
                          onClick={() => {
                            setSelectedApproval(approval)
                            setShowDetails(!showDetails || selectedApproval?.id !== approval.id)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          {showDetails && selectedApproval?.id === approval.id ? "Hide" : "Review"}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Deadline: {new Date(approval.deadline).toLocaleDateString()}
                          </span>
                        </div>
                        {approval.status === "pending" && daysLeft <= 3 && (
                          <div className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            <span className="font-medium">{daysLeft} days left</span>
                          </div>
                        )}
                      </div>

                      {showDetails && selectedApproval?.id === approval.id && approval.status === "pending" && (
                        <div className="space-y-4 pt-4 border-t border-border">
                          <TimetableGrid
                            classId="approval-view"
                            slots={approval.slots}
                            editable={false}
                            title="Your Assigned Slots"
                          />

                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Feedback (Optional for approval, required for rejection)
                            </label>
                            <Textarea
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                              placeholder="Provide your feedback or concerns about this timetable..."
                              className="bg-background border-border min-h-[100px]"
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleApprove(approval.id)}
                              className="bg-chart-1 text-white hover:bg-chart-1/90 gap-2"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Approve Timetable
                            </Button>
                            <Button onClick={() => handleReject(approval.id)} variant="destructive" className="gap-2">
                              <XCircle className="h-4 w-4" />
                              Reject Timetable
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </TeacherLayout>
  )
}
