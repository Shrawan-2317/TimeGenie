import { create } from "zustand"
import type { User, TimetableVersion, Notification, InputData, ChangeRequest } from "./types"

interface AppState {
  // User state
  user: User | null
  setUser: (user: User | null) => void

  // Input data
  inputData: InputData | null
  setInputData: (data: InputData) => void

  // Timetable state
  currentVersion: TimetableVersion | null
  draftVersion: TimetableVersion | null
  versions: TimetableVersion[]
  setCurrentVersion: (version: TimetableVersion) => void
  setDraftVersion: (version: TimetableVersion | null) => void
  addVersion: (version: TimetableVersion) => void

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Notification) => void
  markNotificationRead: (id: string) => void
  clearNotifications: () => void

  // Change requests
  changeRequests: ChangeRequest[]
  addChangeRequest: (request: ChangeRequest) => void
  updateChangeRequest: (id: string, status: "approved" | "rejected") => void
}

export const useAppStore = create<AppState>((set) => ({
  // User
  user: null,
  setUser: (user) => set({ user }),

  // Input data
  inputData: null,
  setInputData: (data) => set({ inputData: data }),

  // Timetable
  currentVersion: null,
  draftVersion: null,
  versions: [],
  setCurrentVersion: (version) => set({ currentVersion: version }),
  setDraftVersion: (version) => set({ draftVersion: version }),
  addVersion: (version) =>
    set((state) => ({
      versions: [...state.versions, version],
    })),

  // Notifications
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
  clearNotifications: () => set({ notifications: [] }),

  // Change requests
  changeRequests: [],
  addChangeRequest: (request) =>
    set((state) => ({
      changeRequests: [...state.changeRequests, request],
    })),
  updateChangeRequest: (id, status) =>
    set((state) => ({
      changeRequests: state.changeRequests.map((r) => (r.id === id ? { ...r, status } : r)),
    })),
}))

export const useStore = useAppStore
