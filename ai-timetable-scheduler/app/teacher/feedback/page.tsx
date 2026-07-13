"use client"

import { useState } from "react"
import { TeacherLayout } from "@/components/layouts/teacher-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { MessageSquare, Send, CheckCircle } from "lucide-react"

export default function FeedbackPage() {
  const [feedbackType, setFeedbackType] = useState<string>("general")
  const [feedbackText, setFeedbackText] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!feedbackText.trim()) {
      alert("Please enter your feedback")
      return
    }

    // In real app, this would send to backend
    console.log({ type: feedbackType, feedback: feedbackText })
    setSubmitted(true)

    setTimeout(() => {
      setSubmitted(false)
      setFeedbackText("")
      setFeedbackType("general")
    }, 3000)
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Submit Feedback</h2>
          <p className="text-muted-foreground">Share your thoughts and suggestions about the timetable</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Feedback Form</CardTitle>
                <CardDescription>Help us improve the timetable scheduling system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="feedback-type">Feedback Type</Label>
                  <Select value={feedbackType} onValueChange={setFeedbackType}>
                    <SelectTrigger id="feedback-type" className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Feedback</SelectItem>
                      <SelectItem value="schedule">Schedule Conflict</SelectItem>
                      <SelectItem value="room">Room Assignment</SelectItem>
                      <SelectItem value="workload">Workload Concern</SelectItem>
                      <SelectItem value="suggestion">Suggestion</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback-text">Your Feedback</Label>
                  <Textarea
                    id="feedback-text"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Please describe your feedback in detail..."
                    className="bg-background border-border min-h-[200px]"
                  />
                </div>

                {submitted ? (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-chart-1/10 text-chart-1">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Feedback submitted successfully!</span>
                  </div>
                ) : (
                  <Button onClick={handleSubmit} className="bg-primary text-primary-foreground gap-2">
                    <Send className="h-4 w-4" />
                    Submit Feedback
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base">Feedback Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-1">
                  <p className="font-medium">Be Specific</p>
                  <p className="text-muted-foreground text-xs">
                    Include details like day, time, room, or subject when reporting issues.
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Be Constructive</p>
                  <p className="text-muted-foreground text-xs">
                    Suggest improvements rather than just pointing out problems.
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Be Timely</p>
                  <p className="text-muted-foreground text-xs">
                    Submit feedback as soon as you notice an issue for faster resolution.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base">Recent Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <MessageSquare className="h-4 w-4 text-chart-2 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">Schedule Conflict</p>
                    <p className="text-xs text-muted-foreground">Submitted 2 days ago</p>
                    <p className="text-xs text-chart-1">Resolved</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MessageSquare className="h-4 w-4 text-chart-2 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">Room Assignment</p>
                    <p className="text-xs text-muted-foreground">Submitted 5 days ago</p>
                    <p className="text-xs text-chart-1">Resolved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TeacherLayout>
  )
}
