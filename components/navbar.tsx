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
import { Shield, Settings, LogOut, User, Menu, Bell, HelpCircle, AlertTriangle, CheckCircle } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { APP_VERSION } from "@/config/version"

export default function Navbar() {
  const { user, notifications, markNotificationAsRead, markAllNotificationsAsRead, setUser } = useApp()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check authentication status
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
    // Navigate to profile page (to be implemented)
    console.log("Navigate to profile")
  }

  const handleSettingsClick = () => {
    // Navigate to settings page (to be implemented)
    console.log("Navigate to settings")
  }

  const handleHelpClick = () => {
    // Open help center or support
    window.open("https://help.veldr.io", "_blank")
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", description: "Overview and quick actions" },
    { href: "/monitoring", label: "Monitoring", description: "Service connections and health" },
    { href: "/elders", label: "Elders", description: "Manage protected family members" },
    { href: "/alerts", label: "Alerts", description: "Security alerts and notifications" },
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Bell className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href={isAuthenticated ? "/dashboard" : "/"}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-primary">Veldr.io</span>
        </Link>

        {isAuthenticated && (
          <>
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted ${
                    pathname === link.href
                      ? "text-primary bg-primary/10 border border-primary/20"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between p-3 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={markAllNotificationsAsRead} className="text-xs">
                        Mark all read
                      </Button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer ${
                            !notification.read ? "bg-primary/5" : ""
                          }`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Help */}
              <Button variant="ghost" size="sm" onClick={handleHelpClick}>
                <HelpCircle className="h-5 w-5" />
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar || "/placeholder.svg?height=32&width=32"} alt="User" />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email || "user@example.com"}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={handleProfileClick}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={handleSettingsClick}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={handleHelpClick}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help & Support</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden flex items-center space-x-2">
              {/* Mobile Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <div className="flex items-center justify-between p-3 border-b">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={markAllNotificationsAsRead} className="text-xs">
                        Mark all read
                      </Button>
                    )}
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.slice(0, 3).map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b last:border-b-0 ${!notification.read ? "bg-primary/5" : ""}`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-2">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Sheet */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="flex items-center space-x-2">
                      <Shield className="h-6 w-6 text-primary" />
                      <span>Veldr.io</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        v{APP_VERSION}
                      </Badge>
                    </SheetTitle>
                    <SheetDescription>Navigate your family protection dashboard</SheetDescription>
                  </SheetHeader>

                  <div className="mt-6 space-y-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`block px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                          pathname === link.href
                            ? "text-primary bg-primary/10 border border-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div>
                          <div className="font-medium">{link.label}</div>
                          <div className="text-xs text-muted-foreground mt-1">{link.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t space-y-1">
                    <Button variant="ghost" className="w-full justify-start" size="sm" onClick={handleProfileClick}>
                      <User className="mr-2 h-4 w-4" />
                      Profile Settings
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" size="sm" onClick={handleHelpClick}>
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Help & Support
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
                </SheetContent>
              </Sheet>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
