// app/api/run-genetic/route.ts
import { NextResponse } from "next/server"
import { spawn } from "child_process"
import path from "path"

export async function POST() {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), "genetic_scheduler.py")

    const python = spawn("python", [scriptPath])

    python.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`)
    })

    python.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`)
    })

    python.on("close", (code) => {
      if (code === 0) resolve(NextResponse.json({ success: true }))
      else reject(NextResponse.json({ success: false, error: `Python exited with code ${code}` }, { status: 500 }))
    })
  })
}
