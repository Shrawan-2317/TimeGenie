"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { useStore } from "@/lib/store"

interface Conflict {
  type: "faculty" | "room" | "workload"
  severity: "high" | "medium" | "low"
  message: string
  slots: string[]
}

export default function ConflictsPage() {
  const [conflicts, setConflicts] = useState<Conflict[]>([])
  const [loading, setLoading] = useState(true)
  const currentTimetable = useStore((state) => state.currentTimetable)

  useEffect(() => {
    if (currentTimetable) {
      checkConflicts()
    }
  }, [currentTimetable])

  const checkConflicts = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/mock/conflicts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slots: currentTimetable?.slots || [] }),
      })
      const data = await response.json()
      setConflicts(data.conflicts)
    } catch (error) {
      console.error("Failed to check conflicts:", error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "faculty":
        return <XCircle className="h-5 w-5" />
      case "room":
        return <AlertTriangle className="h-5 w-5" />
      case "workload":
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <AlertTriangle className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Conflict Detection</h1>
        <p className="text-muted-foreground">Identify and resolve scheduling conflicts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conflict Summary</CardTitle>
          <CardDescription>
            {loading ? "Checking for conflicts..." : `Found ${conflicts.length} conflicts`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!loading && conflicts.length === 0 ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>No conflicts detected. Timetable is valid!</span>
            </div>
          ) : (
            <div className="space-y-4">
              {conflicts.map((conflict, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="text-destructive">{getTypeIcon(conflict.type)}</div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={getSeverityColor(conflict.severity)}>{conflict.severity}</Badge>
                          <Badge variant="outline">{conflict.type}</Badge>
                        </div>
                        <p className="text-sm">{conflict.message}</p>
                        <p className="text-xs text-muted-foreground">Affected slots: {conflict.slots.length}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Resolve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={checkConflicts} disabled={loading}>
          Re-check Conflicts
        </Button>
        <Button variant="outline">Auto-resolve</Button>
      </div>
    </div>
  )
}
