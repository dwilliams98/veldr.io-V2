"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface Elder {
  id: string
  name: string
  photoURL: string
  phoneNumber: string
  email: string
  age: number
  relationship: string
  address: string
  emergencyContact: string
  recentAlerts: number
  lastActivity: string
  protectionScore: number
  status: "Active" | "Inactive"
}

interface Alert {
  id: string
  elderId: string
  elderName: string
  elderPhoto: string
  channel: "Phone" | "Email" | "Banking" | "Social Media" | "Data Breach"
  riskLevel: "Critical" | "Warning" | "Info"
  title: string
  description: string
  transcript?: string
  timestamp: string
  resolved: boolean
  escalated: boolean
  audioUrl?: string
  status: "new" | "reviewed" | "resolved"
  priority: "high" | "medium" | "low"
  notes: string[]
}

interface Notification {
  id: number
  type: "alert" | "success" | "info" | "warning"
  message: string
  time: string
  read: boolean
}

interface AppContextType {
  user: User | null
  elders: Elder[]
  alerts: Alert[]
  notifications: Notification[]
  isLoading: boolean

  // User actions
  setUser: (user: User | null) => void

  // Elder actions
  addElder: (elder: Omit<Elder, "id">) => void
  updateElder: (id: string, updates: Partial<Elder>) => void
  deleteElder: (id: string) => void

  // Alert actions
  resolveAlert: (id: string) => void
  escalateAlert: (id: string) => void
  archiveAlert: (id: string) => void
  addNote: (alertId: string, note: string) => void

  // Notification actions
  addNotification: (notification: Omit<Notification, "id">) => void
  markNotificationAsRead: (id: number) => void
  markAllNotificationsAsRead: () => void

  // System actions
  refreshData: () => Promise<void>
  exportData: (type: "alerts" | "elders") => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [elders, setElders] = useState<Elder[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Initialize with mock data
  useEffect(() => {
    const mockUser: User = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    }

    const mockElders: Elder[] = [
      {
        id: "1",
        name: "Margaret Johnson",
        photoURL: "/placeholder.svg?height=40&width=40",
        phoneNumber: "+1-555-0123",
        email: "margaret.johnson@email.com",
        age: 78,
        relationship: "Mother",
        address: "123 Oak Street, Springfield, IL",
        emergencyContact: "John Johnson (+1-555-0124)",
        recentAlerts: 2,
        lastActivity: "2 hours ago",
        protectionScore: 85,
        status: "Active",
      },
      {
        id: "2",
        name: "Robert Smith",
        photoURL: "/placeholder.svg?height=40&width=40",
        phoneNumber: "+1-555-0456",
        email: "robert.smith@email.com",
        age: 82,
        relationship: "Father-in-law",
        address: "456 Pine Avenue, Springfield, IL",
        emergencyContact: "Sarah Smith (+1-555-0457)",
        recentAlerts: 0,
        lastActivity: "1 day ago",
        protectionScore: 92,
        status: "Active",
      },
    ]

    const mockAlerts: Alert[] = [
      {
        id: "1",
        elderId: "1",
        elderName: "Margaret Johnson",
        elderPhoto: "/placeholder.svg?height=40&width=40",
        channel: "Phone",
        riskLevel: "Critical",
        title: "Suspicious Phone Call - Social Security Scam",
        description: "Caller requesting Social Security number and bank account details",
        transcript:
          "We detected a suspicious call. The caller was asking for your Social Security number and bank account details. This appears to be a scam attempt.",
        timestamp: "2024-01-15T14:30:00Z",
        resolved: false,
        escalated: false,
        audioUrl: "#",
        status: "new",
        priority: "high",
        notes: [],
      },
      {
        id: "2",
        elderId: "2",
        elderName: "Robert Smith",
        elderPhoto: "/placeholder.svg?height=40&width=40",
        channel: "Banking",
        riskLevel: "Critical",
        title: "Unusual Wire Transfer Attempt",
        description: "Large wire transfer to unknown account blocked",
        timestamp: "2024-01-15T09:45:00Z",
        resolved: false,
        escalated: true,
        status: "reviewed",
        priority: "high",
        notes: ["Contacted elder - confirmed not authorized", "Bank notified and account secured"],
      },
    ]

    const mockNotifications: Notification[] = [
      { id: 1, type: "alert", message: "New critical alert for Margaret Johnson", time: "2 min ago", read: false },
      { id: 2, type: "success", message: "Banking monitor connected successfully", time: "1 hour ago", read: false },
      { id: 3, type: "info", message: "Weekly protection report is ready", time: "2 hours ago", read: true },
    ]

    setUser(mockUser)
    setElders(mockElders)
    setAlerts(mockAlerts)
    setNotifications(mockNotifications)
  }, [])

  // Elder actions
  const addElder = (elderData: Omit<Elder, "id">) => {
    const newElder: Elder = {
      ...elderData,
      id: Date.now().toString(),
    }
    setElders((prev) => [...prev, newElder])
    addNotification({
      type: "success",
      message: `${elderData.name} has been added to protection`,
      time: "Just now",
      read: false,
    })
  }

  const updateElder = (id: string, updates: Partial<Elder>) => {
    setElders((prev) => prev.map((elder) => (elder.id === id ? { ...elder, ...updates } : elder)))
    addNotification({
      type: "info",
      message: "Elder profile updated successfully",
      time: "Just now",
      read: false,
    })
  }

  const deleteElder = (id: string) => {
    const elder = elders.find((e) => e.id === id)
    setElders((prev) => prev.filter((elder) => elder.id !== id))
    setAlerts((prev) => prev.filter((alert) => alert.elderId !== id))
    if (elder) {
      addNotification({
        type: "info",
        message: `${elder.name} removed from protection`,
        time: "Just now",
        read: false,
      })
    }
  }

  // Alert actions
  const resolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, resolved: true, status: "resolved" as const } : alert)),
    )
    addNotification({
      type: "success",
      message: "Alert marked as resolved",
      time: "Just now",
      read: false,
    })
  }

  const escalateAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, escalated: true, status: "reviewed" as const, priority: "high" as const } : alert,
      ),
    )
    addNotification({
      type: "warning",
      message: "Alert escalated for immediate attention",
      time: "Just now",
      read: false,
    })
  }

  const archiveAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
    addNotification({
      type: "info",
      message: "Alert archived",
      time: "Just now",
      read: false,
    })
  }

  const addNote = (alertId: string, note: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === alertId ? { ...alert, notes: [...alert.notes, note] } : alert)),
    )
  }

  // Notification actions
  const addNotification = (notification: Omit<Notification, "id">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
    }
    setNotifications((prev) => [newNotification, ...prev.slice(0, 9)]) // Keep only 10 notifications
  }

  const markNotificationAsRead = (id: number) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  // System actions
  const refreshData = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    addNotification({
      type: "success",
      message: "Data refreshed successfully",
      time: "Just now",
      read: false,
    })
    setIsLoading(false)
  }

  const exportData = (type: "alerts" | "elders") => {
    // Simulate export
    const data = type === "alerts" ? alerts : elders
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `veldr-${type}-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)

    addNotification({
      type: "success",
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} exported successfully`,
      time: "Just now",
      read: false,
    })
  }

  const value: AppContextType = {
    user,
    elders,
    alerts,
    notifications,
    isLoading,
    setUser,
    addElder,
    updateElder,
    deleteElder,
    resolveAlert,
    escalateAlert,
    archiveAlert,
    addNote,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    refreshData,
    exportData,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
