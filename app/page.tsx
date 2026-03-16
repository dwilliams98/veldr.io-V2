import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Users, AlertTriangle, CheckCircle, ArrowRight, Shield, Mail, CreditCard } from "lucide-react"
import { APP_VERSION } from "@/config/version"
import { VeldrLogo } from "@/components/veldr-logo"
import ScamChecker from "@/components/scam-checker"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <VeldrLogo size="md" variant="full" />
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                Sign in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="btn-veldr-primary">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 lg:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs">
            Trusted by 10,000+ families
          </Badge>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight tracking-tight">
            Protect Your Loved Ones from{" "}
            <span className="text-primary">Elder Fraud</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            AI-powered monitoring for phone calls, emails, banking, and social media. 
            Get instant alerts when suspicious activity is detected.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto btn-veldr-primary">
                Start Free Protection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign in to your account
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            No credit card required · 30-day free trial · Cancel anytime
          </p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-y bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto text-center">
            <div>
              <div className="text-2xl font-bold text-foreground">10K+</div>
              <div className="text-xs text-muted-foreground">Families Protected</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">50K+</div>
              <div className="text-xs text-muted-foreground">Scams Blocked</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">99.9%</div>
              <div className="text-xs text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12 lg:py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            How Veldr.io Keeps Your Family Safe
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive protection across multiple channels to catch fraud before it happens
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Multi-Channel Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Monitor phone calls, emails, banking, and social media for suspicious activity using advanced AI.
              </CardDescription>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  Real-time call analysis
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  Email phishing detection
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  Banking fraud alerts
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <CardTitle className="text-lg">Instant Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Get immediate SMS and email notifications when potential fraud is detected across any channel.
              </CardDescription>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  Instant notifications
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  Detailed threat analysis
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  Family network alerts
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="text-lg">Family Network</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Invite family members and create a network of trusted contacts for comprehensive care.
              </CardDescription>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  Multiple caregivers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  Shared monitoring
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  Emergency contacts
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Scam Checker */}
      <section className="container mx-auto px-4 py-12 lg:py-16">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-3 px-3 py-1 text-xs">
            Try it free — no account needed
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 tracking-tight">
            Not sure if a message is a scam?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Paste or upload any suspicious message and our AI will instantly analyse it for
            common fraud patterns.
          </p>
        </div>
        <ScamChecker />
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50 border-y">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Ready to protect your loved ones?
            </h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of families who trust Veldr.io to keep their elders safe from fraud.
            </p>
            <Link href="/register">
              <Button size="lg" className="btn-veldr-primary">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground mt-4">
              No setup fees · Cancel anytime · 24/7 support
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <VeldrLogo size="sm" variant="full" />
              <nav className="flex items-center gap-4 text-sm text-muted-foreground">
                <Link href="#" className="hover:text-foreground transition-colors">Features</Link>
                <Link href="#" className="hover:text-foreground transition-colors">Pricing</Link>
                <Link href="#" className="hover:text-foreground transition-colors">Help</Link>
                <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
              </nav>
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; 2024 Veldr.io · v{APP_VERSION}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
