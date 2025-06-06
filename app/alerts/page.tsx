"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertTriangle,
  Shield,
  Phone,
  Mail,
  CreditCard,
  Database,
  Globe,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Volume2,
  ExternalLink,
  MoreVertical,
  Archive,
  Flag,
} from "lucide-react"
import Navbar from "@/components/navbar"

// Type definitions for Alert management
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
  metadata: Record<string, any>
  assignedTo?: string
  notes: string[]
}

// Mock comprehensive alerts data
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
    metadata: {
      callerNumber: "+1-800-555-SCAM",
      duration: "2:34",
      confidence: 0.95,
      keywords: ["Social Security", "bank account", "urgent"],
    },
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
    metadata: {
      amount: 2500,
      recipientAccount: "****7892",
      bank: "Chase Bank",
      blocked: true,
      location: "Unknown",
    },
    notes: ["Contacted elder - confirmed not authorized", "Bank notified and account secured"],
  },
  {
    id: "3",
    elderId: "1",
    elderName: "Margaret Johnson",
    elderPhoto: "/placeholder.svg?height=40&width=40",
    channel: "Email",
    riskLevel: "Warning",
    title: "Phishing Email Detected",
    description: "Suspicious email claiming to be from Medicare",
    timestamp: "2024-01-15T12:15:00Z",
    resolved: true,
    escalated: false,
    metadata: {
      sender: "medicare-benefits@fake-domain.com",
      subject: "Urgent: Verify Your Medicare Benefits",
      maliciousLinks: 3,
      quarantined: true,
    },
    notes: ["Email automatically quarantined", "Elder notified about phishing attempt"],
  },
  {
    id: "4",
    elderId: "1",
    elderName: "Margaret Johnson",
    elderPhoto: "/placeholder.svg?height=40&width=40",
    channel: "Data Breach",
    riskLevel: "Warning",
    title: "Personal Information in Data Breach",
    description: "Email and phone number found in healthcare data breach",
    timestamp: "2024-01-14T18:20:00Z",
    resolved: false,
    escalated: false,
    metadata: {
      breachSource: "MedCorp Healthcare",
      exposedData: ["email", "phone", "patient_id"],
      affectedRecords: 50000,
      breachDate: "2024-01-10T00:00:00Z",
    },
    notes: ["Recommended password changes", "Credit monitoring activated"],
  },
  {
    id: "5",
    elderId: "3",
    elderName: "Dorothy Williams",
    elderPhoto: "/placeholder.svg?height=40&width=40",
    channel: "Social Media",
    riskLevel: "Info",
    title: "Privacy Settings Updated",
    description: "Facebook privacy settings were automatically adjusted",
    timestamp: "2024-01-14T10:30:00Z",
    resolved: true,
    escalated: false,
    metadata: {
      platform: "Facebook",
      changes: ["Profile visibility", "Friend request settings"],
      reason: "Suspicious friend requests detected",
    },
    notes: ["Settings updated automatically", "Elder notified of changes"],
  },
]

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>(mockAlerts)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterChannel, setFilterChannel] = useState<string>("all")
  const [filterRisk, setFilterRisk] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "unresolved" | "resolved">("all")
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    // Check authentication
    const token = localStorage.getItem("veldr_token")
    if (!token) {
      router.push("/login")
      return
    }

    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [router, isClient])

  useEffect(() => {
    if (!isClient) return

    // Apply filters and search
    let filtered = alerts

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (alert) =>
          alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.elderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Channel filter
    if (filterChannel !== "all") {
      filtered = filtered.filter((alert) => alert.channel.toLowerCase() === filterChannel.toLowerCase())
    }

    // Risk filter
    if (filterRisk !== "all") {
      filtered = filtered.filter((alert) => alert.riskLevel.toLowerCase() === filterRisk.toLowerCase())
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((alert) => {
        if (filterStatus === "resolved") return alert.resolved
        if (filterStatus === "unresolved") return !alert.resolved
        return true
      })
    }

    // Tab filter
    if (activeTab !== "all") {
      if (activeTab === "critical") {
        filtered = filtered.filter((alert) => alert.riskLevel === "Critical")
      } else if (activeTab === "escalated") {
        filtered = filtered.filter((alert) => alert.escalated)
      } else if (activeTab === "recent") {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
        filtered = filtered.filter((alert) => new Date(alert.timestamp) > oneDayAgo)
      }
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    setFilteredAlerts(filtered)
  }, [alerts, searchTerm, filterChannel, filterRisk, filterStatus, activeTab, isClient])

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "Critical":
        return "destructive"
      case "Warning":
        return "secondary"
      case "Info":
        return "default"
      default:
        return "default"
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "Phone":
        return Phone
      case "Email":
        return Mail
      case "Banking":
        return CreditCard
      case "Social Media":
        return Globe
      case "Data Breach":
        return Database
      default:
        return Shield
    }
  }

  const formatTimestamp = (timestamp: string): string => {
    try {
      const date = new Date(timestamp)
      // Use consistent date formatting for both server and client
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      }
      return date.toLocaleString('en-US', options)
    } catch (error) {
      console.error("Error formatting timestamp:", error)
      return "Invalid date"
    }
  }

  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, resolved: true } : alert)))
  }

  const handleEscalateAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, escalated: true } : alert)))
  }

  const handleArchiveAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }

  if (!isClient) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading alerts...</p>
        </div>
      </div>
    )
  }

  const criticalAlerts = alerts.filter((alert) => alert.riskLevel === "Critical" && !alert.resolved)
  const escalatedAlerts = alerts.filter((alert) => alert.escalated && !alert.resolved)
  const recentAlerts = alerts.filter((alert) => new Date(alert.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000))

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Security Alerts</h1>
            <p className="text-muted-foreground">Monitor and manage fraud detection alerts</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alerts.length}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical</CardTitle>
              <Flag className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{criticalAlerts.length}</div>
              <p className="text-xs text-muted-foreground">Unresolved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Escalated</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{escalatedAlerts.length}</div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{recentAlerts.length}</div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search alerts by title, elder name, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Channel: {filterChannel}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFilterChannel("all")}>All</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterChannel("phone")}>Phone</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterChannel("email")}>Email</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterChannel("banking")}>Banking</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterChannel("social media")}>Social Media</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterChannel("data breach")}>Data Breach</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Risk: {filterRisk}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFilterRisk("all")}>All</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterRisk("critical")}>Critical</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterRisk("warning")}>Warning</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterRisk("info")}>Info</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Status: {filterStatus}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFilterStatus("all")}>All</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("unresolved")}>Unresolved</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("resolved")}>Resolved</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Alerts</TabsTrigger>
            <TabsTrigger value="critical">Critical</TabsTrigger>
            <TabsTrigger value="escalated">Escalated</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No alerts found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || filterChannel !== "all" || filterRisk !== "all" || filterStatus !== "all"
                      ? "Try adjusting your search or filters"
                      : "No alerts match the current criteria"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredAlerts.map((alert) => {
                const IconComponent = getChannelIcon(alert.channel)
                return (
                  <Card
                    key={alert.id}
                    className={`transition-all hover:shadow-md ${
                      alert.resolved ? "bg-muted/50 border-border" : "bg-card border-border"
                    } ${alert.riskLevel === "Critical" && !alert.resolved ? "border-l-4 border-l-red-500" : ""}`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={alert.elderPhoto || "/placeholder.svg"} alt={alert.elderName} />
                            <AvatarFallback>
                              {alert.elderName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <IconComponent className="h-4 w-4 text-muted-foreground" />
                                <Badge variant={getRiskBadgeColor(alert.riskLevel)}>{alert.riskLevel}</Badge>
                                <Badge variant="outline">{alert.channel}</Badge>
                                {alert.escalated && <Badge variant="destructive">Escalated</Badge>}
                                {alert.resolved && <CheckCircle className="h-4 w-4 text-green-600" />}
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {!alert.resolved && (
                                    <DropdownMenuItem onClick={() => handleResolveAlert(alert.id)}>
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Mark Resolved
                                    </DropdownMenuItem>
                                  )}
                                  {!alert.escalated && !alert.resolved && (
                                    <DropdownMenuItem onClick={() => handleEscalateAlert(alert.id)}>
                                      <Flag className="h-4 w-4 mr-2" />
                                      Escalate
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onClick={() => handleArchiveAlert(alert.id)}>
                                    <Archive className="h-4 w-4 mr-2" />
                                    Archive
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <h3 className="font-semibold text-lg mb-1">{alert.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              <strong>{alert.elderName}</strong> • <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                                {formatTimestamp(alert.timestamp)}
                              </span>
                            </p>
                            <p className="text-foreground mb-3">{alert.description}</p>
                            {alert.transcript && (
                              <div className="bg-muted p-3 rounded-lg mb-3">
                                <p className="text-sm text-foreground italic">&quot;{alert.transcript}&quot;</p>
                              </div>
                            )}
                            {alert.notes.length > 0 && (
                              <div className="mb-3">
                                <h4 className="text-sm font-medium mb-1">Notes:</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  {alert.notes.map((note, index) => (
                                    <li key={`${alert.id}-note-${index}`} className="flex items-start">
                                      <span className="w-2 h-2 bg-muted-foreground rounded-full mt-2 mr-2 flex-shrink-0" />
                                      {note}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 lg:w-auto w-full">
                          {alert.audioUrl && (
                            <Button size="sm" variant="outline" className="w-full lg:w-auto">
                              <Volume2 className="h-3 w-3 mr-1" />
                              Play Audio
                            </Button>
                          )}
                          {!alert.resolved && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResolveAlert(alert.id)}
                                className="w-full lg:w-auto"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Mark Safe
                              </Button>
                              {!alert.escalated && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleEscalateAlert(alert.id)}
                                  className="w-full lg:w-auto"
                                >
                                  <Flag className="h-3 w-3 mr-1" />
                                  Escalate
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}