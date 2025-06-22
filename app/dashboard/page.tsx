"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertTriangle, Users, Plus, Phone, Clock, Volume2, Mail, CreditCard, MessageCircle } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import Navbar from "@/components/navbar"
import VoiceAssistant from "@/components/voice-assistant"

// Service interfaces for type safety
interface MonitoringService {
  name: string
  status: "Active" | "Inactive"
  alerts: number
  icon: React.ComponentType<{ className?: string }>
  color: string
}

interface Elder {
  id: string
  name: string
  photoURL: string
  phoneNumber: string
  age: number
  relationship: string
  recentAlerts: number
  lastActivity: string
}

interface Alert {
  id: string
  elderName: string
  serviceType: string
  riskLevel: "Critical" | "Warning" | "Safe"
  transcript: string
  timestamp: string
  audioUrl: string | null
  icon: React.ComponentType<{ className?: string }>
}

// Mock data with proper typing
const mockElders: Elder[] = [
  {
    id: "1",
    name: "Margaret Johnson",
    photoURL: "/placeholder.svg?height=40&width=40",
    phoneNumber: "+1-555-0123",
    age: 78,
    relationship: "Mother",
    recentAlerts: 2,
    lastActivity: "2 hours ago",
  },
  {
    id: "2",
    name: "Robert Smith",
    photoURL: "/placeholder.svg?height=40&width=40",
    phoneNumber: "+1-555-0456",
    age: 82,
    relationship: "Father-in-law",
    recentAlerts: 0,
    lastActivity: "1 day ago",
  },
]

const mockRecentAlerts: Alert[] = [
  {
    id: "1",
    elderName: "Margaret Johnson",
    serviceType: "Phone",
    riskLevel: "Critical",
    transcript: "Caller asking for Social Security number and bank details",
    timestamp: "2024-01-15T14:30:00Z",
    audioUrl: "#",
    icon: Phone,
  },
  {
    id: "2",
    elderName: "Margaret Johnson",
    serviceType: "Email",
    riskLevel: "Warning",
    transcript: "Suspicious email claiming to be from Medicare requesting personal information",
    timestamp: "2024-01-15T12:15:00Z",
    audioUrl: null,
    icon: Mail,
  },
  {
    id: "3",
    elderName: "Robert Smith",
    serviceType: "Banking",
    riskLevel: "Critical",
    transcript: "Unusual transaction attempt: $2,500 wire transfer to unknown account",
    timestamp: "2024-01-15T09:45:00Z",
    audioUrl: null,
    icon: CreditCard,
  },
]

const mockServices: MonitoringService[] = [
  { name: "Phone Monitoring", status: "Active", alerts: 2, icon: Phone, color: "text-purple-600" },
  { name: "Email Protection", status: "Active", alerts: 1, icon: Mail, color: "text-green-600" },
  { name: "Banking & Financial", status: "Active", alerts: 1, icon: CreditCard, color: "text-pink-600" },
  { name: "Social Media Monitoring", status: "Inactive", alerts: 0, icon: Users, color: "text-muted-foreground" },
  { name: "Data Breach Monitor", status: "Active", alerts: 1, icon: AlertTriangle, color: "text-orange-600" },
]

export default function Dashboard() {
  const [elders] = useState<Elder[]>(mockElders)
  const [alerts] = useState<Alert[]>(mockRecentAlerts)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [displayTimestamps, setDisplayTimestamps] = useState<Record<string, string>>({})
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false)
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

    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [router])

  useEffect(() => {
    // Initialize display timestamps with raw timestamps, then format them
    const timestamps: Record<string, string> = {}
    alerts.forEach((alert) => {
      timestamps[alert.id] = alert.timestamp
    })
    setDisplayTimestamps(timestamps)

    // Format timestamps after initial render
    const timer = setTimeout(() => {
      const formattedTimestamps: Record<string, string> = {}
      alerts.forEach((alert) => {
        formattedTimestamps[alert.id] = formatTimestamp(alert.timestamp)
      })
      setDisplayTimestamps(formattedTimestamps)
    }, 0)

    return () => clearTimeout(timer)
  }, [alerts])

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

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      return format(date, 'MMM dd, yyyy HH:mm')
    } catch (error) {
      console.error("Error formatting timestamp:", error)
      return "Invalid date"
    }
  }

  const handleVoiceIntentDetected = (intent: string) => {
    // Handle different intents from voice assistant
    switch (intent) {
      case 'fraud_alert':
        // Navigate to alerts page
        router.push('/alerts')
        break
      case 'support':
        // Navigate to support page
        router.push('/support')
        break
      case 'emergency':
        // Show emergency modal or redirect
        alert('Emergency detected! Redirecting to emergency support...')
        router.push('/support')
        break
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-3 mobile:px-4 py-4 mobile:py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 mobile:mb-8 gap-3 mobile:gap-4">
          <div>
            <h1 className="text-2xl mobile:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-sm mobile:text-base text-muted-foreground">Monitor and protect your loved ones</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setShowVoiceAssistant(!showVoiceAssistant)}
              className="w-full sm:w-auto border-purple-200 hover:bg-purple-50"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {showVoiceAssistant ? 'Hide' : 'Show'} AI Assistant
            </Button>
            <Link href="/elders/new">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Elder
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className={`${showVoiceAssistant ? 'xl:col-span-3' : 'xl:col-span-4'} space-y-6`}>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 mobile-lg:grid-cols-2 lg:grid-cols-3 gap-4 mobile:gap-6">
              <Card className="hover:shadow-md transition-shadow border-purple-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Protected Elders</CardTitle>
                  <Users className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-700">{elders.length}</div>
                  <p className="text-xs text-muted-foreground">Active monitoring</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow border-purple-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recent Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-700">{alerts.length}</div>
                  <p className="text-xs text-muted-foreground">Last 24 hours</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow mobile-lg:col-span-2 lg:col-span-1 border-purple-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Protection Status</CardTitle>
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"></div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Active</div>
                  <p className="text-xs text-muted-foreground">All systems operational</p>
                </CardContent>
              </Card>
            </div>

            {/* Service Monitoring Overview */}
            <Card className="hover:shadow-md transition-shadow border-purple-100">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-lg mobile:text-xl text-purple-800">Service Monitoring</CardTitle>
                    <CardDescription className="text-sm mobile:text-base">Connected protection services across all platforms</CardDescription>
                  </div>
                  <Link href="/monitoring">
                    <Button variant="outline" className="w-full sm:w-auto border-purple-200 hover:bg-purple-50">
                      Manage Services
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 mobile-lg:grid-cols-3 lg:grid-cols-5 gap-3 mobile:gap-4">
                  {mockServices.map((service, index) => (
                    <div key={`service-${index}`} className="text-center p-3 mobile:p-4 border border-purple-100 rounded-lg hover:shadow-sm hover:border-purple-200 transition-all">
                      <service.icon className={`h-6 w-6 mobile:h-8 mobile:w-8 mx-auto mb-2 ${service.color}`} />
                      <h3 className="font-medium text-xs mobile:text-sm leading-tight text-purple-800">{service.name}</h3>
                      <p className={`text-xs mt-1 ${service.status === "Active" ? "text-green-600" : "text-muted-foreground"}`}>
                        {service.status}
                      </p>
                      {service.alerts > 0 && (
                        <Badge variant="destructive" className="mt-1 text-xs">
                          {service.alerts} alerts
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mobile:gap-8">
              {/* Elder Profiles */}
              <Card className="hover:shadow-md transition-shadow border-purple-100">
                <CardHeader>
                  <CardTitle className="text-lg mobile:text-xl text-purple-800">Protected Elders</CardTitle>
                  <CardDescription className="text-sm mobile:text-base">Manage your loved ones&apos; protection settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {elders.map((elder) => (
                    <div key={elder.id} className="flex items-center justify-between p-3 mobile:p-4 border border-purple-100 rounded-lg hover:shadow-sm hover:border-purple-200 transition-all">
                      <div className="flex items-center space-x-3 mobile:space-x-4 min-w-0 flex-1">
                        <Avatar className="h-10 w-10 mobile:h-12 mobile:w-12 flex-shrink-0 ring-2 ring-purple-100">
                          <AvatarImage src={elder.photoURL || "/placeholder.svg"} alt={elder.name} />
                          <AvatarFallback className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
                            {elder.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-sm mobile:text-base truncate text-purple-800">{elder.name}</h3>
                          <p className="text-xs mobile:text-sm text-muted-foreground">
                            {elder.relationship} • Age {elder.age}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs text-muted-foreground truncate">{elder.phoneNumber}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        {elder.recentAlerts > 0 && (
                          <Badge variant="destructive" className="mb-2 text-xs">
                            {elder.recentAlerts} alerts
                          </Badge>
                        )}
                        <p className="text-xs text-muted-foreground mb-2">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {elder.lastActivity}
                        </p>
                        <Link href={`/elders/${elder.id}`}>
                          <Button variant="outline" size="sm" className="text-xs border-purple-200 hover:bg-purple-50">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Alerts */}
              <Card className="hover:shadow-md transition-shadow border-purple-100">
                <CardHeader>
                  <CardTitle className="text-lg mobile:text-xl text-purple-800">Recent Alerts</CardTitle>
                  <CardDescription className="text-sm mobile:text-base">Latest fraud detection activities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="p-3 mobile:p-4 border border-purple-100 rounded-lg hover:shadow-sm hover:border-purple-200 transition-all">
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <alert.icon className="h-4 w-4 text-purple-600 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-sm mobile:text-base truncate text-purple-800">{alert.elderName}</h4>
                            <p className="text-xs text-muted-foreground">{alert.serviceType}</p>
                          </div>
                          <Badge variant={getRiskBadgeColor(alert.riskLevel)} className="text-xs flex-shrink-0">
                            {alert.riskLevel}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {displayTimestamps[alert.id] || alert.timestamp}
                        </span>
                      </div>
                      <p className="text-xs mobile:text-sm text-muted-foreground mb-3 line-clamp-2">{alert.transcript}</p>
                      <div className="flex flex-wrap gap-2">
                        {alert.audioUrl && (
                          <Button size="sm" variant="outline" className="text-xs border-purple-200 hover:bg-purple-50">
                            <Volume2 className="h-3 w-3 mr-1" />
                            Play Audio
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="text-xs border-green-200 hover:bg-green-50 text-green-700">
                          Mark Safe
                        </Button>
                        <Button size="sm" variant="destructive" className="text-xs">
                          Escalate
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Voice Assistant Sidebar */}
          {showVoiceAssistant && (
            <div className="xl:col-span-1">
              <VoiceAssistant
                userType="caregiver"
                onIntentDetected={handleVoiceIntentDetected}
                className="h-[800px] sticky top-4 border-purple-200"
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}