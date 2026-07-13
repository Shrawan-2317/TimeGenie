"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAppStore } from "@/lib/store"
import { Upload, CheckCircle, AlertCircle } from "lucide-react"
import type { InputData } from "@/lib/types"
import { useRouter } from "next/navigation"

export default function JsonInputPage() {
  const router = useRouter()
  const [jsonInput, setJsonInput] = useState("")
  const [validationStatus, setValidationStatus] = useState<"idle" | "success" | "error">("idle")
  const [validationMessage, setValidationMessage] = useState("")
  const { setInputData } = useAppStore()

  useEffect(() => {
    fetch("/api/mock/input")
      .then((res) => res.json())
      .then((data) => {
        setJsonInput(JSON.stringify(data.input, null, 2))
      })
  }, [])

  const handleValidate = () => {
    try {
      const parsed = JSON.parse(jsonInput) as InputData

      // Basic validation
      if (!parsed.classes || !parsed.subjects || !parsed.faculties || !parsed.rooms || !parsed.constraints) {
        throw new Error("Missing required fields: classes, subjects, faculties, rooms, or constraints")
      }

      setInputData(parsed)
      setValidationStatus("success")
      setValidationMessage("Input data validated successfully! Redirecting to generation page...")

      setTimeout(() => {
        router.push("/admin/generate")
      }, 1500)
    } catch (error) {
      setValidationStatus("error")
      setValidationMessage(error instanceof Error ? error.message : "Invalid JSON format")
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">JSON Input</h2>
          <p className="text-muted-foreground">Upload or paste your input data to begin</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Input Data</CardTitle>
              <CardDescription>Paste your JSON configuration or use the sample data provided</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste your JSON input here..."
                className="font-mono text-xs h-[500px] bg-background border-border"
              />

              <div className="flex gap-2">
                <Button onClick={handleValidate} className="bg-primary text-primary-foreground gap-2">
                  <Upload className="h-4 w-4" />
                  Validate & Load
                </Button>
              </div>

              {validationStatus === "success" && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-chart-1/10 text-chart-1 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>{validationMessage}</span>
                </div>
              )}

              {validationStatus === "error" && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{validationMessage}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Data Structure</CardTitle>
              <CardDescription>Required fields in your input JSON</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold mb-1">classes</h4>
                  <p className="text-muted-foreground">
                    Object containing class definitions with name, subjects, class_teacher, and strength
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">subjects</h4>
                  <p className="text-muted-foreground">
                    Object containing subject definitions with name, code, type, hours_per_week, and faculties
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">faculties</h4>
                  <p className="text-muted-foreground">
                    Object containing faculty definitions with name, subjects, max_hours_per_day, and unavailable_slots
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">rooms</h4>
                  <p className="text-muted-foreground">
                    Object containing room definitions with type, capacity, and facilities
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">constraints</h4>
                  <p className="text-muted-foreground">
                    Object containing scheduling constraints like online_days, special_slots, max_hours_per_day, etc.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="font-semibold mb-2 text-sm">Sample Data Loaded</h4>
                <p className="text-xs text-muted-foreground">
                  The editor is pre-filled with sample data for Third Year sections (TY1, TY2) with subjects like DBMS,
                  SE, CN, TOC, and AIML.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
