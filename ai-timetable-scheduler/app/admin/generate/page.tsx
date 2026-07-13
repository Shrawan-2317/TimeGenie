"use client"

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TimetableGrid } from "@/components/timetable/timetable-grid"
import { useAppStore } from "@/lib/store"
import { Sparkles, RefreshCw, Save, Download } from "lucide-react"
import type { TimetableSlot } from "@/lib/types"
import { generateTimetablePDF, generateAllClassesPDF } from "@/lib/pdf-generator"

export default function GeneratePage() {
  const { inputData, setInputData, draftVersion, setDraftVersion } = useAppStore()
  const [selectedClass, setSelectedClass] = useState<string>("TY1")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>([])
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/classes")
      .then((res) => res.json())
      .then((data) => {
        if (data.classes && data.classes.length > 0) {
          setAvailableClasses(data.classes);
          setSelectedClass(data.classes[0]);
        }
      })
      .catch((err) => console.error("Failed to load classes:", err));
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
  
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ className: selectedClass }),
      });
  
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to fetch timetable");
        return;
      }
  
      const { timetable, constraints } = await res.json();
      
      console.log('📥 Loaded timetable length:', timetable?.length);
      
      setTimetableSlots(timetable);
  
      if (constraints) {
        const currentData = useAppStore.getState().inputData;
        
        if (currentData) {
          setInputData({
            ...currentData,
            constraints: constraints
          });
        } else {
          setInputData({
            classes: {},
            subjects: {},
            faculties: {},
            rooms: {},
            constraints: constraints
          });
        }
      }
  
      setDraftVersion({
        version: `v1.0-${selectedClass}-${Date.now()}`,
        status: "draft",
        created_at: new Date().toISOString(),
        class_timelines: { [selectedClass]: timetable },
        metrics: { conflicts: 0, soft_score: 100 },
      });
    } catch (err: unknown) {
      console.error("Error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch timetable";
      alert(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSlotUpdate = (updatedSlot: TimetableSlot) => {
    console.log('✏️ SLOT UPDATE CALLED');
    console.log('📝 Updated slot:', updatedSlot);
    console.log('📝 Before update - slot count:', timetableSlots.length);
    
    const newSlots = timetableSlots.map((slot) => {
      if (slot.day === updatedSlot.day && slot.slot === updatedSlot.slot) {
        return {
          day: updatedSlot.day,
          slot: updatedSlot.slot,
          subject: updatedSlot.subject || null,
          faculty: updatedSlot.faculty || null,
          room: updatedSlot.room || null,
          label: updatedSlot.label || null,
          type: updatedSlot.type || (updatedSlot.subject ? 'regular' : 'empty'),
          subjectType: updatedSlot.subjectType || null
        }
      }
      return slot
    })
    
    console.log('📝 After update - slot count:', newSlots.length);
    console.log('📝 First 3 slots:', newSlots.slice(0, 3));

    setTimetableSlots(newSlots)

    if (draftVersion) {
      setDraftVersion({
        ...draftVersion,
        class_timelines: {
          ...draftVersion.class_timelines,
          [selectedClass]: newSlots,
        },
      })
    }
  }

  const handleSaveDraft = async () => {
    console.log('🔵 SAVE DRAFT CLICKED');
    console.log('📊 Current timetableSlots:', timetableSlots);
    console.log('📝 Slot count:', timetableSlots.length);
    console.log('📝 First slot:', timetableSlots[0]);
    console.log('📝 Last slot:', timetableSlots[timetableSlots.length - 1]);
    
    setIsSaving(true);
    
    try {
      const requestBody = {
        className: selectedClass,
        timetable: timetableSlots
      };
      
      console.log('📡 Sending request body:', requestBody);

      const res = await fetch("/api/timetable/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      console.log('📊 Response status:', res.status);

      if (!res.ok) {
        const err = await res.json();
        console.error('❌ API Error response:', err);
        alert(err.error || "Failed to save timetable");
        return;
      }

      const data = await res.json();
      console.log('✅ API Success response:', data);
      alert(`✅ ${data.message}`);
      
      if (draftVersion) {
        setDraftVersion({
          ...draftVersion,
          status: "draft"
        });
      }
    } catch (err: unknown) {
      console.error("❌ Error saving timetable:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to save timetable";
      alert(`❌ ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ NEW: Download single class PDF
  const handleDownloadSinglePDF = () => {
    setIsDownloading(true);
    try {
      generateTimetablePDF(selectedClass, timetableSlots);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  // ✅ NEW: Download all classes PDF
  const handleDownloadAllPDF = async () => {
    setIsDownloading(true);
    try {
      // Fetch all classes timetables
      const allTimetables: Record<string, TimetableSlot[]> = {};
      
      for (const classId of availableClasses) {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ className: classId }),
        });
        
        if (res.ok) {
          const data = await res.json();
          allTimetables[classId] = data.timetable;
        }
      }
      
      await generateAllClassesPDF(allTimetables);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Generate Timetable</h2>
          <p className="text-muted-foreground">Create and edit AI-generated timetables</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Conflicts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-1">{draftVersion?.metrics?.conflicts ?? 0}</div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Soft Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-2">{draftVersion?.metrics?.soft_score ?? 0}</div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium capitalize">{draftVersion?.status ?? "Not Generated"}</div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Version</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-mono">{draftVersion?.version ?? "N/A"}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Generation Controls</CardTitle>
            <CardDescription>Select a class and generate an optimized timetable</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-end flex-wrap">
              <div className="flex-1 space-y-2 min-w-[200px]">
                <label className="text-sm font-medium">Select Class</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableClasses.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-primary text-primary-foreground gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>

              {timetableSlots.length > 0 && (
                <>
                  <Button 
                    onClick={handleSaveDraft} 
                    variant="outline" 
                    className="gap-2"
                    disabled={isSaving}
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? "Saving..." : "Save Draft"}
                  </Button>

                  {/* ✅ NEW: Download buttons */}
                  <Button 
                    onClick={handleDownloadSinglePDF} 
                    variant="outline" 
                    className="gap-2"
                    disabled={isDownloading}
                  >
                    <Download className="h-4 w-4" />
                    PDF (Single)
                  </Button>

                  <Button 
                    onClick={handleDownloadAllPDF} 
                    variant="outline" 
                    className="gap-2"
                    disabled={isDownloading}
                  >
                    <Download className="h-4 w-4" />
                    PDF (All)
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {timetableSlots.length > 0 && (
          <TimetableGrid
            classId={selectedClass}
            slots={timetableSlots}
            editable={true}
            onSlotUpdate={handleSlotUpdate}
            title={`Timetable for ${selectedClass}`}
          />
        )}

        {timetableSlots.length === 0 && (
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Timetable Generated</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Select a class and click Generate to create an AI-optimized timetable. You can edit individual slots
                after generation.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
