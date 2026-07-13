import jsPDF from 'jspdf'
import { TimetableSlot } from './types'

export async function generateTimetablePDF(
  classId: string,
  slots: TimetableSlot[],
) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })

  // Get unique days and times
  const days = [...new Set(slots.map(s => s.day))]
  const times = [...new Set(slots.map(s => s.slot))].sort()

  // Add header
  doc.setFontSize(18)
  doc.text('TIMETABLE', 148, 15, { align: 'center' })
  
  doc.setFontSize(12)
  doc.text(`Class: ${classId}`, 148, 25, { align: 'center' })
  doc.text(`Semester: I | Academic Year: 2025-26`, 148, 32, { align: 'center' })

  // Table parameters
  const margin = 10
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const availableWidth = pageWidth - 2 * margin
  const availableHeight = pageHeight - 50

  const timeColWidth = 20
  const cellWidth = (availableWidth - timeColWidth) / days.length
  const cellHeight = availableHeight / (times.length + 1)

  let yPos = 40

  // Draw header row
  doc.setFillColor(200, 200, 200)
  doc.setFontSize(9)
doc.setFont('helvetica', 'bold')

  // Time header
  doc.rect(margin, yPos, timeColWidth, cellHeight, 'F')
  doc.text('Time', margin + 2, yPos + cellHeight / 2 + 1.5)

  // Day headers
  days.forEach((day, i) => {
    const x = margin + timeColWidth + i * cellWidth
    doc.rect(x, yPos, cellWidth, cellHeight, 'F')
    doc.text(day, x + cellWidth / 2, yPos + cellHeight / 2 + 1.5, { align: 'center' })
  })

  yPos += cellHeight

  // Draw time slots
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)

  times.forEach((time) => {
    // Time column
    doc.rect(margin, yPos, timeColWidth, cellHeight)
    doc.text(time, margin + 1, yPos + 2, { maxWidth: timeColWidth - 2 })

    // Data cells
    days.forEach((day, dayIdx) => {
      const x = margin + timeColWidth + dayIdx * cellWidth
      doc.rect(x, yPos, cellWidth, cellHeight)

      const slot = slots.find(s => s.day === day && s.slot === time)

      if (slot) {
        if (slot.type === 'break' || slot.label === 'Lunch Break') {
          doc.setFillColor(255, 193, 7)
          doc.rect(x, yPos, cellWidth, cellHeight, 'F')
          doc.text('LUNCH BREAK', x + 1, yPos + 2, { maxWidth: cellWidth - 2 })
        } else if (slot.type === 'short_break' || slot.label === 'Short Break') {
          doc.setFillColor(255, 235, 59)
          doc.rect(x, yPos, cellWidth, cellHeight, 'F')
          doc.text('BREAK', x + 1, yPos + 2, { maxWidth: cellWidth - 2 })
        } else if (slot.type === 'special' || (slot.label && !slot.subject)) {
          doc.setFillColor(206, 147, 216)
          doc.rect(x, yPos, cellWidth, cellHeight, 'F')
          doc.text(slot.label || '', x + 1, yPos + 2, { maxWidth: cellWidth - 2 })
        } else if (slot.type === 'online') {
          doc.setFillColor(255, 192, 203)
          doc.rect(x, yPos, cellWidth, cellHeight, 'F')
          const text = `${slot.subject || ''}\n${slot.faculty || ''}\nONLINE`
          doc.text(text, x + 1, yPos + 2, { maxWidth: cellWidth - 2 })
        } else if (slot.subjectType === 'lab' || slot.type === 'lab') {
          doc.setFillColor(144, 238, 144)
          doc.rect(x, yPos, cellWidth, cellHeight, 'F')
          const text = `${slot.subject || ''}\n${slot.faculty || ''}\n${slot.room || ''}\n[LAB]`
          doc.text(text, x + 1, yPos + 2, { maxWidth: cellWidth - 2 })
        } else if (slot.subjectType === 'theory' || slot.subject) {
          doc.setFillColor(173, 216, 230)
          doc.rect(x, yPos, cellWidth, cellHeight, 'F')
          const text = `${slot.subject || ''}\n${slot.faculty || ''}\n${slot.room || ''}`
          doc.text(text, x + 1, yPos + 2, { maxWidth: cellWidth - 2 })
        }
      }

      doc.rect(x, yPos, cellWidth, cellHeight)
    })

    yPos += cellHeight
  })

  // Save PDF
  doc.save(`Timetable_${classId}.pdf`)
}

export async function generateAllClassesPDF(allSlots: Record<string, TimetableSlot[]>) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })

  const classes = Object.keys(allSlots)

  classes.forEach((classId, classIdx) => {
    if (classIdx > 0) {
      doc.addPage()
    }

    const slots = allSlots[classId]
    const days = [...new Set(slots.map(s => s.day))]
    const times = [...new Set(slots.map(s => s.slot))].sort()

    // Add header
    doc.setFontSize(16)
    doc.text('TIMETABLE', 148, 15, { align: 'center' })
    
    doc.setFontSize(11)
    doc.text(`Class: ${classId}`, 148, 25, { align: 'center' })
    doc.text(`Semester: I | Academic Year: 2025-26`, 148, 31, { align: 'center' })

    // Table parameters
    const margin = 10
    const pageWidth = doc.internal.pageSize.getWidth()
    const availableWidth = pageWidth - 2 * margin
    const availableHeight = doc.internal.pageSize.getHeight() - 45

    const timeColWidth = 18
    const cellWidth = (availableWidth - timeColWidth) / days.length
    const cellHeight = availableHeight / (times.length + 1)

    let yPos = 37

    // Draw header row
    doc.setFillColor(200, 200, 200)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')

    doc.rect(margin, yPos, timeColWidth, cellHeight, 'F')
    doc.text('Time', margin + 1, yPos + cellHeight / 2 + 1)

    days.forEach((day, i) => {
      const x = margin + timeColWidth + i * cellWidth
      doc.rect(x, yPos, cellWidth, cellHeight, 'F')
      doc.text(day, x + cellWidth / 2, yPos + cellHeight / 2 + 1, { align: 'center' })
    })

    yPos += cellHeight

    // Draw time slots
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6)

    times.forEach((time) => {
      doc.rect(margin, yPos, timeColWidth, cellHeight)
      doc.text(time, margin + 0.5, yPos + 1.5, { maxWidth: timeColWidth - 1 })

      days.forEach((day, dayIdx) => {
        const x = margin + timeColWidth + dayIdx * cellWidth
        doc.rect(x, yPos, cellWidth, cellHeight)

        const slot = slots.find(s => s.day === day && s.slot === time)

        if (slot) {
          if (slot.type === 'break' || slot.label === 'Lunch Break') {
            doc.setFillColor(255, 193, 7)
            doc.rect(x, yPos, cellWidth, cellHeight, 'F')
            doc.text('BREAK', x + 0.5, yPos + 1.5, { maxWidth: cellWidth - 1 })
          } else if (slot.type === 'short_break' || slot.label === 'Short Break') {
            doc.setFillColor(255, 235, 59)
            doc.rect(x, yPos, cellWidth, cellHeight, 'F')
            doc.text('BREAK', x + 0.5, yPos + 1.5, { maxWidth: cellWidth - 1 })
          } else if (slot.subjectType === 'lab' || slot.type === 'lab') {
            doc.setFillColor(144, 238, 144)
            doc.rect(x, yPos, cellWidth, cellHeight, 'F')
            const text = `${slot.subject}\n${slot.faculty}\n[LAB]`
            doc.text(text, x + 0.5, yPos + 1, { maxWidth: cellWidth - 1 })
          } else if (slot.type === 'online') {
            doc.setFillColor(255, 192, 203)
            doc.rect(x, yPos, cellWidth, cellHeight, 'F')
            doc.text(slot.subject || '', x + 0.5, yPos + 1.5, { maxWidth: cellWidth - 1 })
          } else if (slot.subject) {
            doc.setFillColor(173, 216, 230)
            doc.rect(x, yPos, cellWidth, cellHeight, 'F')
            doc.text(slot.subject, x + 0.5, yPos + 1.5, { maxWidth: cellWidth - 1 })
          }
        }

        doc.rect(x, yPos, cellWidth, cellHeight)
      })

      yPos += cellHeight
    })
  })

  doc.save(`All_Classes_Timetable.pdf`)
}
