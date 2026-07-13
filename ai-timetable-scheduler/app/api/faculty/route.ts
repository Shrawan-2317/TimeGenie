import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import type { TimetableSlot } from "@/lib/types";

export async function GET() {
  try {
    const projectDir = process.cwd();
    const timetablePath = path.join(projectDir, "all_classes_timetable.json");

    if (!fs.existsSync(timetablePath)) {
      return NextResponse.json(
        { error: "Timetable file not found" },
        { status: 404 }
      );
    }

    const timetableData = JSON.parse(fs.readFileSync(timetablePath, "utf-8"));

    // ✅ Extract faculty schedules from all classes
    const facultySchedules: Record<string, TimetableSlot[]> = {};

    for (const [className, slots] of Object.entries(timetableData)) {
      const slotList = slots as TimetableSlot[];
      
      for (const slot of slotList) {
        if (slot.faculty && slot.subject) {
          if (!facultySchedules[slot.faculty]) {
            facultySchedules[slot.faculty] = [];
          }

          // Add slot with class info
          facultySchedules[slot.faculty].push({
            ...slot,
            classId: className,
          } as TimetableSlot & { classId: string });
        }
      }
    }

    // Sort each faculty's schedule by day and time
    for (const faculty in facultySchedules) {
      facultySchedules[faculty].sort((a, b) => {
        const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayA = dayOrder.indexOf(a.day);
        const dayB = dayOrder.indexOf(b.day);
        if (dayA !== dayB) return dayA - dayB;
        
        // Sort by time
        return a.slot.localeCompare(b.slot);
      });
    }

    return NextResponse.json({
      success: true,
      facultySchedules,
      totalFaculty: Object.keys(facultySchedules).length,
    });
  } catch (err: unknown) {
    console.error("Error fetching faculty schedules:", err);
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch faculty schedules";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
