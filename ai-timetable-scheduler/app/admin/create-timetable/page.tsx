"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileJson, FormInput } from "lucide-react"
import Link from "next/link"

export default function CreateTimetablePage() {
  const [mode, setMode] = useState<"guided" | "json">("guided")

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Create Timetable</h2>
            <p className="text-muted-foreground">Choose your preferred input method</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card
            className={`border-2 cursor-pointer transition-colors ${
              mode === "guided" ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
            }`}
            onClick={() => setMode("guided")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FormInput className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Guided Form</CardTitle>
                  <CardDescription>Step-by-step form input</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Easy-to-use forms for entering classes, subjects, faculty, and rooms. Recommended for beginners.
              </p>
            </CardContent>
          </Card>

          <Card
            className={`border-2 cursor-pointer transition-colors ${
              mode === "json" ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
            }`}
            onClick={() => setMode("json")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileJson className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>JSON Input</CardTitle>
                  <CardDescription>Direct JSON configuration</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Paste or upload JSON configuration directly. Recommended for advanced users or bulk imports.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Link href={mode === "guided" ? "/admin/input-form" : "/admin/json-input"}>
            <Button size="lg" className="bg-primary text-primary-foreground">
              Continue with {mode === "guided" ? "Guided Form" : "JSON Input"}
            </Button>
          </Link>
        </div>
      </div>
    </AdminLayout>
  )
}
