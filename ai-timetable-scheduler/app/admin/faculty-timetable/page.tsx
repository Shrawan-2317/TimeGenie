"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TimetableGrid } from "@/components/timetable/timetable-grid"
import { Download, RefreshCw } from "lucide-react"
import type { TimetableSlot } from "@/lib/types"
import { generateTimetablePDF } from "@/lib/pdf-generator"

interface FacultySlot extends TimetableSlot {
  classId?: string
}

export default function FacultyTimetablePage() {
  const [facultySchedules, setFacultySchedules] = useState<Record<string, FacultySlot[]>>({})
  const [selectedFaculty, setSelectedFaculty] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  // Fetch faculty schedules
  useEffect(() => {
    fetchFacultySchedules()
  }, [])

  const fetchFacultySchedules = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/faculty")
      if (res.ok) {
        const data = await res.json()
        setFacultySchedules(data.facultySchedules)
        
        // Set first faculty as default
        const faculties = Object.keys(data.facultySchedules)
        if (faculties.length > 0) {
          setSelectedFaculty(faculties[0])
        }

        console.log(`📚 Loaded ${faculties.length} faculty schedules`)
      }
    } catch (err) {
      console.error("Error fetching faculty schedules:", err)
      alert("Failed to load faculty schedules")
    } finally {
      setIsLoading(false)
    }
  }

  // Download faculty PDF
  const handleDownloadPDF = () => {
    if (!selectedFaculty) return
    
    setIsDownloading(true)
    try {
      // Convert faculty slots to proper format for PDF
      const slots = facultySchedules[selectedFaculty]
      generateTimetablePDF(selectedFaculty, slots as TimetableSlot[])
    } catch (err) {
      console.error("Error generating PDF:", err)
      alert("Failed to generate PDF")
    } finally {
      setIsDownloading(false)
    }
  }

  const faculties = Object.keys(facultySchedules).sort()
  const currentSlots = selectedFaculty ? facultySchedules[selectedFaculty] : []

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Faculty Timetables</h2>
          <p className="text-muted-foreground">View and manage individual faculty schedules</p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Total Faculty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{faculties.length}</div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Total Classes Assigned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {selectedFaculty ? currentSlots.filter(s => s.subject).length : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Faculty Selection */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Faculty Selection</CardTitle>
            <CardDescription>Select a faculty member to view their timetable</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-end flex-wrap">
              <div className="flex-1 space-y-2 min-w-[200px]">
                <label className="text-sm font-medium">Select Faculty</label>
                <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {faculties.map((faculty) => (
                      <SelectItem key={faculty} value={faculty}>
                        {faculty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={fetchFacultySchedules}
                disabled={isLoading}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>

              {selectedFaculty && (
                <Button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  variant="outline"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Faculty Details */}
        {selectedFaculty && currentSlots.length > 0 && (
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Faculty Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Faculty Name</h3>
                  <p className="text-lg font-semibold">{selectedFaculty}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Total Classes</h3>
                  <p className="text-lg font-semibold">
                    {currentSlots.filter(s => s.subject).length}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Teaching Days</h3>
                  <p className="text-lg font-semibold">
                    {[...new Set(currentSlots.filter(s => s.subject).map(s => s.day))].length}
                  </p>
                </div>
              </div>

              {/* Subjects List */}
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Subjects Teaching</h3>
                <div className="grid gap-2 md:grid-cols-2">
                  {[...new Set(currentSlots.filter(s => s.subject).map(s => s.subject))].map((subject) => (
                    <div key={subject} className="flex items-center gap-2 px-3 py-2 bg-muted rounded">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="text-sm">{subject}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Classes Teaching */}
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Classes Teaching</h3>
                <div className="grid gap-2 md:grid-cols-2">
                  {[...new Set(currentSlots.filter(s => s.subject).map((s: any) => s.classId))].map((classId) => (
                    <div key={classId} className="flex items-center gap-2 px-3 py-2 bg-muted rounded">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-sm">{classId}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timetable Grid */}
        {selectedFaculty && currentSlots.length > 0 && (
          <TimetableGrid
            classId={selectedFaculty}
            slots={currentSlots as TimetableSlot[]}
            editable={false}
            title={`Timetable for ${selectedFaculty}`}
          />
        )}

        {faculties.length === 0 && (
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h3 className="text-lg font-semibold mb-2">No Faculty Found</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Generate class timetables first to see faculty schedules
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
