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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
  Phone,
  Mail,
  CreditCard,
  Database,
  Globe,
  Search,
  CheckCircle,
  Clock,
  Volume2,
  MoreVertical,
  Archive,
  Flag,
  RefreshCw,
  Download,
  Eye,
  AlertCircle,
  Info,
  Pause,
  MessageSquare,
} from "lucide-react"
import Navbar from "@/components/navbar"
import { useApp } from "@/contexts/app-context"

export default function AlertsPage() {
  const { alerts, resolveAlert, escalateAlert, archiveAlert, addNote, refreshData, exportData } = useApp()
  const [filteredAlerts, setFilteredAlerts] = useState(alerts)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterChannel, setFilterChannel] = useState<string>("all")
  const [filterRisk, setFilterRisk] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("timestamp")
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)
  const [noteDialog, setNoteDialog] = useState<{ open: boolean; alertId: string }>({ open: false, alertId: "" })
  const [newNote, setNewNote] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("veldr_token")
    if (!token) {
      router.push("/login")
      return
    }

    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [router])

  useEffect(() => {
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
      filtered = filtered.filter((alert) => alert.status === filterStatus)
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
      } else if (activeTab === "unresolved") {
        filtered = filtered.filter((alert) => !alert.resolved)
      }
    }

    // Sort alerts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "timestamp":
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "elder":
          return a.elderName.localeCompare(b.elderName)
        default:
          return 0
      }
    })

    setFilteredAlerts(filtered)
  }, [alerts, searchTerm, filterChannel, filterRisk, filterStatus, activeTab, sortBy])

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "reviewed":
        return <Eye className="h-4 w-4 text-yellow-500" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
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
      const now = new Date()
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

      if (diffInHours < 1) {
        return "Just now"
      } else if (diffInHours < 24) {
        return `${diffInHours}h ago`
      } else {
        const options: Intl.DateTimeFormatOptions = {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        }
        return date.toLocaleString("en-US", options)
      }
    } catch (error) {
      console.error("Error formatting timestamp:", error)
      return "Invalid date"
    }
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

  const handleExport = () => {
    exportData("alerts")
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
  const unresolvedAlerts = alerts.filter((alert) => !alert.resolved)

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Security Alerts</h1>
              <p className="text-muted-foreground">Monitor and manage fraud detection alerts across all channels</p>
            </div>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Refresh alerts</TooltipContent>
              </Tooltip>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{alerts.length}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical</CardTitle>
                <Flag className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{criticalAlerts.length}</div>
                <p className="text-xs text-muted-foreground">Unresolved</p>
                {criticalAlerts.length > 0 && <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500"></div>}
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Escalated</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{escalatedAlerts.length}</div>
                <p className="text-xs text-muted-foreground">Needs attention</p>
                {escalatedAlerts.length > 0 && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500"></div>
                )}
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
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
                  <Select value={filterChannel} onValueChange={setFilterChannel}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Channels</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="banking">Banking</SelectItem>
                      <SelectItem value="social media">Social Media</SelectItem>
                      <SelectItem value="data breach">Data Breach</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterRisk} onValueChange={setFilterRisk}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Risk" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Risk</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="timestamp">Time</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                      <SelectItem value="elder">Elder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all" className="relative">
                All Alerts
                <Badge variant="secondary" className="ml-2 text-xs">
                  {alerts.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="unresolved" className="relative">
                Unresolved
                <Badge variant="destructive" className="ml-2 text-xs">
                  {unresolvedAlerts.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="critical" className="relative">
                Critical
                <Badge variant="destructive" className="ml-2 text-xs">
                  {criticalAlerts.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="escalated" className="relative">
                Escalated
                <Badge variant="secondary" className="ml-2 text-xs">
                  {escalatedAlerts.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="recent" className="relative">
                Recent
                <Badge variant="outline" className="ml-2 text-xs">
                  {recentAlerts.length}
                </Badge>
              </TabsTrigger>
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
                        alert.resolved ? "bg-muted/30 border-border" : "bg-card border-border"
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
                                <div className="flex items-center space-x-2 flex-wrap">
                                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                                  <Badge variant={getRiskBadgeColor(alert.riskLevel)}>{alert.riskLevel}</Badge>
                                  <Badge variant="outline">{alert.channel}</Badge>
                                  {alert.escalated && <Badge variant="destructive">Escalated</Badge>}
                                  <div className="flex items-center gap-1">
                                    {getStatusIcon(alert.status)}
                                    <span className="text-xs text-muted-foreground capitalize">{alert.status}</span>
                                  </div>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {!alert.resolved && (
                                      <DropdownMenuItem onClick={() => resolveAlert(alert.id)}>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Mark Resolved
                                      </DropdownMenuItem>
                                    )}
                                    {!alert.escalated && !alert.resolved && (
                                      <DropdownMenuItem onClick={() => escalateAlert(alert.id)}>
                                        <Flag className="h-4 w-4 mr-2" />
                                        Escalate
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => archiveAlert(alert.id)}>
                                      <Archive className="h-4 w-4 mr-2" />
                                      Archive
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              <h3 className="font-semibold text-lg mb-1">{alert.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                <strong>{alert.elderName}</strong> •{" "}
                                <span className="text-xs text-muted-foreground" suppressHydrationWarning>
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
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full lg:w-auto"
                                    onClick={() => handlePlayAudio(alert.id)}
                                  >
                                    {playingAudio === alert.id ? (
                                      <Pause className="h-3 w-3 mr-1" />
                                    ) : (
                                      <Volume2 className="h-3 w-3 mr-1" />
                                    )}
                                    {playingAudio === alert.id ? "Playing..." : "Play Audio"}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Listen to call recording</TooltipContent>
                              </Tooltip>
                            )}
                            {!alert.resolved && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => resolveAlert(alert.id)}
                                  className="w-full lg:w-auto"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Mark Safe
                                </Button>
                                {!alert.escalated && (
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => escalateAlert(alert.id)}
                                    className="w-full lg:w-auto"
                                  >
                                    <Flag className="h-3 w-3 mr-1" />
                                    Escalate
                                  </Button>
                                )}
                              </>
                            )}
                            <Dialog
                              open={noteDialog.open && noteDialog.alertId === alert.id}
                              onOpenChange={(open) => setNoteDialog({ open, alertId: open ? alert.id : "" })}
                            >
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" className="w-full lg:w-auto">
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  Add Note
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Add Note to Alert</DialogTitle>
                                  <DialogDescription>
                                    Add additional information or context about this alert.
                                  </DialogDescription>
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
                                    <Button
                                      variant="outline"
                                      onClick={() => setNoteDialog({ open: false, alertId: "" })}
                                    >
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
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </TooltipProvider>
  )
}
