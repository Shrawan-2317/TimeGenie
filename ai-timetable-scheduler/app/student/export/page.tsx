"use client"

import { useState } from "react"
import { StudentLayout } from "@/components/layouts/student-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, ImageIcon, Calendar, Printer } from "lucide-react"
import { TimetableGrid } from "@/components/timetable/timetable-grid"
import type { TimetableSlot } from "@/lib/types"
import { generateSampleTimetable, exportTimetableToText } from "@/lib/timetable-utils"

export default function ExportPage() {
  const studentClass = "TY1"
  const [timetableSlots] = useState<TimetableSlot[]>(generateSampleTimetable(studentClass))
  const [exporting, setExporting] = useState(false)

  const handleExportText = () => {
    const textContent = exportTimetableToText(timetableSlots, studentClass)
    const blob = new Blob([textContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `timetable-${studentClass}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportPDF = async () => {
    setExporting(true)
    // Simulate export delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    alert("PDF export would be implemented with a library like jsPDF or react-pdf")
    setExporting(false)
  }

  const handleExportImage = async () => {
    setExporting(true)
    // Simulate export delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    alert("Image export would be implemented with html2canvas")
    setExporting(false)
  }

  const handleExportICal = () => {
    alert("iCal export would generate an .ics file for calendar apps")
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Export Timetable</h2>
          <p className="text-muted-foreground">Download your timetable in various formats</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Your timetable as it will be exported</CardDescription>
              </CardHeader>
              <CardContent>
                <TimetableGrid classId={studentClass} slots={timetableSlots} editable={false} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
                <CardDescription>Choose your preferred format</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={handleExportPDF}
                  disabled={exporting}
                  className="w-full justify-start gap-2 bg-primary text-primary-foreground"
                >
                  <Download className="h-4 w-4" />
                  {exporting ? "Exporting..." : "Export as PDF"}
                </Button>

                <Button
                  onClick={handleExportImage}
                  disabled={exporting}
                  variant="outline"
                  className="w-full justify-start gap-2 bg-transparent"
                >
                  <ImageIcon className="h-4 w-4" />
                  Export as Image
                </Button>

                <Button
                  onClick={handleExportText}
                  variant="outline"
                  className="w-full justify-start gap-2 bg-transparent"
                >
                  <FileText className="h-4 w-4" />
                  Export as Text
                </Button>

                <Button
                  onClick={handleExportICal}
                  variant="outline"
                  className="w-full justify-start gap-2 bg-transparent"
                >
                  <Calendar className="h-4 w-4" />
                  Export to Calendar
                </Button>

                <Button onClick={handlePrint} variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <Printer className="h-4 w-4" />
                  Print Timetable
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base">Export Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-1">
                  <p className="font-medium">PDF Format</p>
                  <p className="text-muted-foreground text-xs">Best for printing and sharing via email</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Image Format</p>
                  <p className="text-muted-foreground text-xs">Perfect for social media or quick sharing</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Calendar Format</p>
                  <p className="text-muted-foreground text-xs">Import directly into Google Calendar or Outlook</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StudentLayout>
  )
}
