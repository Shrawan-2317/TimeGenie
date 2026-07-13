import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // Use your fixed path
    const filePath = `D:/ai-timetable-scheduler/ai-timetable-scheduler/all_classes_timetable.json`;

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Timetable file not found" }, { status: 404 });
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const classes = Object.keys(data); // ["TY$4", "TY##3", ...]

    return NextResponse.json({ classes });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 });
  }
}
