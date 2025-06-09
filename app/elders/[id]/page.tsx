"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Phone, Mail, Calendar, Play, Pause, Settings } from "lucide-react"
import Navbar from "@/components/navbar"

// Mock data - in real app, fetch from GET /api/elders/:elderId and /api/voice-logs/:elderId
const mockElder = {
  id: "1",
  name: "Margaret Johnson",
  photoURL: "/placeholder.svg?height=80&width=80",
  phoneNumber: "+1-555-0123",
  age: 78,
  relationship: "Mother",
  preferences: {
    preferredLanguage: "English",
    timeZone: "EST",
  },
}

const mockVoiceLogs = [
  {
    id: "1",
    transcript:
      "We detected a suspicious call. The caller was asking for your Social Security number and bank account details. This appears to be a scam attempt.",
    audioUrl: "#",
    riskLevel: "Critical",
    timestamp: "2024-01-15T14:30:00Z",
    duration: "2:34",
  },
  {
    id: "2",
    transcript:
      "A caller mentioned Medicare benefits and asked for personal information. We're monitoring this as potentially suspicious.",
    audioUrl: "#",
    riskLevel: "Warning",
    timestamp: "2024-01-15T10:15:00Z",
    duration: "1:45",
  },
  {
    id: "3",
    transcript: "Regular family call detected. No suspicious activity identified.",
    audioUrl: "#",
    riskLevel: "Safe",
    timestamp: "2024-01-14T16:20:00Z",
    duration: "0:30",
  },
]

export default function ElderDetailPage() {
  const params = useParams()
  const [elder] = useState(mockElder)
  const [voiceLogs] = useState(mockVoiceLogs)
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

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
      return new Date(timestamp).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    } catch (error) {
      console.error("Error formatting timestamp:", error)
      return "Invalid date"
    }
  }

  const handlePlayAudio = (logId: string) => {
    if (playingAudio === logId) {
      setPlayingAudio(null)
    } else {
      setPlayingAudio(logId)
      // In real app, play actual audio file
      setTimeout(() => setPlayingAudio(null), 3000) // Mock audio duration
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Elder Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={elder.photoURL || "/placeholder.svg"} alt={elder.name} />
                  <AvatarFallback className="text-lg">
                    {elder.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{elder.name}</h1>
                  <p className="text-gray-600 mb-2">
                    {elder.relationship} • Age {elder.age}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {elder.phoneNumber}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {elder.preferences.timeZone}
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="voice-logs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="voice-logs">Voice Logs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="contacts">Trusted Contacts</TabsTrigger>
          </TabsList>

          <TabsContent value="voice-logs">
            <Card>
              <CardHeader>
                <CardTitle>Voice Detection Logs</CardTitle>
                <CardDescription>All voice interactions and fraud detection results for {elder.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {voiceLogs.map((log) => (
                  <div key={log.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Badge variant={getRiskBadgeColor(log.riskLevel)}>{log.riskLevel}</Badge>
                        <span className="text-xs text-gray-500">
                          {isClient ? formatTimestamp(log.timestamp) : log.timestamp}
                        </span>
                        <span className="text-sm text-gray-500">Duration: {log.duration}</span>
                      </div>
                      {log.riskLevel === "Critical" && <AlertTriangle className="h-5 w-5 text-red-500" />}
                    </div>

                    <p className="text-gray-700 mb-4">{log.transcript}</p>

                    <div className="flex items-center space-x-3">
                      <Button size="sm" variant="outline" onClick={() => handlePlayAudio(log.id)}>
                        {playingAudio === log.id ? (
                          <Pause className="h-3 w-3 mr-1" />
                        ) : (
                          <Play className="h-3 w-3 mr-1" />
                        )}
                        {playingAudio === log.id ? "Playing..." : "Play Audio"}
                      </Button>

                      {log.riskLevel !== "Safe" && (
                        <>
                          <Button size="sm" variant="outline">
                            Mark as Safe
                          </Button>
                          {log.riskLevel === "Critical" && (
                            <Button size="sm" variant="destructive">
                              Escalate Alert
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Protection Settings</CardTitle>
                <CardDescription>Configure monitoring and alert preferences for {elder.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Alert Preferences</h3>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span>Send SMS alerts for critical threats</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span>Send email alerts for all threats</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Call me immediately for critical threats</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Monitoring Settings</h3>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span>Monitor all incoming calls</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span>Enable voice AI verification</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Record suspicious calls (with consent)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle>Trusted Contacts</CardTitle>
                <CardDescription>Manage who receives alerts about {elder.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">John Doe (You)</p>
                        <p className="text-sm text-gray-500">john@example.com</p>
                      </div>
                    </div>
                    <Badge>Primary</Badge>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Invite Trusted Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}