import type { TimetableSlot } from "./types"

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  type: "conflict" | "constraint" | "missing"
  severity: "high" | "medium" | "low"
  message: string
  slotIds: string[]
}

export interface ValidationWarning {
  type: "workload" | "preference" | "optimization"
  message: string
  slotIds: string[]
}

export function validateTimetable(slots: TimetableSlot[]): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []

  // Check for faculty conflicts
  const facultyTimeMap = new Map<string, TimetableSlot>()

  for (const slot of slots) {
    if (!slot.facultyId || slot.type === "lunch") continue

    const key = `${slot.facultyId}-${slot.day}-${slot.startTime}`

    if (facultyTimeMap.has(key)) {
      const conflictingSlot = facultyTimeMap.get(key)!
      errors.push({
        type: "conflict",
        severity: "high",
        message: `Faculty ${slot.facultyName} has overlapping classes on ${slot.day} at ${slot.startTime}`,
        slotIds: [slot.id, conflictingSlot.id],
      })
    } else {
      facultyTimeMap.set(key, slot)
    }
  }

  // Check for room conflicts
  const roomTimeMap = new Map<string, TimetableSlot>()

  for (const slot of slots) {
    if (!slot.roomNumber || slot.type === "lunch") continue

    const key = `${slot.roomNumber}-${slot.day}-${slot.startTime}`

    if (roomTimeMap.has(key)) {
      const conflictingSlot = roomTimeMap.get(key)!
      errors.push({
        type: "conflict",
        severity: "high",
        message: `Room ${slot.roomNumber} is double-booked on ${slot.day} at ${slot.startTime}`,
        slotIds: [slot.id, conflictingSlot.id],
      })
    } else {
      roomTimeMap.set(key, slot)
    }
  }

  // Check for workload distribution
  const facultyDayLoad = new Map<string, number>()

  for (const slot of slots) {
    if (!slot.facultyId || slot.type === "lunch") continue

    const key = `${slot.facultyId}-${slot.day}`
    facultyDayLoad.set(key, (facultyDayLoad.get(key) || 0) + 1)
  }

  for (const [key, count] of facultyDayLoad) {
    if (count > 6) {
      const [facultyId, day] = key.split("-")
      const facultySlots = slots.filter((s) => s.facultyId === facultyId && s.day === day)

      warnings.push({
        type: "workload",
        message: `Faculty has ${count} classes on ${day}, which may be excessive`,
        slotIds: facultySlots.map((s) => s.id),
      })
    }
  }

  // Check for missing required fields
  for (const slot of slots) {
    if (slot.type !== "lunch" && !slot.facultyId) {
      errors.push({
        type: "missing",
        severity: "high",
        message: `Slot on ${slot.day} at ${slot.startTime} is missing faculty assignment`,
        slotIds: [slot.id],
      })
    }

    if (slot.type !== "lunch" && !slot.roomNumber) {
      errors.push({
        type: "missing",
        severity: "medium",
        message: `Slot on ${slot.day} at ${slot.startTime} is missing room assignment`,
        slotIds: [slot.id],
      })
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

export function checkSlotConflict(newSlot: Partial<TimetableSlot>, existingSlots: TimetableSlot[]): string | null {
  // Check if faculty is available
  if (newSlot.facultyId) {
    const facultyConflict = existingSlots.find(
      (slot) =>
        slot.facultyId === newSlot.facultyId &&
        slot.day === newSlot.day &&
        slot.startTime === newSlot.startTime &&
        slot.id !== newSlot.id,
    )

    if (facultyConflict) {
      return `Faculty is already teaching ${facultyConflict.subjectName} at this time`
    }
  }

  // Check if room is available
  if (newSlot.roomNumber) {
    const roomConflict = existingSlots.find(
      (slot) =>
        slot.roomNumber === newSlot.roomNumber &&
        slot.day === newSlot.day &&
        slot.startTime === newSlot.startTime &&
        slot.id !== newSlot.id,
    )

    if (roomConflict) {
      return `Room is already occupied by ${roomConflict.subjectName} at this time`
    }
  }

  return null
}
