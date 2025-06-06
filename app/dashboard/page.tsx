"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  AlertTriangle,
  Shield,
  Users,
  Plus,
  Phone,
  Clock,
  Mail,
  CreditCard,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Info,
  Play,
  Pause,
  MessageSquare,
  Settings,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { useApp } from "@/contexts/app-context"
import { VersionInfo } from "@/components/version-info"

// Service interfaces for type safety
interface MonitoringService {
  name: string
  status: "Active" | "Inactive"
  alerts: number
  icon: React.ComponentType<{ className?: string }>
  color: string
  health: number
}

export default function Dashboard() {
  const { user, elders, alerts, resolveAlert, escalateAlert, addNote, refreshData, isLoading } = useApp()
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)
  const [noteDialog, setNoteDialog] = useState<{ open: boolean; alertId: string }>({ open: false, alertId: "" })
  const [newNote, setNewNote] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("veldr_token")
      if (!token) {
        router.push("/login")
        return
      }
    }
  }, [router])

  const mockServices: MonitoringService[] = [
    { name: "Phone Monitoring", status: "Active", alerts: 2, icon: Phone, color: "text-primary", health: 98 },
    { name: "Email Protection", status: "Active", alerts: 1, icon: Mail, color: "text-green-600", health: 95 },
    { name: "Banking Alerts", status: "Active", alerts: 1, icon: CreditCard, color: "text-purple-600", health: 100 },
    { name: "Social Media", status: "Inactive", alerts: 0, icon: Users, color: "text-muted-foreground", health: 0 },
    {
      name: "Data Breach Monitor",
      status: "Active",
      alerts: 1,
      icon: AlertTriangle,
      color: "text-orange-600",
      health: 88,
    },
  ]

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "destructive"
      case "Warning":
        return "secondary"
      case "Safe":
        return "default"
      default:
        return "default"
    }
  }

  const getAlertIcon = (status: string) => {
    switch (status) {
      case "new":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "reviewed":
        return <Info className="h-4 w-4 text-yellow-500" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      const now = new Date()
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

      if (diffInHours < 1) return "Just now"
      if (diffInHours < 24) return `${diffInHours}h ago`
      return date.toLocaleDateString()
    } catch (error) {
      console.error("Error formatting timestamp:", error)
      return "Invalid date"
    }
  }

  const getProtectionScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const handlePlayAudio = (alertId: string) => {
    if (playingAudio === alertId) {
      setPlayingAudio(null)
    } else {
      setPlayingAudio(alertId)
      // Simulate audio playback
      setTimeout(() => setPlayingAudio(null), 3000)
    }
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNote(noteDialog.alertId, newNote.trim())
      setNewNote("")
      setNoteDialog({ open: false, alertId: "" })
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshData()
    setIsRefreshing(false)
  }

  const totalAlerts = alerts.filter((alert) => alert.status === "new").length
  const criticalAlerts = alerts.filter((alert) => alert.riskLevel === "Critical" && alert.status === "new").length
  const overallHealth = Math.round(mockServices.reduce((acc, service) => acc + service.health, 0) / mockServices.length)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header with Welcome Message */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-2">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name || "User"}</h1>
              <p className="text-muted-foreground">Here's what's happening with your family's protection</p>
            </div>
            <VersionInfo />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Link href="/alerts">
              <Button variant="outline" className="relative">
                <AlertTriangle className="h-4 w-4 mr-2" />
                View All Alerts
                {totalAlerts > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {totalAlerts}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href="/elders/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Elder
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Status Alert */}
        {criticalAlerts > 0 && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-900">
                    {criticalAlerts} Critical Alert{criticalAlerts > 1 ? "s" : ""} Need{criticalAlerts === 1 ? "s" : ""}{" "}
                    Attention
                  </h3>
                  <p className="text-red-700 text-sm">Immediate action may be required to protect your loved ones.</p>
                </div>
                <Link href="/alerts" className="ml-auto">
                  <Button variant="destructive" size="sm">
                    Review Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card
            className="relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push("/elders")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Protected Elders</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{elders.length}</div>
              <p className="text-xs text-muted-foreground">Active monitoring</p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500"></div>
            </CardContent>
          </Card>

          <Card
            className="relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push("/alerts")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAlerts}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
              <div
                className={`absolute bottom-0 left-0 w-full h-1 ${totalAlerts > 0 ? "bg-red-500" : "bg-green-500"}`}
              ></div>
            </CardContent>
          </Card>

          <Card
            className="relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push("/monitoring")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallHealth}%</div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500"></div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Protection Status</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Active</div>
              <p className="text-xs text-muted-foreground">24/7 monitoring</p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500"></div>
            </CardContent>
          </Card>
        </div>

        {/* Service Monitoring Overview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Service Monitoring
                  <Badge variant="outline" className="text-xs">
                    {mockServices.filter((s) => s.status === "Active").length} of {mockServices.length} active
                  </Badge>
                </CardTitle>
                <CardDescription>Connected protection services across all platforms</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => router.push("/monitoring/connect")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Service
                </Button>
                <Link href="/monitoring">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Services
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {mockServices.map((service, index) => (
                <div
                  key={`service-${index}`}
                  className="text-center p-4 border rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() => router.push("/monitoring")}
                >
                  <service.icon className={`h-8 w-8 mx-auto mb-2 ${service.color}`} />
                  <h3 className="font-medium text-sm mb-1">{service.name}</h3>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <div
                      className={`w-2 h-2 rounded-full ${service.status === "Active" ? "bg-green-500" : "bg-gray-400"}`}
                    ></div>
                    <p
                      className={`text-xs ${service.status === "Active" ? "text-green-600" : "text-muted-foreground"}`}
                    >
                      {service.status}
                    </p>
                  </div>
                  {service.status === "Active" && (
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Health: {service.health}%</div>
                      <Progress value={service.health} className="h-1" />
                    </div>
                  )}
                  {service.alerts > 0 && (
                    <Badge variant="destructive" className="mt-2 text-xs">
                      {service.alerts} alert{service.alerts > 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Elder Profiles */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Protected Elders</CardTitle>
                  <CardDescription>Manage your loved ones&apos; protection settings</CardDescription>
                </div>
                <Link href="/elders">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {elders.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-foreground mb-2">No elders added yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">Start protecting your loved ones today</p>
                  <Link href="/elders/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Elder
                    </Button>
                  </Link>
                </div>
              ) : (
                elders.map((elder) => (
                  <div
                    key={elder.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={elder.photoURL || "/placeholder.svg"} alt={elder.name} />
                          <AvatarFallback>
                            {elder.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {elder.recentAlerts > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{elder.recentAlerts}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{elder.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {elder.relationship} • Age {elder.age}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{elder.phoneNumber}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Protection Score:</span>
                        <span className={`text-sm font-bold ${getProtectionScoreColor(elder.protectionScore)}`}>
                          {elder.protectionScore}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {elder.lastActivity}
                      </p>
                      <Link href={`/elders/${elder.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Alerts</CardTitle>
                  <CardDescription>Latest fraud detection activities</CardDescription>
                </div>
                <Link href="/alerts">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {alert.channel === "Phone" && <Phone className="h-4 w-4 text-muted-foreground" />}
                        {alert.channel === "Email" && <Mail className="h-4 w-4 text-muted-foreground" />}
                        {alert.channel === "Banking" && <CreditCard className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{alert.elderName}</h4>
                        <p className="text-xs text-muted-foreground">{alert.channel}</p>
                      </div>
                      <Badge variant={getRiskBadgeColor(alert.riskLevel)} className="text-xs">
                        {alert.riskLevel}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {getAlertIcon(alert.status)}
                      <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                        {formatTimestamp(alert.timestamp)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{alert.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {alert.audioUrl && (
                      <Button size="sm" variant="outline" className="text-xs" onClick={() => handlePlayAudio(alert.id)}>
                        {playingAudio === alert.id ? (
                          <Pause className="h-3 w-3 mr-1" />
                        ) : (
                          <Play className="h-3 w-3 mr-1" />
                        )}
                        {playingAudio === alert.id ? "Playing..." : "Play Audio"}
                      </Button>
                    )}
                    {alert.status === "new" && (
                      <>
                        <Button size="sm" variant="outline" className="text-xs" onClick={() => resolveAlert(alert.id)}>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Mark Safe
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="text-xs"
                          onClick={() => escalateAlert(alert.id)}
                        >
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Escalate
                        </Button>
                      </>
                    )}
                    <Dialog
                      open={noteDialog.open && noteDialog.alertId === alert.id}
                      onOpenChange={(open) => setNoteDialog({ open, alertId: open ? alert.id : "" })}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-xs">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Add Note
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Note to Alert</DialogTitle>
                          <DialogDescription>Add additional information or context about this alert.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="note">Note</Label>
                            <Textarea
                              id="note"
                              placeholder="Enter your note here..."
                              value={newNote}
                              onChange={(e) => setNewNote(e.target.value)}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setNoteDialog({ open: false, alertId: "" })}>
                              Cancel
                            </Button>
                            <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                              Add Note
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-muted-foreground">No recent alerts</p>
                  <p className="text-sm text-muted-foreground">Your loved ones are safe</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
