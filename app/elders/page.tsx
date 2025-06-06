"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertTriangle,
  Shield,
  Plus,
  Phone,
  Mail,
  CreditCard,
  Database,
  Globe,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
} from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"

// Type definitions for Elder management
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
  connectedServices: ConnectedService[]
  riskLevel: "Low" | "Medium" | "High"
  status: "Active" | "Inactive"
}

interface ConnectedService {
  type: "phone" | "email" | "banking" | "social" | "databreach"
  name: string
  status: "connected" | "disconnected" | "error"
  alerts: number
  lastCheck: string
}

// Mock data with comprehensive elder profiles
const mockElders: Elder[] = [
  {
    id: "1",
    name: "Margaret Johnson",
    photoURL: "/placeholder.svg?height=80&width=80",
    phoneNumber: "+1-555-0123",
    email: "margaret.johnson@email.com",
    age: 78,
    relationship: "Mother",
    address: "123 Oak Street, Springfield, IL",
    emergencyContact: "John Johnson (+1-555-0124)",
    recentAlerts: 4,
    lastActivity: "2 hours ago",
    riskLevel: "High",
    status: "Active",
    connectedServices: [
      { type: "phone", name: "Phone Monitoring", status: "connected", alerts: 2, lastCheck: "2 min ago" },
      { type: "email", name: "Email Protection", status: "connected", alerts: 1, lastCheck: "5 min ago" },
      { type: "banking", name: "Banking Monitor", status: "connected", alerts: 1, lastCheck: "1 hr ago" },
      { type: "social", name: "Social Media", status: "disconnected", alerts: 0, lastCheck: "Never" },
      { type: "databreach", name: "Data Breach Monitor", status: "connected", alerts: 0, lastCheck: "6 hr ago" },
    ],
  },
  {
    id: "2",
    name: "Robert Smith",
    photoURL: "/placeholder.svg?height=80&width=80",
    phoneNumber: "+1-555-0456",
    email: "robert.smith@email.com",
    age: 82,
    relationship: "Father-in-law",
    address: "456 Pine Avenue, Springfield, IL",
    emergencyContact: "Sarah Smith (+1-555-0457)",
    recentAlerts: 1,
    lastActivity: "1 day ago",
    riskLevel: "Medium",
    status: "Active",
    connectedServices: [
      { type: "phone", name: "Phone Monitoring", status: "connected", alerts: 0, lastCheck: "1 min ago" },
      { type: "email", name: "Email Protection", status: "error", alerts: 0, lastCheck: "2 days ago" },
      { type: "banking", name: "Banking Monitor", status: "connected", alerts: 1, lastCheck: "30 min ago" },
      { type: "social", name: "Social Media", status: "disconnected", alerts: 0, lastCheck: "Never" },
      { type: "databreach", name: "Data Breach Monitor", status: "connected", alerts: 0, lastCheck: "4 hr ago" },
    ],
  },
  {
    id: "3",
    name: "Dorothy Williams",
    photoURL: "/placeholder.svg?height=80&width=80",
    phoneNumber: "+1-555-0789",
    email: "dorothy.williams@email.com",
    age: 75,
    relationship: "Grandmother",
    address: "789 Elm Drive, Springfield, IL",
    emergencyContact: "Michael Williams (+1-555-0790)",
    recentAlerts: 0,
    lastActivity: "3 hours ago",
    riskLevel: "Low",
    status: "Active",
    connectedServices: [
      { type: "phone", name: "Phone Monitoring", status: "connected", alerts: 0, lastCheck: "5 min ago" },
      { type: "email", name: "Email Protection", status: "connected", alerts: 0, lastCheck: "10 min ago" },
      { type: "banking", name: "Banking Monitor", status: "connected", alerts: 0, lastCheck: "2 hr ago" },
      { type: "social", name: "Social Media", status: "connected", alerts: 0, lastCheck: "1 hr ago" },
      { type: "databreach", name: "Data Breach Monitor", status: "connected", alerts: 0, lastCheck: "8 hr ago" },
    ],
  },
]

export default function EldersPage() {
  const [elders, setElders] = useState<Elder[]>(mockElders)
  const [filteredElders, setFilteredElders] = useState<Elder[]>(mockElders)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all")
  const [filterRisk, setFilterRisk] = useState<"all" | "low" | "medium" | "high">("all")
  const [isLoading, setIsLoading] = useState(true)
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
    // Apply filters and search
    let filtered = elders

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (elder) =>
          elder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          elder.relationship.toLowerCase().includes(searchTerm.toLowerCase()) ||
          elder.phoneNumber.includes(searchTerm),
      )
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((elder) => elder.status.toLowerCase() === filterStatus)
    }

    // Risk filter
    if (filterRisk !== "all") {
      filtered = filtered.filter((elder) => elder.riskLevel.toLowerCase() === filterRisk)
    }

    setFilteredElders(filtered)
  }, [elders, searchTerm, filterStatus, filterRisk])

  /**
   * Get badge color for risk level
   * @param riskLevel - The risk level of the elder
   * @returns Badge variant
   */
  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "High":
        return "destructive"
      case "Medium":
        return "secondary"
      case "Low":
        return "default"
      default:
        return "default"
    }
  }

  /**
   * Get service icon component
   * @param serviceType - The type of service
   * @returns Icon component
   */
  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case "phone":
        return Phone
      case "email":
        return Mail
      case "banking":
        return CreditCard
      case "social":
        return Globe
      case "databreach":
        return Database
      default:
        return Shield
    }
  }

  /**
   * Get service status color
   * @param status - The status of the service
   * @returns CSS color class
   */
  const getServiceStatusColor = (status: string): string => {
    switch (status) {
      case "connected":
        return "text-green-600"
      case "error":
        return "text-red-600"
      case "disconnected":
        return "text-muted-foreground"
      default:
        return "text-muted-foreground"
    }
  }

  /**
   * Handle elder deletion
   * @param elderId - The ID of the elder to delete
   */
  const handleDeleteElder = (elderId: string) => {
    // In production, this would call an API to delete the elder
    setElders((prev) => prev.filter((elder) => elder.id !== elderId))
    console.log(`Deleting elder ${elderId}`)
  }

  /**
   * Calculate total connected services for an elder
   * @param services - Array of connected services
   * @returns Number of connected services
   */
  const getConnectedServicesCount = (services: ConnectedService[]): number => {
    return services.filter((service) => service.status === "connected").length
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading elders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Protected Elders</h1>
            <p className="text-muted-foreground">Manage and monitor your loved ones&apos; protection</p>
          </div>
          <Link href="/elders/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Elder
            </Button>
          </Link>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by name, relationship, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Status: {filterStatus}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFilterStatus("all")}>All</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("active")}>Active</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("inactive")}>Inactive</DropdownMenuItem>
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
                    <DropdownMenuItem onClick={() => setFilterRisk("low")}>Low</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterRisk("medium")}>Medium</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterRisk("high")}>High</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Elders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredElders.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No elders found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterStatus !== "all" || filterRisk !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first elder"}
              </p>
              <Link href="/elders/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Elder
                </Button>
              </Link>
            </div>
          ) : (
            filteredElders.map((elder) => (
              <Card key={elder.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={elder.photoURL || "/placeholder.svg"} alt={elder.name} />
                        <AvatarFallback className="text-lg">
                          {elder.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{elder.name}</CardTitle>
                        <CardDescription>
                          {elder.relationship} • Age {elder.age}
                        </CardDescription>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant={getRiskBadgeColor(elder.riskLevel)}>{elder.riskLevel} Risk</Badge>
                          {elder.recentAlerts > 0 && <Badge variant="destructive">{elder.recentAlerts} alerts</Badge>}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/elders/${elder.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/elders/${elder.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteElder(elder.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{elder.phoneNumber}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{elder.email}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">Connected Services</h4>
                    <div className="grid grid-cols-5 gap-2">
                      {elder.connectedServices.map((service, index) => {
                        const IconComponent = getServiceIcon(service.type)
                        return (
                          <div key={`${elder.id}-service-${index}`} className="text-center">
                            <div
                              className={`p-2 rounded-lg border ${
                                service.status === "connected"
                                  ? "bg-green-50 border-green-200"
                                  : service.status === "error"
                                    ? "bg-red-50 border-red-200"
                                    : "bg-muted border-border"
                              }`}
                            >
                              <IconComponent className={`h-4 w-4 mx-auto ${getServiceStatusColor(service.status)}`} />
                            </div>
                            {service.alerts > 0 && (
                              <Badge variant="destructive" className="text-xs mt-1">
                                {service.alerts}
                              </Badge>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {getConnectedServicesCount(elder.connectedServices)} of {elder.connectedServices.length} services
                      connected
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-xs text-muted-foreground">Last activity: {elder.lastActivity}</span>
                    <Link href={`/elders/${elder.id}`}>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
