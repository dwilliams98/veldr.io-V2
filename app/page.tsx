import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Users, AlertTriangle, CheckCircle, Star, ArrowRight, Play } from "lucide-react"
import { APP_VERSION } from "@/config/version"
import { VeldrLogo } from "@/components/veldr-logo"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50 border-border/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <VeldrLogo size="lg" variant="full" />
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="hidden sm:inline-flex hover:bg-accent/10">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="btn-veldr-primary">
                <span className="hidden sm:inline">Get Started Free</span>
                <span className="sm:hidden">Sign Up</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center max-w-5xl mx-auto">
          <Badge variant="secondary" className="mb-6 px-4 py-2 bg-primary/10 text-primary border-primary/20">
            <Star className="h-3 w-3 mr-1" />
            Trusted by 10,000+ families
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
            Protect Your Loved Ones from{" "}
            <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Elder Fraud
            </span>
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed">
            Advanced AI monitors phone calls, emails, banking, and social media in real-time. Get instant alerts when
            suspicious activity is detected, with complete transparency and family involvement.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-10">
            <Link href="/register">
              <Button
                size="lg"
                className="w-full sm:w-auto text-lg px-10 py-6 btn-veldr-primary text-white font-semibold"
              >
                Start Free Protection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-lg px-10 py-6 border-primary/20 hover:bg-primary/5"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            ✓ No credit card required ✓ 30-day free trial ✓ Cancel anytime
          </p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="container mx-auto px-4 py-12 border-y bg-primary/5 border-border/50">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-6">Trusted by families nationwide</p>
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">10K+</div>
              <div className="text-sm text-muted-foreground">Families Protected</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">50K+</div>
              <div className="text-sm text-muted-foreground">Scams Blocked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            How Veldr.io Keeps Your Family Safe
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive protection system monitors multiple channels to catch fraud before it happens
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          <Card className="veldr-card-premium group hover:scale-105 transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-6 w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Phone className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-xl mb-3">Multi-Channel Detection</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-base leading-relaxed mb-6">
                Monitor phone calls, emails, banking, and social media for suspicious activity using advanced AI
              </CardDescription>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  Real-time call analysis
                </li>
                <li className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  Email phishing detection
                </li>
                <li className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  Banking fraud alerts
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="veldr-card-premium group hover:scale-105 transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-6 w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <AlertTriangle className="h-10 w-10 text-orange-600" />
              </div>
              <CardTitle className="text-xl mb-3">Instant Alerts</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-base leading-relaxed mb-6">
                Get immediate SMS and email notifications when potential fraud is detected across any channel
              </CardDescription>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  Instant notifications
                </li>
                <li className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  Detailed threat analysis
                </li>
                <li className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  Family network alerts
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="veldr-card-premium group hover:scale-105 transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-6 w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Users className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-xl mb-3">Family Network</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-base leading-relaxed mb-6">
                Invite family members and create a network of trusted contacts for comprehensive care
              </CardDescription>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  Multiple caregivers
                </li>
                <li className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  Shared monitoring
                </li>
                <li className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  Emergency contacts
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-y border-border/50">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-8">
              Ready to protect your loved ones?
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Join thousands of families who trust Veldr.io to keep their elders safe from fraud. Start your free trial
              today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-lg px-12 py-6 btn-veldr-primary text-white font-semibold"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">No setup fees • Cancel anytime • 24/7 support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/5 border-t border-border/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <VeldrLogo size="md" variant="full" showTagline className="mb-6" />
              <p className="text-muted-foreground mb-4 max-w-md">
                AI-powered protection for the ones who raised us. Transparent, reliable, and family-focused.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>
              &copy; 2024 Veldr.io. Protecting families through transparent AI.{" "}
              <span className="text-primary font-medium">v{APP_VERSION}</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
