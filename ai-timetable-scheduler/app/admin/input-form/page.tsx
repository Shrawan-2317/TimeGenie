"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/lib/store"
import { Save, CheckCircle } from "lucide-react"
import { ClassesForm } from "@/components/forms/classes-form"
import { SubjectsForm } from "@/components/forms/subjects-form"
import { FacultiesForm } from "@/components/forms/faculties-form"
import { RoomsForm } from "@/components/forms/rooms-form"
import { ConstraintsForm } from "@/components/forms/constraints-form"
import { useRouter } from "next/navigation"
import type { InputData } from "@/lib/types"

export default function InputFormPage() {
  const router = useRouter()
  const { setInputData } = useAppStore()
  const [activeTab, setActiveTab] = useState("classes")
  const [saved, setSaved] = useState(false)

  const [formData, setFormData] = useState<InputData>({
    classes: {},
    subjects: {},
    faculties: {},
    rooms: {},
    constraints: {
      online_days: {},
      special_slots: {},
      max_hours_per_day: 7,
      max_consecutive_theory: 3,
      lunch_break: "12:40-01:40",
      short_breaks: ["10:35-10:50"],
    },
  })

  const handleSave = async () => {
    try {
      // 1️⃣ Save to Zustand (in-memory)
      setInputData(formData)
  
      // 2️⃣ Save to JSON file via API
      const saveRes = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
  
      const saveResult = await saveRes.json()
      if (!saveResult.success) {
        alert("Error saving data: " + saveResult.message)
        return
      }
  
      // ✅ 3️⃣ Trigger genetic_scheduler.py via backend API
      await fetch("/api/run-genetic", {
        method: "POST",
      })
  
      setSaved(true)
  
      // 4️⃣ Redirect to generate page
      setTimeout(() => {
        router.push("/admin/generate")
      }, 500)
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred while saving or running scheduler.")
    }
  }
  

  const isComplete =
    Object.keys(formData.classes).length > 0 &&
    Object.keys(formData.subjects).length > 0 &&
    Object.keys(formData.faculties).length > 0 &&
    Object.keys(formData.rooms).length > 0

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Input Form</h2>
            <p className="text-muted-foreground">Enter your timetable data step by step</p>
          </div>
          <Button
            onClick={handleSave}
            disabled={!isComplete || saved}
            className="bg-primary text-primary-foreground gap-2"
          >
            {saved ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save & Continue
              </>
            )}
          </Button>
        </div>

        {!isComplete && (
          <Card className="border-yellow-500/50 bg-yellow-500/5">
            <CardContent className="pt-6">
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                Please complete all sections (Classes, Subjects, Faculties, and Rooms) before saving.
              </p>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-muted">
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="faculties">Faculties</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="constraints">Constraints</TabsTrigger>
          </TabsList>

          <TabsContent value="classes" className="space-y-4">
            <ClassesForm data={formData} setData={setFormData} />
          </TabsContent>

          <TabsContent value="subjects" className="space-y-4">
            <SubjectsForm data={formData} setData={setFormData} />
          </TabsContent>

          <TabsContent value="faculties" className="space-y-4">
            <FacultiesForm data={formData} setData={setFormData} />
          </TabsContent>

          <TabsContent value="rooms" className="space-y-4">
            <RoomsForm data={formData} setData={setFormData} />
          </TabsContent>

          <TabsContent value="constraints" className="space-y-4">
            <ConstraintsForm data={formData} setData={setFormData} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
