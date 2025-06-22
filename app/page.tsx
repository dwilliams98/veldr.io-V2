import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Users, AlertTriangle } from "lucide-react"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10">
              <Image
                src="/V3-Aluma ai-05 copy.jpg"
                alt="Veldr.io"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent">
              VELDR.IO
            </span>
          </div>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <Image
                src="/V3-Aluma ai-05 copy.jpg"
                alt="Veldr.io"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-6">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent">
                AI Protection
              </span>{" "}
              for the Ones Who Raised Us
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Veldr.io uses advanced AI to monitor phone calls, emails, banking, and social media to detect fraud in
            real-time, providing caregivers with instant alerts and transparent fraud detection.
          </p>
          <Link href="/register">
            <Button size="lg" className="text-lg px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Start Protecting Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How Veldr.io Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow border-purple-100">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-purple-800">Multi-Channel Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor phone calls, emails, banking, and social media for suspicious activity using advanced AI
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-purple-100">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-100 to-red-100 flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-purple-800">Instant Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get immediate SMS and email notifications when potential fraud is detected across any channel
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-purple-100">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-purple-800">Trusted Network</CardTitle>
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
      <footer className="bg-gradient-to-r from-purple-50 to-pink-50 text-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="relative w-8 h-8">
              <Image
                src="/V3-Aluma ai-05 copy.jpg"
                alt="Veldr.io"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent">
              VELDR.IO
            </span>
          </div>
          <p className="text-purple-700">&copy; 2024 Veldr.io. Protecting families through transparent AI.</p>
        </div>
      </footer>
    </div>
  )
}