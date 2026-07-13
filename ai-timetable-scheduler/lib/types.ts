// Core data models for the timetable system

export type UserRole = "admin" | "teacher" | "student"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  facultyId?: string // For teachers
  classId?: string // For students
}

export interface Class {
  id: string
  name: string
  subjects: string[]
  class_teacher: string
  strength: number
}

export interface Subject {
  code: string
  name: string
  type: "theory" | "lab"
  hours_per_week: number
  faculties: string[]
  requires_lab?: boolean
  duration?: number // For labs (in slots)
}

export interface Faculty {
  id: string
  name: string
  subjects: string[]
  max_hours_per_day: number
  unavailable_slots: string[]
}

export interface Room {
  id: string
  type: "classroom" | "lab"
  capacity: number
  facilities: string[]
}

export interface Constraints {
  online_days: Record<string, string[]>
  special_slots: Record<string, Record<string, string>>
  max_hours_per_day: number
  max_consecutive_theory: number
  lunch_break: string
  short_breaks?: string[]  // ✅ Already added
}

export interface TimetableSlot {
  day: string
  slot: string
  subject?: string | null
  faculty?: string | null
  room?: string | null
  label?: string | null
  type?: 'regular' | 'special' | 'break' | 'short_break' | 'empty' | 'online'| 'lab'  // ✅ Added 'short_break'
  subjectType?: 'theory' | 'lab' | null
}

export interface ClassTimetable {
  classId: string
  slots: TimetableSlot[]
}

export interface TimetableVersion {
  id?: string  // ✅ Make optional
  version: string
  created_at: string
  created_by?: string  // ✅ Make optional
  status: "draft" | "pending" | "approved" | "active" | "archived"
  changes?: string  // ✅ Make optional
  slots?: TimetableSlot[]
  class_timelines?: Record<string, TimetableSlot[]>
  metrics?: {
    conflicts: number
    soft_score: number
  }
}


export interface ChangeRequest {
  id: string
  timetableVersion: string
  facultyId: string
  facultyName: string
  status: "pending" | "approved" | "rejected"
  comment: string
  created_at: string
}

export interface Notification {
  id: string
  type: "info" | "success" | "warning" | "error"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
}

export interface InputData {
  classes: Record<string, Class>
  subjects: Record<string, Subject>
  faculties: Record<string, Faculty>
  rooms: Record<string, Room>
  constraints: Constraints
}

// ✅ Helper function to generate canonical slots dynamically
export function generateCanonicalSlots(
  lunchBreak: string = '12:40-01:40',
  shortBreaks: string[] = []
): string[] {
  console.log('🔍 generateCanonicalSlots called with:')
  console.log('   Lunch:', lunchBreak)
  console.log('   Short breaks:', shortBreaks)
  
  const baseSlots = [
    '08:45-09:40',
    '09:40-10:35',
    '10:50-11:45',
    '11:45-12:40',
    '01:40-02:35',
    '02:35-03:30',
    '03:40-04:30',
  ]
  
  const allSlots: string[] = []
  
  for (const slot of baseSlots) {
    allSlots.push(slot)
    
    const slotEnd = slot.split('-')[1]
    
    // Add lunch break
    const lunchStart = lunchBreak.split('-')[0]
    if (slotEnd === lunchStart) {
      console.log(`✅ Adding lunch break after ${slot}`)
      allSlots.push(lunchBreak)
    }
    
    // Add short breaks
    shortBreaks.forEach(shortBreak => {
      const shortBreakStart = shortBreak.split('-')[0]
      console.log(`   Checking: "${slotEnd}" === "${shortBreakStart}" (${slot} vs ${shortBreak})`)
      if (slotEnd === shortBreakStart) {
        console.log(`✅ Adding short break: ${shortBreak}`)
        allSlots.push(shortBreak)
      }
    })
  }
  
  console.log('📊 Final slots:', allSlots)
  return allSlots
}

// ✅ Default canonical slots (with standard breaks)
export const CANONICAL_SLOTS = generateCanonicalSlots('12:40-01:40', ['10:35-10:50','03:30-03:40'])

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
