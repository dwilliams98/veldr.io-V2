import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Users, AlertTriangle } from "lucide-react"
import VeldrLogo from "@/components/veldr-logo"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-veldr-navy via-veldr-navy-light to-veldr-navy">
      {/* Header */}
      <header className="border-b border-veldr-primary/20 bg-veldr-navy/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <VeldrLogo size="lg" />
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:bg-veldr-primary/20 hover:text-veldr-primary">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-veldr-gradient hover:opacity-90 text-white font-semibold">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Protect Your Loved Ones from <span className="veldr-text-gradient">Elder Fraud</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Veldr.io uses advanced AI to monitor phone calls, emails, banking, and social media to detect fraud in
            real-time, providing caregivers with instant alerts and transparent fraud detection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-veldr-gradient hover:opacity-90 text-white font-semibold text-lg px-8 py-4"
              >
                Start Protecting Today
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-veldr-primary text-veldr-primary hover:bg-veldr-primary hover:text-white text-lg px-8 py-4"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          How <span className="veldr-text-gradient">Veldr.io</span> Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-sm border-veldr-primary/30 hover:border-veldr-primary/50 transition-all">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-veldr-gradient rounded-full flex items-center justify-center">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl">Multi-Channel Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-center">
                Monitor phone calls, emails, banking, and social media for suspicious activity using advanced AI
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-veldr-primary/30 hover:border-veldr-primary/50 transition-all">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-veldr-gradient rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl">Instant Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-center">
                Get immediate SMS and email notifications when potential fraud is detected across any channel
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-veldr-primary/30 hover:border-veldr-primary/50 transition-all">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-veldr-gradient rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl">Trusted Network</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-center">
                Invite family members and create a network of trusted contacts for comprehensive care
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to protect your loved ones?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of families who trust Veldr.io to keep their elders safe from fraud.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-veldr-gradient hover:opacity-90 text-white font-semibold text-lg px-12 py-4"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-veldr-navy border-t border-veldr-primary/20 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <VeldrLogo size="md" />
            <p className="text-gray-400 mt-4 md:mt-0">
              &copy; 2024 Veldr.io. AI Protection for the ones who raised us.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
