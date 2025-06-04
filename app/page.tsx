import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Phone, Users, AlertTriangle } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Veldr.io</span>
          </div>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Protect Your Loved Ones from Elder Fraud</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Veldr.io uses advanced AI to monitor phone calls, emails, banking, and social media to detect fraud in
          real-time, providing caregivers with instant alerts and transparent fraud detection.
        </p>
        <Link href="/register">
          <Button size="lg" className="text-lg px-8 py-3">
            Start Protecting Today
          </Button>
        </Link>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How Veldr.io Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Phone className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Multi-Channel Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor phone calls, emails, banking, and social media for suspicious activity using advanced AI
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <AlertTriangle className="h-12 w-12 text-orange-600 mb-4" />
              <CardTitle>Instant Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get immediate SMS and email notifications when potential fraud is detected across any channel
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Trusted Network</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Invite family members and create a network of trusted contacts for comprehensive care
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Veldr.io. Protecting families through transparent AI.</p>
        </div>
      </footer>
    </div>
  )
}
