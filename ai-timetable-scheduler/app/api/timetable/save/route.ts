// app/api/timetable/save/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { className, timetable } = await req.json();
    
    console.log('🟢 API CALLED - Saving timetable');
    console.log('   className:', className);
    console.log('   timetable slots count:', timetable?.length);
    console.log('   first slot:', timetable?.[0]);
    
    if (!className || !timetable) {
      return NextResponse.json(
        { error: "Missing className or timetable data" },
        { status: 400 }
      );
    }

    const projectDir = process.cwd();
    const timetablePath = path.join(projectDir, "all_classes_timetable.json");
    
    console.log('📂 File path:', timetablePath);
    console.log('📂 File exists:', fs.existsSync(timetablePath));

    let allTimetables: Record<string, any> = {};
    
    if (fs.existsSync(timetablePath)) {
      const fileContent = fs.readFileSync(timetablePath, "utf-8");
      allTimetables = JSON.parse(fileContent);
      console.log('📖 Read existing file, classes:', Object.keys(allTimetables));
    }

    console.log('✏️ Updating class:', className);
    allTimetables[className] = timetable;
    
    console.log('💾 Writing to file...');
    const jsonContent = JSON.stringify(allTimetables, null, 4);
    console.log('📝 JSON size:', jsonContent.length, 'bytes');
    
    fs.writeFileSync(timetablePath, jsonContent, "utf8");
    
    console.log('✅ File written successfully');

    return NextResponse.json({ 
      success: true,
      message: `Timetable for ${className} saved successfully` 
    });
  } catch (err: any) {
    console.error('❌ ERROR:', err);
    return NextResponse.json(
      { error: err.message || "Failed to save timetable" },
      { status: 500 }
    );
  }
}
