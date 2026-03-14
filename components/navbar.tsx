"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Settings, LogOut, User, Menu, Bell, HelpCircle, AlertTriangle, CheckCircle, LayoutDashboard, Shield, Users, AlertCircle } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { APP_VERSION } from "@/config/version"
import { VeldrLogo } from "@/components/veldr-logo"

export default function Navbar() {
  const { user, notifications, markNotificationAsRead, markAllNotificationsAsRead, setUser } = useApp()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("veldr_token")
      setIsAuthenticated(!!token)
    }
  }, [pathname])

  const handleLogout = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("veldr_token")
      }
      setUser(null)
      setIsAuthenticated(false)
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleProfileClick = () => {
    router.push("/profile")
  }

  const handleSettingsClick = () => {
    router.push("/settings")
  }

  const handleHelpClick = () => {
    window.open("https://help.veldr.io", "_blank")
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", description: "Overview and quick actions", icon: LayoutDashboard },
    { href: "/monitoring", label: "Monitoring", description: "Service connections and health", icon: Shield },
    { href: "/elders", label: "Elders", description: "Manage protected family members", icon: Users },
    { href: "/alerts", label: "Alerts", description: "Security alerts and notifications", icon: AlertCircle },
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Bell className="h-4 w-4 text-primary" />
    }
  }

  return (
    <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href={isAuthenticated ? "/dashboard" : "/"}
          className="flex items-center hover:opacity-90 transition-opacity"
        >
          <VeldrLogo size="md" variant="full" />
        </Link>

        {isAuthenticated && (
          <>
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-9 w-9">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between px-3 py-2 border-b">
                    <span className="font-semibold text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={markAllNotificationsAsRead} className="text-xs h-7 px-2">
                        Mark all read
                      </Button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-muted-foreground">
                        <Bell className="h-8 w-8 mx-auto mb-2 opacity-40" />
                        <p className="text-sm">No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-3 py-2.5 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors ${
                            !notification.read ? "bg-primary/5" : ""
                          }`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-foreground leading-snug">{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                            </div>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Help */}
              <Button variant="ghost" size="icon" onClick={handleHelpClick} className="h-9 w-9">
                <HelpCircle className="h-5 w-5" />
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar || "/placeholder.svg?height=32&width=32"} alt="User" />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                        {user?.name?.split(" ").map((n) => n[0]).join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">{user?.name || "User"}</p>
                      <p className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfileClick}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSettingsClick}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleHelpClick}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help & Support
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden flex items-center gap-1">
              {/* Mobile Notifications */}
              <Button variant="ghost" size="icon" className="relative h-9 w-9" asChild>
                <Link href="/alerts">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>
              </Button>

              {/* Mobile Menu Sheet */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 p-0">
                  <SheetHeader className="p-4 border-b">
                    <SheetTitle className="flex items-center gap-2">
                      <VeldrLogo size="sm" variant="text" />
                      <Badge variant="secondary" className="text-xs">
                        v{APP_VERSION}
                      </Badge>
                    </SheetTitle>
                    <SheetDescription className="text-sm">Family protection dashboard</SheetDescription>
                  </SheetHeader>

                  <div className="py-2">
                    {navLinks.map((link) => {
                      const Icon = link.icon
                      const isActive = pathname === link.href
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                            isActive
                              ? "text-primary bg-primary/10 border-r-2 border-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Icon className="h-5 w-5" />
                          <div>
                            <div className="font-medium">{link.label}</div>
                            <div className="text-xs text-muted-foreground">{link.description}</div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>

                  <div className="border-t py-2">
                    <button onClick={handleProfileClick} className="flex items-center gap-3 px-4 py-3 w-full text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                      <User className="h-5 w-5" />
                      Profile
                    </button>
                    <button onClick={handleSettingsClick} className="flex items-center gap-3 px-4 py-3 w-full text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                      <Settings className="h-5 w-5" />
                      Settings
                    </button>
                    <button onClick={handleHelpClick} className="flex items-center gap-3 px-4 py-3 w-full text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                      <HelpCircle className="h-5 w-5" />
                      Help & Support
                    </button>
                  </div>

                  <div className="border-t py-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 w-full text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      Log out
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
