"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { SlotCell } from "./slot-cell"
import { EditSlotModal } from "./edit-slot-modal"
import { DAYS, generateCanonicalSlots, type TimetableSlot } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"

interface TimetableGridProps {
  classId: string
  slots: TimetableSlot[]
  editable?: boolean
  onSlotUpdate?: (slot: TimetableSlot) => void
  title?: string
}

export function TimetableGrid({ classId, slots, editable = false, onSlotUpdate, title }: TimetableGridProps) {
  const [selectedSlot, setSelectedSlot] = useState<TimetableSlot | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  
  // ✅ Get constraints from store to generate dynamic slots
  const { inputData } = useAppStore()
  
  // ✅ Generate canonical slots based on user's lunch and short breaks
  const timeSlots = useMemo(() => {
    const lunchBreak = inputData?.constraints?.lunch_break || '12:40-01:40'
    const shortBreaks = inputData?.constraints?.short_breaks || ['10:35-10:50', '03:30-03:40']  // ✅ BOTH breaks as default
    
    console.log('🔧 TimetableGrid using breaks:', { lunchBreak, shortBreaks })
    
    return generateCanonicalSlots(lunchBreak, shortBreaks)
  }, [inputData?.constraints?.lunch_break, inputData?.constraints?.short_breaks])

  const getSlotData = (day: string, timeSlot: string): TimetableSlot | undefined => {
    return slots.find((s) => s.day === day && s.slot === timeSlot)
  }

  const handleSlotClick = (day: string, timeSlot: string) => {
    if (!editable) return

    const existingSlot = getSlotData(day, timeSlot)
    setSelectedSlot(
      existingSlot || {
        day,
        slot: timeSlot,
      },
    )
    setEditModalOpen(true)
  }

  const handleSlotSave = (updatedSlot: TimetableSlot) => {
    if (onSlotUpdate) {
      onSlotUpdate(updatedSlot)
    }
    setEditModalOpen(false)
    setSelectedSlot(null)
  }

  return (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}

      <Card className="border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header Row */}
            <div className="grid grid-cols-[100px_repeat(6,1fr)] border-b border-border bg-muted/50">
              <div className="p-3 font-medium text-sm">Time</div>
              {DAYS.map((day) => (
                <div key={day} className="p-3 font-medium text-sm text-center border-l border-border">
                  {day}
                </div>
              ))}
            </div>

            {/* ✅ Time Slots - now uses dynamic timeSlots */}
            {timeSlots.map((timeSlot, index) => (
              <div
                key={timeSlot}
                className={cn(
                  "grid grid-cols-[100px_repeat(6,1fr)] border-b border-border",
                  index % 2 === 0 ? "bg-card" : "bg-muted/20",
                )}
              >
                <div className="p-3 text-sm font-mono text-muted-foreground flex items-center">{timeSlot}</div>
                {DAYS.map((day) => {
                  const slotData = getSlotData(day, timeSlot)
                  
                  // ✅ Check if this is part of a lab session
                  const isLab = slotData?.subjectType === "lab" || slotData?.type === "lab"
                  
                  // Get previous and next slots for same day
                  const currentSlotIndex = timeSlots.indexOf(timeSlot)
                  const prevTimeSlot = currentSlotIndex > 0 ? timeSlots[currentSlotIndex - 1] : null
                  const nextTimeSlot = currentSlotIndex < timeSlots.length - 1 ? timeSlots[currentSlotIndex + 1] : null
                  
                  const prevSlot = prevTimeSlot ? getSlotData(day, prevTimeSlot) : null
                  const nextSlot = nextTimeSlot ? getSlotData(day, nextTimeSlot) : null
                  
                  // Check if this is first or last of lab
                  const isSameLabAsNext = nextSlot && nextSlot.subject === slotData?.subject && (nextSlot.subjectType === "lab" || nextSlot.type === "lab")
                  const isSameLabAsPrev = prevSlot && prevSlot.subject === slotData?.subject && (prevSlot.subjectType === "lab" || prevSlot.type === "lab")
                  
                  const isFirstOfLab = isLab && !isSameLabAsPrev
                  const isLastOfLab = isLab && !isSameLabAsNext
                  
                  return (
                    <div
                      key={`${day}-${timeSlot}`}
                      className="border-l border-border"
                      onClick={() => handleSlotClick(day, timeSlot)}
                    >
                      <SlotCell 
                        slot={slotData} 
                        editable={editable}
                        showTopBorder={isFirstOfLab || !isLab}
                        showBottomBorder={isLastOfLab || !isLab}
                      />

                    </div>
                  )
                })}
              </div>
            ))}

          </div>
        </div>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-100 border-l-4 border-blue-500" />
          <span className="text-muted-foreground">Theory Class</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100 border-l-4 border-green-500" />
          <span className="text-muted-foreground">Lab Session</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-purple-100 border-l-4 border-purple-500" />
          <span className="text-muted-foreground">Special Activity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-100 border-l-4 border-orange-500" />
          <span className="text-muted-foreground">Lunch Break</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-100 border-l-4 border-yellow-500" />
          <span className="text-muted-foreground">Short Break</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-dashed border-muted" />
          <span className="text-muted-foreground">Free Period</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-pink-100 border-2 border-dashed border-pink-500" />
          <span className="text-muted-foreground">Online Class</span>
        </div>
      </div>

      {/* Edit Modal */}
      {selectedSlot && (
        <EditSlotModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          slot={selectedSlot}
          onSave={handleSlotSave}
        />
      )}
    </div>
  )
}
