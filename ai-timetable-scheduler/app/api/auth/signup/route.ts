import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { MongoClient } from "mongodb"
import type { User, College } from "@/lib/db-schema"

const MONGODB_URI = process.env.MONGODB_URI || ""

export async function POST(req: Request) {
  try {
    const { username, email, password, collegeName, collegeEmail, role } = await req.json()

    // Validation
    if (!username || !email || !password || !collegeName || !role) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ["admin", "teacher", "student"]
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role selected" },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db('timetable_scheduler')
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ 
      $or: [{ username }, { email }] 
    })

    if (existingUser) {
      await client.close()
      return NextResponse.json(
        { error: "Username or email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user with selected role
    const newUser: User = {
      username,
      email,
      password: hashedPassword,
      collegeName,
      role, // Use the role from signup form
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection('users').insertOne(newUser)

    // Check if college exists
    let college = await db.collection('colleges').findOne({ name: collegeName })

    if (!college) {
      // Create new college
      const newCollege: College = {
        name: collegeName,
        email: collegeEmail,
        createdAt: new Date(),
        updatedAt: new Date(),
        timetables: {
          all_classes: {},
          faculty: {},
          classes: {}
        },
        inputData: {
          classes: {},
          subjects: {},
          faculties: {},
          rooms: {},
          constraints: {}
        },
        administrators: [
          {
            userId: result.insertedId.toString(),
            username,
            email,
            role // Include role in administrators array
          }
        ]
      }

      await db.collection('colleges').insertOne(newCollege)
    } else {
      // Add user to existing college
      await db.collection('colleges').updateOne(
        { name: collegeName },
        {
          $push: {
            administrators: {
              userId: result.insertedId.toString(),
              username,
              email,
              role // Include role when adding to existing college
            } as any
          }
        }
      )
    }

    await client.close()

    return NextResponse.json({ 
      success: true, 
      message: "Account created successfully" 
    })
  } catch (error: any) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create account" },
      { status: 500 }
    )
  }
}
