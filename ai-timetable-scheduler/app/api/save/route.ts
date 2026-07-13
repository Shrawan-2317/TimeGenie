// app/api/save/route.ts
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(req: Request) {
  try {
    const data = await req.json()

    // ✅ Option 1: Save locally to /data/inputData.json
    const filePath = path.join(process.cwd(),"inputData.json")

    // Ensure directory exists
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true })
    }

    // Write file locally
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8")

    // // ✅ Option 2 (optional): Forward data to FastAPI
    // // Uncomment if you want to also send data to backend
    
    // await fetch("http://localhost:8001/save-data", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(data),
    // })
    

    return NextResponse.json({
      success: true,
      message: "Data saved successfully!",
    })
  } catch (error) {
    console.error("Error saving data:", error)
    return NextResponse.json(
      { success: false, message: "Failed to save data." },
      { status: 500 }
    )
  }
}
