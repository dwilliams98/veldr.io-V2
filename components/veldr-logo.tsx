"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface VeldrLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "full" | "icon" | "text"
  className?: string
  showTagline?: boolean
}

const sizeClasses = {
  sm: "h-6",
  md: "h-8",
  lg: "h-12",
  xl: "h-16",
}

const textSizeClasses = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-3xl",
}

export function VeldrLogo({ size = "md", variant = "full", className, showTagline = false }: VeldrLogoProps) {
  if (variant === "full") {
    return (
      <div className={cn("flex items-center space-x-3", className)}>
        <div className="relative">
          <Image
            src="/veldr-logo.png"
            alt="Veldr.io"
            width={size === "xl" ? 200 : size === "lg" ? 150 : size === "md" ? 120 : 80}
            height={size === "xl" ? 80 : size === "lg" ? 60 : size === "md" ? 48 : 32}
            className="veldr-logo-glow"
            priority
          />
        </div>
        {showTagline && (
          <div className="flex flex-col">
            <span className={cn("font-bold text-primary", textSizeClasses[size])}>Veldr.io</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              AI Protection for the Ones Who Raised Us
            </span>
          </div>
        )}
      </div>
    )
  }

  if (variant === "icon") {
    return (
      <div className={cn("relative", className)}>
        <div className={cn("w-10 h-10 rounded-lg veldr-gradient flex items-center justify-center", sizeClasses[size])}>
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    )
  }

  return <span className={cn("font-bold text-primary", textSizeClasses[size], className)}>Veldr.io</span>
}

export default VeldrLogo
