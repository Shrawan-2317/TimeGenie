import type { TimetableSlot } from "./types"

export function validateSlot(
  slot: TimetableSlot,
  allSlots: TimetableSlot[],
  classId: string,
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check for faculty double-booking
  if (slot.faculty) {
    const facultyConflict = allSlots.find(
      (s) =>
        s.day === slot.day &&
        s.slot === slot.slot &&
        s.faculty === slot.faculty &&
        (s.subject !== slot.subject || s.room !== slot.room),
    )
    if (facultyConflict) {
      errors.push(`Faculty ${slot.faculty} is already scheduled at this time`)
    }
  }

  // Check for room double-booking
  if (slot.room) {
    const roomConflict = allSlots.find(
      (s) =>
        s.day === slot.day &&
        s.slot === slot.slot &&
        s.room === slot.room &&
        (s.subject !== slot.subject || s.faculty !== slot.faculty),
    )
    if (roomConflict) {
      errors.push(`Room ${slot.room} is already booked at this time`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function generateSampleTimetable(classId: string): TimetableSlot[] {
  const sampleSlots: TimetableSlot[] = [
    // Monday
    { day: "Monday", slot: "08:45-09:40", subject: "DBMS", faculty: "Dr. A", room: "S403", type: "theory" },
    { day: "Monday", slot: "09:40-10:35", subject: "SE", faculty: "Dr. C", room: "S403", type: "theory" },
    { day: "Monday", slot: "10:50-11:45", subject: "CN", faculty: "Dr. E", room: "S403", type: "theory" },
    { day: "Monday", slot: "11:45-12:40", subject: "TOC", faculty: "Dr. F", room: "S403", type: "theory" },
    { day: "Monday", slot: "12:40-13:40", label: "Lunch Break", type: "lunch" },
    { day: "Monday", slot: "13:40-14:35", subject: "AIML", faculty: "Dr. G", room: "S403", type: "theory" },
    { day: "Monday", slot: "14:35-15:30", subject: "AIML", faculty: "Dr. G", room: "S403", type: "theory" },
    { day: "Monday", slot: "15:40-16:30", label: "Mentor Meeting", type: "special" },

    // Tuesday
    { day: "Tuesday", slot: "08:45-09:40", subject: "SE", faculty: "Dr. C", room: "S403", type: "theory" },
    { day: "Tuesday", slot: "09:40-10:35", subject: "DBMS", faculty: "Dr. A", room: "S403", type: "theory" },
    { day: "Tuesday", slot: "10:50-11:45", subject: "DBMS_LAB", faculty: "Dr. A", room: "LAB1", type: "lab" },
    { day: "Tuesday", slot: "11:45-12:40", subject: "DBMS_LAB", faculty: "Dr. A", room: "LAB1", type: "lab" },
    { day: "Tuesday", slot: "12:40-13:40", label: "Lunch Break", type: "lunch" },
    { day: "Tuesday", slot: "13:40-14:35", subject: "TOC", faculty: "Dr. F", room: "S403", type: "theory" },
    { day: "Tuesday", slot: "14:35-15:30", subject: "CN", faculty: "Dr. E", room: "S403", type: "theory" },

    // Wednesday - Online Day
    { day: "Wednesday", slot: "08:45-09:40", subject: "DBMS", faculty: "Dr. A", room: "Online", type: "online" },
    { day: "Wednesday", slot: "09:40-10:35", subject: "SE", faculty: "Dr. C", room: "Online", type: "online" },
    { day: "Wednesday", slot: "10:50-11:45", subject: "AIML", faculty: "Dr. G", room: "Online", type: "online" },
    { day: "Wednesday", slot: "12:40-13:40", label: "Lunch Break", type: "lunch" },

    // Thursday
    { day: "Thursday", slot: "08:45-09:40", subject: "CN", faculty: "Dr. E", room: "S403", type: "theory" },
    { day: "Thursday", slot: "09:40-10:35", subject: "TOC", faculty: "Dr. F", room: "S403", type: "theory" },
    { day: "Thursday", slot: "10:50-11:45", subject: "AIML", faculty: "Dr. G", room: "S403", type: "theory" },
    { day: "Thursday", slot: "11:45-12:40", subject: "SE", faculty: "Dr. C", room: "S403", type: "theory" },
    { day: "Thursday", slot: "12:40-13:40", label: "Lunch Break", type: "lunch" },
    { day: "Thursday", slot: "13:40-14:35", subject: "DBMS", faculty: "Dr. A", room: "S403", type: "theory" },

    // Friday
    { day: "Friday", slot: "08:45-09:40", subject: "TOC", faculty: "Dr. F", room: "S403", type: "theory" },
    { day: "Friday", slot: "09:40-10:35", subject: "CN", faculty: "Dr. E", room: "S403", type: "theory" },
    { day: "Friday", slot: "10:50-11:45", subject: "SE", faculty: "Dr. C", room: "S403", type: "theory" },
    { day: "Friday", slot: "11:45-12:40", subject: "AIML", faculty: "Dr. G", room: "S403", type: "theory" },
    { day: "Friday", slot: "12:40-13:40", label: "Lunch Break", type: "lunch" },
    { day: "Friday", slot: "13:40-14:35", subject: "DBMS", faculty: "Dr. A", room: "S403", type: "theory" },
    { day: "Friday", slot: "15:40-16:30", label: "NPTEL", type: "special" },

    // Saturday
    { day: "Saturday", slot: "08:45-09:40", label: "PBL Review", type: "special" },
    { day: "Saturday", slot: "09:40-10:35", label: "PAL", type: "special" },
    { day: "Saturday", slot: "10:50-11:45", subject: "CN_LAB", faculty: "Dr. E", room: "LAB1", type: "lab" },
    { day: "Saturday", slot: "11:45-12:40", subject: "CN_LAB", faculty: "Dr. E", room: "LAB1", type: "lab" },
  ]

  return sampleSlots
}

export function exportTimetableToText(slots: TimetableSlot[], classId: string): string {
  let output = `Timetable for ${classId}\n`
  output += "=".repeat(50) + "\n\n"

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  days.forEach((day) => {
    output += `${day}\n`
    output += "-".repeat(50) + "\n"

    const daySlots = slots.filter((s) => s.day === day)
    daySlots.forEach((slot) => {
      output += `${slot.slot}: `
      if (slot.type === "lunch") {
        output += "Lunch Break\n"
      } else if (slot.type === "special") {
        output += `${slot.label}\n`
      } else {
        output += `${slot.subject} - ${slot.faculty} (${slot.room})\n`
      }
    })
    output += "\n"
  })

  return output
}
