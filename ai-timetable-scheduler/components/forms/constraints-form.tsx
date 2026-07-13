"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { InputData } from "@/lib/types"

interface ConstraintsFormProps {
  data: InputData
  setData: (data: InputData) => void
}

export function ConstraintsForm({ data, setData }: ConstraintsFormProps) {
  const constraints = data.constraints
  const [selectedClassesForOnline, setSelectedClassesForOnline] = useState<string[]>([])
  const [selectedDayForOnline, setSelectedDayForOnline] = useState("")
  
  const [specialSlotDay, setSpecialSlotDay] = useState("")
  const [specialSlotTime, setSpecialSlotTime] = useState("")
  const [specialSlotActivity, setSpecialSlotActivity] = useState("")

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  // ⭐ Add Online Day
  const handleAddOnlineDay = () => {
    if (!selectedDayForOnline || selectedClassesForOnline.length === 0) {
      alert("Please select a day and at least one class")
      return
    }

    const newConstraints = { ...constraints }
    if (!newConstraints.online_days) {
      newConstraints.online_days = {}
    }

    newConstraints.online_days[selectedDayForOnline] = selectedClassesForOnline
    setData({ ...data, constraints: newConstraints })

    setSelectedDayForOnline("")
    setSelectedClassesForOnline([])
  }

  // ⭐ Remove Online Day
  const handleRemoveOnlineDay = (day: string) => {
    const newConstraints = { ...constraints }
    delete newConstraints.online_days[day]
    setData({ ...data, constraints: newConstraints })
  }

  // ⭐ Toggle Class Selection for Online
  const handleToggleClass = (classId: string) => {
    setSelectedClassesForOnline(prev =>
      prev.includes(classId)
        ? prev.filter(c => c !== classId)
        : [...prev, classId]
    )
  }

  // ⭐ Add Special Slot
  const handleAddSpecialSlot = () => {
    if (!specialSlotDay || !specialSlotTime || !specialSlotActivity) {
      alert("Please fill all fields")
      return
    }

    const newConstraints = { ...constraints }
    if (!newConstraints.special_slots) {
      newConstraints.special_slots = {}
    }
    if (!newConstraints.special_slots[specialSlotDay]) {
      newConstraints.special_slots[specialSlotDay] = {}
    }

    newConstraints.special_slots[specialSlotDay][specialSlotTime] = specialSlotActivity
    setData({ ...data, constraints: newConstraints })

    setSpecialSlotDay("")
    setSpecialSlotTime("")
    setSpecialSlotActivity("")
  }

  // ⭐ Remove Special Slot
  const handleRemoveSpecialSlot = (day: string, timeSlot: string) => {
    const newConstraints = { ...constraints }
    delete newConstraints.special_slots[day][timeSlot]
    if (Object.keys(newConstraints.special_slots[day]).length === 0) {
      delete newConstraints.special_slots[day]
    }
    setData({ ...data, constraints: newConstraints })
  }

  // ⭐ Add Short Break
  const addShortBreak = () => {
    const currentBreaks = constraints.short_breaks || []
    setData({
      ...data,
      constraints: {
        ...constraints,
        short_breaks: [...currentBreaks, "10:35-10:50"],
      },
    })
  }

  // ⭐ Remove Short Break
  const removeShortBreak = (index: number) => {
    const currentBreaks = constraints.short_breaks || []
    setData({
      ...data,
      constraints: {
        ...constraints,
        short_breaks: currentBreaks.filter((_, i) => i !== index),
      },
    })
  }

  // ⭐ Update Short Break Time
  const updateShortBreak = (index: number, value: string) => {
    const currentBreaks = constraints.short_breaks || []
    const updatedBreaks = [...currentBreaks]
    updatedBreaks[index] = value
    setData({
      ...data,
      constraints: {
        ...constraints,
        short_breaks: updatedBreaks,
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Basic Constraints */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Constraints</CardTitle>
          <CardDescription>Set general scheduling constraints</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_hours">Max Hours Per Day</Label>
              <Input
                id="max_hours"
                type="number"
                value={constraints.max_hours_per_day}
                onChange={(e) =>
                  setData({
                    ...data,
                    constraints: {
                      ...constraints,
                      max_hours_per_day: parseInt(e.target.value),
                    },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_consecutive">Max Consecutive Theory</Label>
              <Input
                id="max_consecutive"
                type="number"
                value={constraints.max_consecutive_theory}
                onChange={(e) =>
                  setData({
                    ...data,
                    constraints: {
                      ...constraints,
                      max_consecutive_theory: parseInt(e.target.value),
                    },
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lunch Break */}
      <Card>
        <CardHeader>
          <CardTitle>Lunch Break</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="lunch_break">Lunch Break Time</Label>
            <Input
              id="lunch_break"
              placeholder="12:40-01:40"
              value={constraints.lunch_break}
              onChange={(e) =>
                setData({
                  ...data,
                  constraints: {
                    ...constraints,
                    lunch_break: e.target.value,
                  },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Short Breaks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Short Breaks</CardTitle>
              <CardDescription>Tea break, recess, etc.</CardDescription>
            </div>
            <Button onClick={addShortBreak} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Add Break
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {(!constraints.short_breaks || constraints.short_breaks.length === 0) ? (
            <p className="text-sm text-muted-foreground">No short breaks added</p>
          ) : (
            <div className="space-y-2">
              {constraints.short_breaks.map((breakTime, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="10:35-10:50"
                    value={breakTime}
                    onChange={(e) => updateShortBreak(index, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => removeShortBreak(index)}
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ⭐ NEW: Online Days */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📅 Online Days
            <Badge variant="outline" className="ml-2">Optional</Badge>
          </CardTitle>
          <CardDescription>
            Specify which classes have online classes on which days
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Display existing online days */}
          {Object.entries(constraints.online_days || {}).length > 0 && (
            <div className="space-y-2 mb-4">
              <Label className="text-sm font-semibold">Current Online Days:</Label>
              {Object.entries(constraints.online_days || {}).map(([day, classes]) => (
                <div key={day} className="p-3 border rounded-lg bg-blue-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-blue-900">{day}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveOnlineDay(day)}
                      className="text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(classes as string[]).map(classId => (
                      <Badge key={classId} variant="secondary">{classId}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add new online day */}
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="online-day">Select Day</Label>
              <select
                id="online-day"
                value={selectedDayForOnline}
                onChange={(e) => setSelectedDayForOnline(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">-- Select Day --</option>
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Select Classes for Online (on this day)</Label>
              <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto p-2 border rounded">
                {Object.keys(data.classes || {}).length === 0 ? (
                  <p className="text-sm text-muted-foreground col-span-2">No classes added yet</p>
                ) : (
                  Object.keys(data.classes || {}).map(classId => (
                    <label key={classId} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedClassesForOnline.includes(classId)}
                        onChange={() => handleToggleClass(classId)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{classId}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <Button onClick={handleAddOnlineDay} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add Online Day
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ⭐ NEW: Special Slots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ⏰ Special Slots
            <Badge variant="outline" className="ml-2">Optional</Badge>
          </CardTitle>
          <CardDescription>
            Mentor meetings, PBL reviews, NPTEL sessions, etc.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Display existing special slots */}
          {Object.entries(constraints.special_slots || {}).length > 0 && (
            <div className="space-y-2 mb-4">
              <Label className="text-sm font-semibold">Current Special Slots:</Label>
              {Object.entries(constraints.special_slots || {}).map(([day, slots]) => (
                <div key={day} className="p-3 border rounded-lg bg-amber-50">
                  <h4 className="font-semibold text-amber-900 mb-2">{day}</h4>
                  <div className="space-y-2">
                    {Object.entries(slots as Record<string, string>).map(([time, activity]) => (
                      <div key={time} className="flex items-center justify-between bg-white p-2 rounded">
                        <span className="text-sm">{time} - {activity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSpecialSlot(day, time)}
                          className="text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add new special slot */}
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="special-day">Day</Label>
              <select
                id="special-day"
                value={specialSlotDay}
                onChange={(e) => setSpecialSlotDay(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">-- Select Day --</option>
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="special-time">Time Slot</Label>
              <Input
                id="special-time"
                placeholder="e.g., 03:40-04:30"
                value={specialSlotTime}
                onChange={(e) => setSpecialSlotTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="special-activity">Activity Name</Label>
              <Input
                id="special-activity"
                placeholder="e.g., Mentor Meeting, PBL Review, NPTEL"
                value={specialSlotActivity}
                onChange={(e) => setSpecialSlotActivity(e.target.value)}
              />
            </div>

            <Button onClick={handleAddSpecialSlot} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add Special Slot
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
