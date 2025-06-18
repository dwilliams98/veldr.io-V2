"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  HelpCircle, 
  Shield, 
  AlertTriangle,
  Clock,
  CheckCircle,
  ExternalLink
} from 'lucide-react'
import Navbar from '@/components/navbar'
import VoiceAssistant from '@/components/voice-assistant'

interface SupportTicket {
  id: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'resolved'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: 'technical' | 'billing' | 'fraud_alert' | 'general'
  createdAt: string
  updatedAt: string
}

const mockTickets: SupportTicket[] = [
  {
    id: '1',
    title: 'False fraud alert for legitimate bank transaction',
    description: 'The system flagged my mother\'s grocery store purchase as suspicious',
    status: 'resolved',
    priority: 'medium',
    category: 'fraud_alert',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
  },
  {
    id: '2',
    title: 'Unable to add second elder to account',
    description: 'Getting an error when trying to add my father-in-law to monitoring',
    status: 'in_progress',
    priority: 'medium',
    category: 'technical',
    createdAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
  },
]

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('veldr_token')
      if (!token) {
        router.push('/login')
        return
      }
    }

    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [router])

  const handleIntentDetected = (intent: string) => {
    setSelectedIntent(intent)
    
    // Auto-escalate critical intents
    if (intent === 'fraud_alert' || intent === 'emergency') {
      // In a real app, this would trigger immediate escalation
      console.log('Critical intent detected, escalating to human support')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'destructive'
      case 'in_progress':
        return 'secondary'
      case 'resolved':
        return 'default'
      default:
        return 'default'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600'
      case 'high':
        return 'text-orange-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading support...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Support Center</h1>
            <p className="text-muted-foreground">Get help with Veldr.io and protect your loved ones</p>
          </div>
          
          {selectedIntent && (
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">
                {selectedIntent === 'fraud_alert' && 'Fraud Alert Detected'}
                {selectedIntent === 'emergency' && 'Emergency Detected'}
                {selectedIntent === 'support' && 'Support Request'}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Voice Assistant */}
          <div className="lg:col-span-2">
            <VoiceAssistant
              userType="caregiver"
              onIntentDetected={handleIntentDetected}
              className="h-[700px]"
            />
          </div>

          {/* Support Options & Tickets */}
          <div className="space-y-6">
            {/* Quick Support Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Support</CardTitle>
                <CardDescription>Get immediate help</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Support: (555) 123-4567
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Email: support@veldr.io
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Knowledge Base
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-lg text-red-800 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Emergency Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700 mb-3">
                  If you or your loved one is experiencing an active fraud attempt or emergency:
                </p>
                <Button variant="destructive" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Emergency Line: (555) 911-HELP
                </Button>
              </CardContent>
            </Card>

            {/* Recent Tickets */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Support Tickets</CardTitle>
                <CardDescription>Track your recent requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {tickets.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No support tickets yet
                  </p>
                ) : (
                  tickets.map((ticket) => (
                    <div key={ticket.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm line-clamp-2">{ticket.title}</h4>
                        <Badge variant={getStatusColor(ticket.status)} className="text-xs ml-2">
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className={getPriorityColor(ticket.priority)}>
                          {ticket.priority} priority
                        </span>
                        <span>{formatDate(ticket.updatedAt)}</span>
                      </div>
                    </div>
                  ))
                )}
                <Button variant="outline" size="sm" className="w-full">
                  View All Tickets
                </Button>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Fraud Detection</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Voice Assistant</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Monitoring Services</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Operational</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}