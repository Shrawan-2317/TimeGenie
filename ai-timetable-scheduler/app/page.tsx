"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppStore } from "@/lib/store"
import { Calendar, Users, GraduationCap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const router = useRouter()
  const setUser = useAppStore((state) => state.setUser)
  
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [collegeName, setCollegeName] = useState("")
  const [role, setRole] = useState("admin") // ✅ NEW: Role selection
  const [colleges, setColleges] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/auth/colleges")
      .then(res => res.json())
      .then(data => setColleges(data.colleges || ["MIT-ADT University"]))
      .catch(console.error)
  }, [])

  
  const handleSignIn = async () => {
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username, 
          collegeName, 
          password,
          role // ⭐ ADD THIS: Send selected role to API
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setUser(data.user)
        localStorage.setItem("user", JSON.stringify(data.user))
        localStorage.setItem("token", data.token)

        // Redirect based on role
        if (data.user.role === "admin") {
          router.push("/admin/dashboard")
        } else if (data.user.role === "teacher") {
          router.push("/teacher/home")
        } else {
          router.push("/student/home")
        }
      } else {
        setError(data.error || "Login failed")
      }
    } catch (err) {
      setError("Something went wrong")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-xl gradient-primary shadow-lg">
            <Calendar className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight gradient-text">AI Timetable Scheduler</h1>
        </div>
        <p className="text-xl text-gray-600">Intelligent scheduling system for educational institutions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-12">
        <Card className="gradient-border overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-br from-pink-50 to-white">
            <div className="p-2 rounded-lg gradient-primary w-fit mb-2">
              <Users className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="gradient-text">Admin Portal</CardTitle>
            <CardDescription>Create and manage timetables, publish schedules, and handle approvals</CardDescription>
          </CardHeader>
        </Card>

        <Card className="gradient-border overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-br from-orange-50 to-white">
            <div className="p-2 rounded-lg gradient-secondary w-fit mb-2">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="gradient-text">Teacher Portal</CardTitle>
            <CardDescription>View your schedule, submit change requests, and manage class timetables</CardDescription>
          </CardHeader>
        </Card>

        <Card className="gradient-border overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-br from-yellow-50 to-white">
            <div className="p-2 rounded-lg gradient-accent w-fit mb-2">
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
            <CardTitle className="gradient-text">Student Portal</CardTitle>
            <CardDescription>Access your class timetable and stay updated with schedule changes</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* ✅ UPDATED: Login Form with Role Selection */}
      <Card className="w-full max-w-md gradient-border overflow-hidden shadow-xl">
        <CardHeader className="bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">
          <CardTitle className="gradient-text">Sign In</CardTitle>
          <CardDescription>Enter your credentials to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 bg-white pt-6">
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
              placeholder="your_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white border-pink-200 focus:border-pink-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="college">College Name</Label>
            <Select value={collegeName} onValueChange={setCollegeName}>
              <SelectTrigger id="college" className="bg-white border-pink-200">
                <SelectValue placeholder="Select your college" />
              </SelectTrigger>
              <SelectContent>
                {colleges.map((college) => (
                  <SelectItem key={college} value={college}>
                    {college}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ✅ NEW: Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role">Your Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role" className="bg-white border-pink-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white border-pink-200 focus:border-pink-400"
            />
          </div>

          <Button
            onClick={handleSignIn}
            className="w-full gradient-primary text-white border-0"
            disabled={!username || !password || !collegeName || loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          <div className="pt-4 border-t border-pink-200 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-pink-600 hover:underline font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
