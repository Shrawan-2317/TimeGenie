"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, ArrowLeft, Shield, BookOpen, Users } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    collegeName: "",
    collegeEmail: "",
    role: "student"
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      setLoading(false)
      return
    }

    if (!formData.role) {
      setError("Please select a role")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        alert("Account created successfully! Please login.")
        router.push("/")
      } else {
        setError(data.error || "Failed to create account")
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getRoleIcon = (roleValue: string) => {
    switch (roleValue) {
      case "admin":
        return <Shield className="h-4 w-4" />
      case "teacher":
        return <BookOpen className="h-4 w-4" />
      case "student":
        return <Users className="h-4 w-4" />
      default:
        return null
    }
  }

  const getRoleDescription = (roleValue: string) => {
    switch (roleValue) {
      case "admin":
        return "Manage college, teachers, and timetables"
      case "teacher":
        return "View and manage your schedule"
      case "student":
        return "View your class timetable"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <Card className="gradient-border overflow-hidden shadow-xl">
          <CardHeader className="bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-6 w-6 text-pink-600" />
              <CardTitle className="gradient-text">Create Account</CardTitle>
            </div>
            <CardDescription>Sign up to access the timetable system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 bg-white pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="bg-white border-pink-200 focus:border-pink-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white border-pink-200 focus:border-pink-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-white border-pink-200 focus:border-pink-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="bg-white border-pink-200 focus:border-pink-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="collegeName">College Name</Label>
                <Input
                  id="collegeName"
                  type="text"
                  required
                  placeholder="e.g., MIT-ADT University"
                  value={formData.collegeName}
                  onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                  className="bg-white border-pink-200 focus:border-pink-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="collegeEmail">College Email</Label>
                <Input
                  id="collegeEmail"
                  type="email"
                  required
                  placeholder="admin@college.edu"
                  value={formData.collegeEmail}
                  onChange={(e) => setFormData({ ...formData, collegeEmail: e.target.value })}
                  className="bg-white border-pink-200 focus:border-pink-400"
                />
              </div>

              {/* Enhanced Role Selection */}
              <div className="space-y-3">
                <Label htmlFor="role" className="text-base font-semibold">
                  Select Your Role
                </Label>
                <div className="relative">
                  <select
                    id="role"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg bg-white text-gray-900 font-medium appearance-none cursor-pointer transition-all duration-200 hover:border-pink-300 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                  >
                    <option value="">-- Select a role --</option>
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-pink-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </div>

                {/* Role Description */}
                {formData.role && (
                  <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-pink-50 to-orange-50 border border-pink-100">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-pink-600">
                        {getRoleIcon(formData.role)}
                      </div>
                      <span className="font-semibold text-gray-800 capitalize">
                        {formData.role}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {getRoleDescription(formData.role)}
                    </p>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary text-white border-0 font-semibold"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/" className="text-pink-600 hover:underline font-medium">
                  Login here
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
