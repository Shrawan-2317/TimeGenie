import { ObjectId } from "mongodb"

export type UserRole = "admin" | "teacher" | "student"

export interface User {
  _id?: ObjectId  // ⭐ Changed from string to ObjectId
  username: string
  email: string
  password: string
  collegeName: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface Administrator {
  userId: string
  username: string
  email: string
  role: UserRole
}

export interface College {
  _id?: ObjectId  // ⭐ Changed from string to ObjectId
  name: string
  email: string
  timetables: {
    all_classes: Record<string, any>
    faculty: Record<string, any>
    classes: Record<string, any>
  }
  inputData: {
    classes: Record<string, any>
    subjects: Record<string, any>
    faculties: Record<string, any>
    rooms: Record<string, any>
    constraints: Record<string, any>
  }
  administrators: Administrator[]
  createdAt: Date
  updatedAt: Date
}
