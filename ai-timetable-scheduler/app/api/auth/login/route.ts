import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || ""
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(req: Request) {
  try {
    const { username, collegeName, password, role } = await req.json()

    if (!username || !collegeName || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // ⭐ NEW: Validate role is provided
    if (!role) {
      return NextResponse.json(
        { error: "Please select a role" },
        { status: 400 }
      )
    }

    // Validate role value
    const validRoles = ["admin", "teacher", "student"]
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role selected" },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db('timetable_scheduler')
    
    // Find user by username and college name
    const user = await db.collection('users').findOne({ 
      username,
      collegeName
    })

    // ⭐ NEW: User not found message
    if (!user) {
      await client.close()
      return NextResponse.json(
        { error: "Invalid user please sign in" },
        { status: 401 }
      )
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    // ⭐ NEW: Password mismatch message
    if (!isPasswordValid) {
      await client.close()
      return NextResponse.json(
        { error: "Invalid user please sign in" },
        { status: 401 }
      )
    }

    // ⭐ CRITICAL: Check if selected role matches user's actual role
    if (user.role !== role) {
      await client.close()
      return NextResponse.json(
        { error: `You are ${user.role}, not ${role}` },
        { status: 403 }
      )
    }

    // Generate JWT token with role included
    const token = jwt.sign(
      { 
        userId: user._id.toString(),
        username: user.username,
        email: user.email,
        collegeName: user.collegeName,
        role: user.role // Include role in token
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Return user data
    const userData = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      collegeName: user.collegeName,
      role: user.role
    }

    await client.close()

    return NextResponse.json({ 
      success: true,
      user: userData,
      token
    })
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to login" },
      { status: 500 }
    )
  }
}
