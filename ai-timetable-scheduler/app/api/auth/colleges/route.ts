import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || ""

export async function GET() {
  try {
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db('timetable_scheduler')
    
    const colleges = await db.collection('colleges')
      .find({})
      .project({ name: 1 })
      .toArray()

    const collegeNames = colleges.map((c: any) => c.name)

    await client.close()

    return NextResponse.json({ 
      success: true,
      colleges: collegeNames
    })
  } catch (error: any) {
    console.error("Get colleges error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to get colleges" },
      { status: 500 }
    )
  }
}
