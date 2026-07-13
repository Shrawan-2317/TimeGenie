"use client"

import type { Timetable } from "./types"

export function exportToText(timetable: Timetable): string {
  let text = `${timetable.name}\n`
  text += `Academic Year: ${timetable.academicYear}\n`
  text += `Semester: ${timetable.semester}\n\n`

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  for (const day of days) {
    text += `\n${day}\n${"=".repeat(50)}\n`

    const daySlots = timetable.slots
      .filter((slot) => slot.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))

    for (const slot of daySlots) {
      text += `${slot.startTime} - ${slot.endTime}: ${slot.subjectName}`
      if (slot.facultyName) text += ` (${slot.facultyName})`
      if (slot.roomNumber) text += ` - ${slot.roomNumber}`
      text += "\n"
    }
  }

  return text
}

export function exportToICalendar(timetable: Timetable): string {
  let ical = "BEGIN:VCALENDAR\n"
  ical += "VERSION:2.0\n"
  ical += "PRODID:-//AI Timetable Scheduler//EN\n"
  ical += `X-WR-CALNAME:${timetable.name}\n`

  const dayMap: Record<string, number> = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  }

  for (const slot of timetable.slots) {
    if (slot.type === "lunch") continue

    ical += "BEGIN:VEVENT\n"
    ical += `UID:${slot.id}@timetable.app\n`
    ical += `SUMMARY:${slot.subjectName}\n`

    if (slot.facultyName) {
      ical += `DESCRIPTION:Faculty: ${slot.facultyName}\\nRoom: ${slot.roomNumber || "TBA"}\n`
    }

    if (slot.roomNumber) {
      ical += `LOCATION:${slot.roomNumber}\n`
    }

    // Recurring weekly event
    ical += `RRULE:FREQ=WEEKLY;BYDAY=${["MO", "TU", "WE", "TH", "FR", "SA"][dayMap[slot.day] - 1]}\n`

    ical += "END:VEVENT\n"
  }

  ical += "END:VCALENDAR\n"

  return ical
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportToPDF(timetable: Timetable) {
  // This would use a library like jsPDF in production
  // For now, we'll trigger the browser's print dialog
  window.print()
}

export function exportToImage(elementId: string, filename: string) {
  // This would use html2canvas in production
  // For now, we'll show a message
  alert("Image export would use html2canvas library. Use Print instead for now.")
}
