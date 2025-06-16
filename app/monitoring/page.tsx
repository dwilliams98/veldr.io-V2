"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Phone,
  Mail,
  CreditCard,
  Shield,
  AlertTriangle,
  CheckCircle,
  Settings,
  Plus,
  ExternalLink,
  Database,
  Globe,
} from "lucide-react"
import Navbar from "@/components/navbar"

interface MonitoringService {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  status: "active" | "inactive"
  alerts: number
  lastCheck: string
  features: string[]
  connected: boolean
}

interface ServiceAlert {
  id: string
  service: string
  elder: string
  type: "Critical" | "Warning" | "Info"
  message: string
  timestamp: string
  resolved: boolean
}

const mockMonitoringServices: MonitoringService[] = [
  {
    id: "phone",
    name: "Phone Call Monitoring",
    description: "AI-powered detection of suspicious calls and voice verification",
    icon: Phone,
    status: "active",
    alerts: 2,
    lastCheck: "2 minutes ago",
    features: ["Real-time call analysis", "Voice AI verification", "Scam pattern detection"],
    connected: true,
  },
  {
    id: "email",
    name: "Email Protection",
    description: "Monitor emails for phishing attempts and suspicious content",
    icon: Mail,
    status: "active",
    alerts: 1,
    lastCheck: "5 minutes ago",
    features: ["Phishing detection", "Suspicious link analysis", "Sender verification"],
    connected: true,
  },
  {
    id: "banking",
    name: "Banking & Financial",
    description: "Monitor bank accounts and credit cards for unusual activity",
    icon: CreditCard,
    status: "active",
    alerts: 1,
    lastCheck: "1 hour ago",
    features: ["Transaction monitoring", "Unusual spending alerts", "Account access tracking"],
    connected: true,
  },
  {
    id: "social",
    name: "Social Media Monitoring",
    description: "Track social media accounts for suspicious activity and scams",
    icon: Globe,
    status: "inactive",
    alerts: 0,
    lastCheck: "Not connected",
    features: ["Profile monitoring", "Suspicious message detection", "Privacy breach alerts"],
    connected: false,
  },
  {
    id: "databreach",
    name: "Data Breach Monitoring",
    description: "Monitor for personal information in data breaches and leaks",
    icon: Database,
    status: "active",
    alerts: 1,
    lastCheck: "6 hours ago",
    features: ["Dark web monitoring", "Breach notifications", "Identity theft alerts"],
    connected: true,
  },
]

const mockRecentAlerts: ServiceAlert[] = [
  {
    id: "1",
    service: "Phone",
    elder: "Margaret Johnson",
    type: "Critical",
    message: "Suspicious caller requesting Social Security information",
    timestamp: "2024-01-15T14:30:00Z",
    resolved: false,
  },
  {
    id: "2",
    service: "Banking",
    elder: "Robert Smith",
    type: "Critical",
    message: "Unusual wire transfer attempt of $2,500",
    timestamp: "2024-01-15T09:45:00Z",
    resolved: false,
  },
  {
    id: "3",
    service: "Email",
    elder: "Margaret Johnson",
    type: "Warning",
    message: "Phishing email claiming to be from Medicare",
    timestamp: "2024-01-15T12:15:00Z",
    resolved: true,
  },
  {
    id: "4",
    service: "Data Breach",
    elder: "Margaret Johnson",
    type: "Warning",
    message: "Personal info found in healthcare data breach",
    timestamp: "2024-01-14T18:20:00Z",
    resolved: false,
  },
]

export default function MonitoringPage() {
  const [services, setServices] = useState<MonitoringService[]>(mockMonitoringServices)
  const [alerts] = useState<ServiceAlert[]>(mockRecentAlerts)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("services")
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("veldr_token")
      if (!token) {
        router.push("/login")
        return
      }
    }

    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [router])

  const toggleService = (serviceId: string) => {
    setServices((prevServices) =>
      prevServices.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              status: service.status === "active" ? "inactive" : "active",
              lastCheck: service.status === "inactive" ? new Date().toLocaleString() : service.lastCheck,
            }
          : service,
      ),
    )
  }

  const getStatusColor = (status: string): string => {
    return status === "active" ? "text-green-600" : "text-muted-foreground"
  }

  const getRiskBadgeColor = (type: string) => {
    switch (type) {
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

  const formatTimestamp = (timestamp: string): string => {
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

  const handleConnectService = () => {
    router.push("/monitoring/connect")
  }

  const handleResolveAlert = (alertId: string) => {
    console.log(`Resolving alert ${alertId}`)
  }

  const handleEscalateAlert = (alertId: string) => {
    console.log(`Escalating alert ${alertId}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading monitoring services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Service Monitoring</h1>
            <p className="text-muted-foreground">Manage protection across all connected services</p>
          </div>
          <Button onClick={handleConnectService}>
            <Plus className="h-4 w-4 mr-2" />
            Connect Service
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services">Connected Services</TabsTrigger>
            <TabsTrigger value="alerts">All Alerts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-6">
            <div className="grid gap-6">
              {services.map((service) => (
                <Card key={service.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-lg bg-muted">
                          <service.icon className={`h-6 w-6 ${getStatusColor(service.status)}`} />
                        </div>
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            <span>{service.name}</span>
                            {service.status === "active" && <CheckCircle className="h-4 w-4 text-green-600" />}
                          </CardTitle>
                          <CardDescription>{service.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {service.alerts > 0 && <Badge variant="destructive">{service.alerts} alerts</Badge>}
                        <Switch
                          checked={service.status === "active"}
                          onCheckedChange={() => toggleService(service.id)}
                          disabled={!service.connected}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Features</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {service.features.map((feature, index) => (
                            <li key={`${service.id}-feature-${index}`} className="flex items-center">
                              <CheckCircle className="h-3 w-3 text-green-600 mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Status:</span>
                          <span className={getStatusColor(service.status)}>
                            {service.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Last Check:</span>
                          <span>{service.lastCheck}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline">
                            <Settings className="h-3 w-3 mr-1" />
                            Configure
                          </Button>
                          {service.connected && (
                            <Button size="sm" variant="outline">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Service Alerts</CardTitle>
                <CardDescription>Comprehensive view of alerts across all monitoring services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {alerts.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No alerts at this time</p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 border rounded-lg transition-colors hover:shadow-sm ${
                        alert.resolved ? "bg-muted/50 border-border" : "bg-card border-border"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start justify-between mb-2 gap-2">
                        <div className="flex items-center space-x-3">
                          <Badge variant={getRiskBadgeColor(alert.type)}>{alert.type}</Badge>
                          <span className="text-sm font-medium">{alert.service}</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{alert.elder}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {alert.resolved && <CheckCircle className="h-4 w-4 text-green-600" />}
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(alert.timestamp)}
                          </span>
                        </div>
                      </div>
                      <p className="text-foreground mb-3">{alert.message}</p>
                      {!alert.resolved && (
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleResolveAlert(alert.id)}>
                            Mark Resolved
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleEscalateAlert(alert.id)}>
                            Escalate
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Monitoring Settings</CardTitle>
                <CardDescription>Configure global monitoring preferences and thresholds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Alert Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Real-time notifications</p>
                        <p className="text-sm text-muted-foreground">Get instant alerts for critical threats</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Daily summary emails</p>
                        <p className="text-sm text-muted-foreground">Receive daily monitoring reports</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">SMS alerts for critical threats</p>
                        <p className="text-sm text-muted-foreground">Send SMS for high-priority alerts</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Monitoring Sensitivity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">High sensitivity mode</p>
                        <p className="text-sm text-muted-foreground">
                          Detect more potential threats (may increase false positives)
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Learning mode</p>
                        <p className="text-sm text-muted-foreground">Allow AI to learn from your feedback</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Data Retention</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Keep alert history</p>
                        <p className="text-sm text-muted-foreground">Retain alerts for analysis and reporting</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Auto-delete resolved alerts</p>
                        <p className="text-sm text-muted-foreground">Automatically remove resolved alerts after 30 days</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}