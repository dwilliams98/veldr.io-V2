"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Shield, Settings, LogOut, User, Menu, X } from "lucide-react"

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setIsClient(true)
    // Check authentication status only on client side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("veldr_token")
      setIsAuthenticated(!!token)
    }
  }, [])

  const handleLogout = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("veldr_token")
      }
      setIsAuthenticated(false)
      setIsMobileMenuOpen(false)
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/monitoring", label: "Monitoring" },
    { href: "/elders", label: "Elders" },
    { href: "/alerts", label: "Alerts" },
  ]

  const handleNavClick = () => {
    setIsMobileMenuOpen(false)
  }

  // Show loading state or unauthenticated state until client-side hydration is complete
  if (!isClient) {
    return (
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50 safe-top">
        <div className="container mx-auto px-3 mobile:px-4 py-3 mobile:py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-6 w-6 mobile:h-8 mobile:w-8 text-primary" />
            <span className="text-lg mobile:text-2xl font-bold text-primary">Veldr.io</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              Login
            </Button>
            <Button size="sm">
              Get Started
            </Button>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50 safe-top">
      <div className="container mx-auto px-3 mobile:px-4 py-3 mobile:py-4 flex justify-between items-center">
        <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2">
          <Shield className="h-6 w-6 mobile:h-8 mobile:w-8 text-primary" />
          <span className="text-lg mobile:text-2xl font-bold text-primary">Veldr.io</span>
        </Link>

        {isAuthenticated ? (
          <>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm lg:text-base text-muted-foreground hover:text-foreground transition-colors ${
                    pathname === link.href ? "text-primary font-medium" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-6 w-6 text-primary" />
                        <span className="text-lg font-bold text-primary">Veldr.io</span>
                      </div>
                    </div>
                    
                    <nav className="flex flex-col space-y-3 flex-1">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={handleNavClick}
                          className={`flex items-center py-3 px-4 rounded-lg text-base transition-colors ${
                            pathname === link.href 
                              ? "bg-primary text-primary-foreground font-medium" 
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          }`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </nav>

                    <div className="border-t pt-4 mt-auto">
                      <div className="flex items-center space-x-3 mb-4 px-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">John Doe</p>
                          <p className="text-xs text-muted-foreground truncate">john@example.com</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 px-4">
                        <Button variant="ghost" className="w-full justify-start" size="sm">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" size="sm">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50" 
                          size="sm"
                          onClick={handleLogout}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">John Doe</p>
                      <p className="text-xs leading-none text-muted-foreground">john@example.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}