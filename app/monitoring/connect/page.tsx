"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Phone,
  Mail,
  CreditCard,
  Database,
  Globe,
  Shield,
  CheckCircle,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  Building,
  Smartphone,
} from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"

// Type definitions for service connections
interface ServiceProvider {
  id: string
  name: string
  category: "banking" | "email" | "social" | "phone" | "databreach"
  icon: React.ComponentType<{ className?: string }>
  description: string
  features: string[]
  connectionType: "oauth" | "credentials" | "api_key" | "phone_number"
  isPopular: boolean
  estimatedSetupTime: string
  securityLevel: "high" | "medium" | "low"
  status: "available" | "connected" | "pending" | "error"
}

interface ConnectionStep {
  id: string
  title: string
  description: string
  completed: boolean
  current: boolean
}

// Mock service providers data
const mockServiceProviders: ServiceProvider[] = [
  // Banking Services
  {
    id: "chase",
    name: "Chase Bank",
    category: "banking",
    icon: Building,
    description: "Monitor checking, savings, and credit card accounts",
    features: ["Transaction monitoring", "Unusual spending alerts", "Account access tracking"],
    connectionType: "oauth",
    isPopular: true,
    estimatedSetupTime: "2-3 minutes",
    securityLevel: "high",
    status: "available",
  },
  {
    id: "bofa",
    name: "Bank of America",
    category: "banking",
    icon: Building,
    description: "Comprehensive account monitoring and fraud detection",
    features: ["Real-time alerts", "Transaction categorization", "Spending analysis"],
    connectionType: "oauth",
    isPopular: true,
    estimatedSetupTime: "2-3 minutes",
    securityLevel: "high",
    status: "available",
  },
  {
    id: "wells_fargo",
    name: "Wells Fargo",
    category: "banking",
    icon: Building,
    description: "Monitor all Wells Fargo accounts and cards",
    features: ["Account monitoring", "Fraud alerts", "Transaction history"],
    connectionType: "oauth",
    isPopular: false,
    estimatedSetupTime: "3-4 minutes",
    securityLevel: "high",
    status: "available",
  },

  // Email Services
  {
    id: "gmail",
    name: "Gmail",
    category: "email",
    icon: Mail,
    description: "Scan emails for phishing attempts and suspicious content",
    features: ["Phishing detection", "Suspicious link analysis", "Sender verification"],
    connectionType: "oauth",
    isPopular: true,
    estimatedSetupTime: "1-2 minutes",
    securityLevel: "high",
    status: "available",
  },
  {
    id: "outlook",
    name: "Outlook",
    category: "email",
    icon: Mail,
    description: "Microsoft Outlook email protection and monitoring",
    features: ["Email scanning", "Attachment analysis", "Spam detection"],
    connectionType: "oauth",
    isPopular: true,
    estimatedSetupTime: "1-2 minutes",
    securityLevel: "high",
    status: "available",
  },
  {
    id: "yahoo",
    name: "Yahoo Mail",
    category: "email",
    icon: Mail,
    description: "Yahoo email account monitoring and protection",
    features: ["Email monitoring", "Phishing protection", "Content analysis"],
    connectionType: "oauth",
    isPopular: false,
    estimatedSetupTime: "2-3 minutes",
    securityLevel: "medium",
    status: "available",
  },

  // Social Media Services
  {
    id: "facebook",
    name: "Facebook",
    category: "social",
    icon: Globe,
    description: "Monitor Facebook account for suspicious activity",
    features: ["Profile monitoring", "Message scanning", "Privacy breach alerts"],
    connectionType: "oauth",
    isPopular: true,
    estimatedSetupTime: "2-3 minutes",
    securityLevel: "medium",
    status: "available",
  },
  {
    id: "instagram",
    name: "Instagram",
    category: "social",
    icon: Globe,
    description: "Instagram account security and monitoring",
    features: ["Account monitoring", "Suspicious activity alerts", "Privacy settings"],
    connectionType: "oauth",
    isPopular: false,
    estimatedSetupTime: "2-3 minutes",
    securityLevel: "medium",
    status: "available",
  },

  // Phone Services
  {
    id: "phone_monitoring",
    name: "Phone Call Monitoring",
    category: "phone",
    icon: Phone,
    description: "AI-powered call analysis and scam detection",
    features: ["Real-time call analysis", "Voice AI verification", "Scam pattern detection"],
    connectionType: "phone_number",
    isPopular: true,
    estimatedSetupTime: "5-10 minutes",
    securityLevel: "high",
    status: "available",
  },

  // Data Breach Monitoring
  {
    id: "haveibeenpwned",
    name: "Data Breach Monitor",
    category: "databreach",
    icon: Database,
    description: "Monitor for personal information in data breaches",
    features: ["Dark web monitoring", "Breach notifications", "Identity theft alerts"],
    connectionType: "api_key",
    isPopular: true,
    estimatedSetupTime: "1-2 minutes",
    securityLevel: "high",
    status: "available",
  },
]

export default function ConnectServicePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("banking")
  const [selectedService, setSelectedService] = useState<ServiceProvider | null>(null)
  const [connectionStep, setConnectionStep] = useState(0)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionData, setConnectionData] = useState<Record<string, any>>({})
  const [showCredentials, setShowCredentials] = useState(false)
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

  const categories = [
    { id: "banking", label: "Banking & Finance", icon: CreditCard, count: 3 },
    { id: "email", label: "Email Providers", icon: Mail, count: 3 },
    { id: "social", label: "Social Media", icon: Globe, count: 2 },
    { id: "phone", label: "Phone Services", icon: Phone, count: 1 },
    { id: "databreach", label: "Data Monitoring", icon: Database, count: 1 },
  ]

  const connectionSteps: ConnectionStep[] = [
    {
      id: "select",
      title: "Select Service",
      description: "Choose the service you want to connect",
      completed: !!selectedService,
      current: connectionStep === 0,
    },
    {
      id: "authorize",
      title: "Authorize Access",
      description: "Grant permission to monitor your account",
      completed: connectionStep > 1,
      current: connectionStep === 1,
    },
    {
      id: "configure",
      title: "Configure Settings",
      description: "Set up monitoring preferences",
      completed: connectionStep > 2,
      current: connectionStep === 2,
    },
    {
      id: "complete",
      title: "Complete Setup",
      description: "Finalize your service connection",
      completed: connectionStep === 3,
      current: connectionStep === 3,
    },
  ]

  /**
   * Get filtered services by category
   * @param category - The category to filter by
   * @returns Filtered array of service providers
   */
  const getServicesByCategory = (category: string): ServiceProvider[] => {
    return mockServiceProviders.filter((service) => service.category === category)
  }

  /**
   * Get security badge color based on security level
   * @param level - The security level
   * @returns Badge variant
   */
  const getSecurityBadgeColor = (level: string) => {
    switch (level) {
      case "high":
        return "default"
      case "medium":
        return "secondary"
      case "low":
        return "destructive"
      default:
        return "default"
    }
  }

  /**
   * Handle service selection
   * @param service - The selected service provider
   */
  const handleServiceSelect = (service: ServiceProvider) => {
    setSelectedService(service)
    setConnectionStep(1)
  }

  /**
   * Handle OAuth authorization
   * @param service - The service to authorize
   */
  const handleOAuthAuthorization = async (service: ServiceProvider) => {
    setIsConnecting(true)
    try {
      // Simulate OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In production, this would:
      // 1. Redirect to OAuth provider
      // 2. Handle callback
      // 3. Store access tokens securely
      console.log(`Initiating OAuth for ${service.name}`)

      setConnectionStep(2)
    } catch (error) {
      console.error("OAuth authorization failed:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  /**
   * Handle credential-based connection
   * @param service - The service to connect
   * @param credentials - The user credentials
   */
  const handleCredentialConnection = async (service: ServiceProvider, credentials: Record<string, string>) => {
    setIsConnecting(true)
    try {
      // Simulate credential validation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In production, this would:
      // 1. Validate credentials securely
      // 2. Establish connection
      // 3. Store encrypted credentials
      console.log(`Connecting to ${service.name} with credentials`)

      setConnectionData(credentials)
      setConnectionStep(2)
    } catch (error) {
      console.error("Credential connection failed:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  /**
   * Handle phone number setup
   * @param phoneNumber - The phone number to monitor
   */
  const handlePhoneSetup = async (phoneNumber: string) => {
    setIsConnecting(true)
    try {
      // Simulate phone verification
      await new Promise((resolve) => setTimeout(resolve, 3000))

      console.log(`Setting up phone monitoring for ${phoneNumber}`)
      setConnectionData({ phoneNumber })
      setConnectionStep(2)
    } catch (error) {
      console.error("Phone setup failed:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  /**
   * Complete the service connection
   */
  const handleCompleteConnection = async () => {
    setIsConnecting(true)
    try {
      // Simulate final setup
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log(`Successfully connected ${selectedService?.name}`)
      setConnectionStep(3)

      // Redirect back to monitoring page after success
      setTimeout(() => {
        router.push("/monitoring")
      }, 2000)
    } catch (error) {
      console.error("Connection completion failed:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  /**
   * Reset the connection flow
   */
  const handleReset = () => {
    setSelectedService(null)
    setConnectionStep(0)
    setConnectionData({})
    setIsConnecting(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading service connections...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/monitoring">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Monitoring
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Connect Services</h1>
              <p className="text-gray-600">Authorize access to third-party services for comprehensive protection</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              {connectionSteps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      step.completed
                        ? "bg-green-600 border-green-600 text-white"
                        : step.current
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-gray-200 border-gray-300 text-gray-500"
                    }`}
                  >
                    {step.completed ? <CheckCircle className="h-4 w-4" /> : <span>{index + 1}</span>}
                  </div>
                  {index < connectionSteps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-2 ${step.completed ? "bg-green-600" : "bg-gray-300"}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h3 className="font-medium text-lg">{connectionSteps.find((step) => step.current)?.title}</h3>
              <p className="text-gray-600">{connectionSteps.find((step) => step.current)?.description}</p>
            </div>
            <Progress value={(connectionStep / (connectionSteps.length - 1)) * 100} className="mt-4" />
          </CardContent>
        </Card>

        {/* Step Content */}
        {connectionStep === 0 && (
          <div className="space-y-6">
            {/* Category Tabs */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid w-full grid-cols-5">
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-2">
                    <category.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{category.label}</span>
                    <Badge variant="secondary" className="ml-1">
                      {category.count}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getServicesByCategory(category.id).map((service) => (
                      <Card
                        key={service.id}
                        className="hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => handleServiceSelect(service)}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 rounded-lg bg-gray-100">
                                <service.icon className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{service.name}</CardTitle>
                                <div className="flex items-center space-x-2 mt-1">
                                  {service.isPopular && <Badge variant="default">Popular</Badge>}
                                  <Badge variant={getSecurityBadgeColor(service.securityLevel)}>
                                    <Lock className="h-3 w-3 mr-1" />
                                    {service.securityLevel} security
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="mb-4">{service.description}</CardDescription>
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium text-sm mb-2">Features:</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {service.features.map((feature, index) => (
                                  <li key={`${service.id}-feature-${index}`} className="flex items-center">
                                    <CheckCircle className="h-3 w-3 text-green-600 mr-2 flex-shrink-0" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-500">
                              <span>Setup time: {service.estimatedSetupTime}</span>
                              <Button size="sm">
                                Connect
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}

        {/* Authorization Step */}
        {connectionStep === 1 && selectedService && (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-gray-100">
                  <selectedService.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Connect to {selectedService.name}</CardTitle>
                  <CardDescription>
                    Authorize Veldr.io to monitor your {selectedService.name} account for fraud protection
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* OAuth Authorization */}
              {selectedService.connectionType === "oauth" && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Secure OAuth Connection</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          You'll be redirected to {selectedService.name} to securely authorize access. We never store
                          your login credentials.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">What we'll monitor:</h4>
                    <ul className="space-y-2">
                      {selectedService.features.map((feature, index) => (
                        <li key={`auth-feature-${index}`} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex space-x-3">
                    <Button onClick={() => handleOAuthAuthorization(selectedService)} disabled={isConnecting}>
                      {isConnecting ? "Connecting..." : `Connect to ${selectedService.name}`}
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                    <Button variant="outline" onClick={handleReset}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Credential-based Connection */}
              {selectedService.connectionType === "credentials" && (
                <div className="space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-900">Secure Credential Storage</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Your credentials are encrypted and stored securely. We use bank-level security to protect your
                          information.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username">Username or Email</Label>
                      <Input
                        id="username"
                        placeholder="Enter your username or email"
                        value={connectionData.username || ""}
                        onChange={(e) => setConnectionData({ ...connectionData, username: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showCredentials ? "text" : "password"}
                          placeholder="Enter your password"
                          value={connectionData.password || ""}
                          onChange={(e) => setConnectionData({ ...connectionData, password: e.target.value })}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowCredentials(!showCredentials)}
                        >
                          {showCredentials ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handleCredentialConnection(selectedService, connectionData)}
                      disabled={isConnecting || !connectionData.username || !connectionData.password}
                    >
                      {isConnecting ? "Connecting..." : "Connect Account"}
                    </Button>
                    <Button variant="outline" onClick={handleReset}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Phone Number Setup */}
              {selectedService.connectionType === "phone_number" && (
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-start space-x-3">
                      <Smartphone className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900">Phone Call Monitoring</h4>
                        <p className="text-sm text-green-700 mt-1">
                          We'll monitor incoming calls to detect potential scams and fraud attempts in real-time.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={connectionData.phoneNumber || ""}
                      onChange={(e) => setConnectionData({ ...connectionData, phoneNumber: e.target.value })}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Enter the phone number you want to monitor for suspicious calls
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handlePhoneSetup(connectionData.phoneNumber)}
                      disabled={isConnecting || !connectionData.phoneNumber}
                    >
                      {isConnecting ? "Setting up..." : "Setup Phone Monitoring"}
                    </Button>
                    <Button variant="outline" onClick={handleReset}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Configuration Step */}
        {connectionStep === 2 && selectedService && (
          <Card>
            <CardHeader>
              <CardTitle>Configure {selectedService.name} Monitoring</CardTitle>
              <CardDescription>Set up your monitoring preferences and alert settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Alert Preferences</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span>Send immediate alerts for critical threats</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span>Include detailed analysis in alerts</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span>Send daily summary reports</span>
                    </label>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Monitoring Sensitivity</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="sensitivity" value="high" className="rounded" />
                      <span>High - Detect more potential threats (may increase false positives)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="sensitivity" value="medium" defaultChecked className="rounded" />
                      <span>Medium - Balanced detection (recommended)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="sensitivity" value="low" className="rounded" />
                      <span>Low - Only detect obvious threats</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button onClick={handleCompleteConnection} disabled={isConnecting}>
                  {isConnecting ? "Finalizing..." : "Complete Setup"}
                </Button>
                <Button variant="outline" onClick={() => setConnectionStep(1)}>
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completion Step */}
        {connectionStep === 3 && selectedService && (
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Successfully Connected!</h3>
                  <p className="text-gray-600 mt-2">
                    {selectedService.name} is now connected and monitoring for suspicious activity.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700">
                    Monitoring will begin immediately. You'll receive alerts if any suspicious activity is detected.
                  </p>
                </div>
                <div className="flex justify-center space-x-3">
                  <Link href="/monitoring">
                    <Button>View Monitoring Dashboard</Button>
                  </Link>
                  <Button variant="outline" onClick={handleReset}>
                    Connect Another Service
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
