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

// Type definitions for monitoring services
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

// Mock data with proper typing
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

  /**
   * Toggle service status between active and inactive
   * @param serviceId - The ID of the service to toggle
   */
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

  /**
   * Get color class for service status
   * @param status - The status of the service
   * @returns CSS color class
   */
  const getStatusColor = (status: string): string => {
    return status === "active" ? "text-green-600" : "text-gray-400"
  }

  /**
   * Get badge variant for alert risk level
   * @param type - The type/risk level of the alert
   * @returns Badge variant
   */
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

  /**
   * Format timestamp for display
   * @param timestamp - ISO timestamp string
   * @returns Formatted date string
   */
  const formatTimestamp = (timestamp: string): string => {
    try {
      return new Date(timestamp).toLocaleString()
    } catch (error) {
      console.error("Error formatting timestamp:", error)
      return "Invalid date"
    }
  }

  /**
   * Handle connecting a new service
   */
  const handleConnectService = () => {
    // In production, this would open a service connection wizard
    console.log("Opening service connection wizard...")
  }

  /**
   * Handle marking an alert as resolved
   * @param alertId - The ID of the alert to resolve
   */
  const handleResolveAlert = (alertId: string) => {
    // In production, this would call an API to update the alert status
    console.log(`Resolving alert ${alertId}`)
  }

  /**
   * Handle escalating an alert
   * @param alertId - The ID of the alert to escalate
   */
  const handleEscalateAlert = (alertId: string) => {
    // In production, this would trigger escalation workflow
    console.log(`Escalating alert ${alertId}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading monitoring services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Service Monitoring</h1>
            <p className="text-gray-600">Manage protection across all connected services</p>
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
                <Card key={service.id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-lg bg-gray-100">
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
                        <ul className="text-sm text-gray-600 space-y-1">
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
                          <span className="text-gray-600">Status:</span>
                          <span className={getStatusColor(service.status)}>
                            {service.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Last Check:</span>
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
                    <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No alerts at this time</p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 border rounded-lg transition-colors ${
                        alert.resolved ? "bg-gray-50 border-gray-200" : "bg-white border-gray-300"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start justify-between mb-2 gap-2">
                        <div className="flex items-center space-x-3">
                          <Badge variant={getRiskBadgeColor(alert.type)}>{alert.type}</Badge>
                          <span className="text-sm font-medium">{alert.service}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-600">{alert.elder}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {alert.resolved && <CheckCircle className="h-4 w-4 text-green-600" />}
                          <span className="text-xs text-gray-500">{formatTimestamp(alert.timestamp)}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{alert.message}</p>
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
                        <p className="text-sm text-gray-600">Get instant alerts for critical threats</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Daily summary emails</p>
                        <p className="text-sm text-gray-600">Receive daily monitoring reports</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">SMS alerts for critical threats</p>
                        <p className="text-sm text-gray-600">Send SMS for high-priority alerts</p>
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
                        <p className="text-sm text-gray-600">
                          Detect more potential threats (may increase false positives)
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Learning mode</p>
                        <p className="text-sm text-gray-600">Allow AI to learn from your feedback</p>
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
                        <p className="text-sm text-gray-600">Retain alerts for analysis and reporting</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Auto-delete resolved alerts</p>
                        <p className="text-sm text-gray-600">Automatically remove resolved alerts after 30 days</p>
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
