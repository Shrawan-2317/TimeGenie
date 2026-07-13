"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { TimetableSlot } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Beaker, Cloud, Coffee, Sparkles, BookOpen } from "lucide-react"

interface SlotCellProps {
  slot?: TimetableSlot
  editable?: boolean
  showTopBorder?: boolean
  showBottomBorder?: boolean
}

export function SlotCell({ 
  slot, 
  editable,
  showTopBorder = true,
  showBottomBorder = true
}: SlotCellProps) {
  
  if (!slot) {
    return (
      <div className="h-20 p-2 flex items-center justify-center text-xs text-muted-foreground">
        {editable && <span className="opacity-0 group-hover:opacity-100">+ Add</span>}
      </div>
    )
  }

  const getSlotColor = () => {
    if (slot.type === "online") {
      return "bg-pink-100 text-pink-900 border-2 border-dashed border-pink-500"
    }
    if (slot.type === "break" || slot.label === "Lunch Break") {
      return "bg-orange-100 text-orange-900 border-l-4 border-orange-500"
    }
    if (slot.type === "short_break" || slot.label === "Short Break") {
      return "bg-yellow-100 text-yellow-900 border-l-4 border-yellow-500"
    }
    if (slot.type === "special" || (slot.label && !slot.subject)) {
      return "bg-purple-100 text-purple-900 border-l-4 border-purple-500"
    }
    if (slot.subjectType === "lab" || slot.type === "lab") {
      return "bg-green-100 text-green-900 border-l-4 border-green-500"
    }
    if (slot.subjectType === "theory") {
      return "bg-blue-100 text-blue-900 border-l-4 border-blue-500"
    }
    if (!slot.subject && !slot.label) {
      return "bg-transparent"
    }
    return "bg-blue-100 text-blue-900 border-l-4 border-blue-500"
  }

  const getIcon = () => {
    if (slot.type === "break" || slot.label === "Lunch Break") {
      return <Coffee className="h-3 w-3" />
    }
    if (slot.type === "short_break" || slot.label === "Short Break") {
      return <Coffee className="h-3 w-3" />
    }
    if (slot.subjectType === "lab" || slot.type === "lab") {
      return <Beaker className="h-3 w-3" />
    }
    if (slot.type === "special" || (slot.label && !slot.subject)) {
      return <Sparkles className="h-3 w-3" />
    }
    if (slot.type === "online") {
      return <Cloud className="h-3 w-3" />
    }
    if (slot.subjectType === "theory") {
      return <BookOpen className="h-3 w-3" />
    }
    return null
  }

  const displayText = slot.label || slot.subject

  if (!displayText) {
    return (
      <div className="h-20 p-2 flex items-center justify-center text-xs text-muted-foreground">
        {editable && <span className="opacity-0 group-hover:opacity-100">+ Add</span>}
      </div>
    )
  }

  // ✅ KEY: Border styling for labs
  const getBorderStyle = () => {
    const isLab = slot.subjectType === "lab" || slot.type === "lab"
    
    if (!isLab) return ""
    
    let styles = ""
    if (!showTopBorder) styles += "border-t-0 "
    if (!showBottomBorder) styles += "border-b-0 "
    return styles
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "h-20 p-2 flex flex-col gap-1 transition-all border border-gray-200",
              getSlotColor(),
              getBorderStyle(),
              editable && "hover:opacity-80 cursor-pointer",
            )}
          >
            <div className="flex items-center gap-1">
              {getIcon()}
              <span className="text-xs font-semibold truncate">{displayText}</span>
              {slot.subjectType === "lab" && (
                <span className="ml-auto text-[10px] bg-green-600 text-white px-1.5 py-0.5 rounded-full font-medium">
                  Lab
                </span>
              )}
            </div>
            {slot.faculty && <span className="text-xs truncate opacity-90">{slot.faculty}</span>}
            {slot.room && <span className="text-xs truncate opacity-75">{slot.room}</span>}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-popover border-border">
          <div className="space-y-1">
            <p className="font-semibold">{displayText}</p>
            {slot.faculty && <p className="text-sm">Faculty: {slot.faculty}</p>}
            {slot.room && <p className="text-sm">Room: {slot.room}</p>}
            <p className="text-xs text-muted-foreground">
              {slot.day} • {slot.slot}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
